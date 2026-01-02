import { renderTemplate } from "../src/templates/render.ts";
import { sanitizeGeneratedMarkdown } from "../src/mod.ts";

function buildTemplate(size: number): string {
  const lines: string[] = [];
  lines.push("![Glastor banner](/images/banner-github.webp)");
  lines.push("");
  lines.push("# {{title}}\n");
  for (let i = 0; i < size; i++) {
    lines.push(`- Item ${i}: {{value_${i}}}`);
  }
  return lines.join("\n");
}

function buildData(size: number): Record<string, string> {
  const data: Record<string, string> = { title: "Benchmark" };
  for (let i = 0; i < size; i++) data[`value_${i}`] = `v${i}`;
  return data;
}

Deno.bench("renderTemplate (200 placeholders)", () => {
  const template = buildTemplate(200);
  const data = buildData(200);
  renderTemplate(template, data);
});

Deno.bench("sanitizeGeneratedMarkdown (medium doc)", () => {
  const raw = [
    "\uFEFF\u200B", // invisibles que a veces se cuelan
    "![Glastor banner](/images/banner-github.webp)",
    "",
    "# Title",
    "",
    "export interface BadgesConfig {", // línea basura fuera de fence
    "  repo: string",
    "}",
    "",
    "```ts",
    "export interface KeepThis { ok: true }",
    "```",
    "",
    "{{repoBadges}}", // placeholder crudo (tu sanitizador lo filtra)
    "Texto normal.",
  ].join("\n");

  sanitizeGeneratedMarkdown(raw);
});
