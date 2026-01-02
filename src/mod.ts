import { analyzeProject } from "./project/analyze.ts";
import { loadTemplate } from "./templates/load.ts";
import { renderTemplate } from "./templates/render.ts";
import { ensureWritableOutput } from "./utils/file_system.ts";
import { exists } from "jsr:@std/fs/exists";
import { join } from "jsr:@std/path/join";

export type TemplateName = "minimal" | "modern" | "detailed";

export interface GenerateReadmeArgs {
  template: TemplateName | string;
  output: string;
  force: boolean;
}

export async function generateReadme(args: GenerateReadmeArgs): Promise<void> {
  const templateName = (args.template || "modern").toLowerCase();
  const profileTemplatePath = join(Deno.cwd(), "README.profile.md");
  const hasProfileTemplate = await exists(profileTemplatePath);

  const template = hasProfileTemplate
    ? await Deno.readTextFile(profileTemplatePath)
    : await loadTemplate(templateName);

  await ensureWritableOutput(args.output, { force: args.force });

  // Si hay README.profile.md, lo usamos como fuente para inferir descripción.
  const readmeSourcePath = hasProfileTemplate ? profileTemplatePath : args.output;

  const analysis = await analyzeProject({
    projectRoot: Deno.cwd(),
    readmePath: readmeSourcePath,
  });

  const markdown = renderTemplate(template, analysis.templateData);
  const cleaned = sanitizeGeneratedMarkdown(markdown);
  await Deno.writeTextFile(args.output, cleaned);

  console.log(`README generated: ${args.output}`);
}

export function sanitizeGeneratedMarkdown(markdown: string): string {
  // Normalizar BOM / caracteres invisibles si se cuelan al principio del archivo
  markdown = markdown.replace(/^[\uFEFF\u200B\u200C\u200D\u2060]+/, "");
  const lines = markdown.split(/\r?\n/);
  const out: string[] = [];

  let inFence = false;
  let fenceMarker: string | null = null;

  const bannerRx = /^!\[[^\]]*\]\(\/images\/banner-github\.webp\)\s*$/;
  const trashRegexes = [
    /^\s*export\s+interface\s+\w+\s*\{.*$/,
    /^\s*"badgeStyle"\s*:\s*"[^"]+".*$/,
    /^\s*import\s+type\s+\{\s*ExportInfo\s*\}.*$/,
    /^\s*import\s+\{.*\}\s+from\s+['"].*['"];?\s*$/,
    /^\s*import\s+.*\s+from\s+['"].*['"];?\s*$/,
    /^\s*exports\.push\(makeExportInfo\(.*\)\);\s*$/,
  ];

  function isTrashLine(line: string): boolean {
    const normalizedLine = line.replace(/^[\uFEFF\u200B\u200C\u200D\u2060]+/, "");
    const trimmed = normalizedLine.trim();
    if (!trimmed) return false;

    // Heurística: líneas de TypeScript que no deberían aparecer fuera de fences
    if (
      trimmed.startsWith("import ") && (trimmed.includes(" from ") || trimmed.includes("from\t"))
    ) return true;
    if (
      trimmed.startsWith("export ") &&
      (trimmed.includes("interface ") || trimmed.includes("type ") || trimmed.includes("function "))
    ) {
      return true;
    }

    if (trashRegexes.some((rx) => rx.test(normalizedLine))) return true;

    // Frases específicas que se estaban colando en README
    const needles = [
      "generateRepoBadges",
      "export interface BadgesConfig",
      "export interface RepoBadgesConfig",
      '"badgeStyle"',
      "Deno.readTextFile(filePath)",
      'd.id?.type === "Identifier"',
      'decl.type === "TsEnumDeclaration"',
      "const decl = node.decl",
      "if (paramMatch)",
      "makeExportInfo(",
      "{{repoBadges}}",
      "{{ciBadge}}",
    ];
    return needles.some((n) => normalizedLine.includes(n));
  }

  for (const line of lines) {
    const normalizedLine = line.replace(/^[\uFEFF\u200B\u200C\u200D\u2060]+/, "");
    const fenceMatch = normalizedLine.match(/^\s*(```+|~~~+)\s*/);
    if (fenceMatch) {
      const marker = fenceMatch[1];
      if (!inFence) {
        inFence = true;
        fenceMarker = marker;
      } else if (fenceMarker && marker.startsWith(fenceMarker[0])) {
        inFence = false;
        fenceMarker = null;
      }
      out.push(normalizedLine);
      continue;
    }

    if (!inFence && isTrashLine(normalizedLine)) continue;
    out.push(normalizedLine);
  }

  // Asegurar que el banner quede en la primera línea (requisito del README de perfil)
  const bannerIndex = out.findIndex((l) => bannerRx.test(l.trim()));
  if (bannerIndex >= 0) {
    const bannerLine = out[bannerIndex].trim();
    out.splice(bannerIndex, 1);
    // Eliminar líneas vacías al principio
    while (out.length && out[0].trim() === "") out.shift();
    out.unshift("", bannerLine);
    out.shift();
    // Asegurar una línea en blanco después del banner
    if (out.length >= 2 && out[1].trim() !== "") out.splice(1, 0, "");
  }

  return out.join("\n");
}
