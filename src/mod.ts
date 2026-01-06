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

  const trashPatterns = [
    /^\s*export\s+(interface|type|function)\s+\w+/,
    /^\s*import\s+({[\s\w,]+}|[\w,*]+\s+as\s+[\w,*]+|[\w,*]+)\s+from\s+['"]/,
    /^\s*["']badgeStyle["']\s*:/,
    /^\s*exports\.push\(makeExportInfo\(.*\)\);/,
  ];

  function isTrashLine(line: string): boolean {
    const trimmed = line.trim();
    if (!trimmed) return false;

    // Si la línea coincide con patrones conocidos de código TS/JS "basura"
    if (trashPatterns.some((rx) => rx.test(line))) return true;

    // Marcadores específicos que no deberían estar en el output final
    const illegalTokens = [
      "{{repoBadges}}",
      "{{ciBadge}}",
      "makeExportInfo(",
      "Deno.readTextFile(",
    ];
    return illegalTokens.some((token) => line.includes(token));
  }

  for (const line of lines) {
    const normalizedLine = line.replace(
      /^[\uFEFF\u200B\u200C\u200D\u2060]+/,
      "",
    );
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

  const bannerRx = /^!\[[^\]]*\]\(\/images\/banner-github\.webp\)\s*$/;
  const bannerIndex = out.findIndex((l) => bannerRx.test(l.trim()));
  if (bannerIndex >= 0) {
    const bannerLine = out[bannerIndex].trim();
    out.splice(bannerIndex, 1);
    while (out.length && out[0].trim() === "") out.shift();
    out.unshift("", bannerLine, "");
    // Limpieza de extra enters
    if (out[0] === "") out.shift();
  }

  return out.join("\n");
}
