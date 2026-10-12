import { assertEquals } from "jsr:@std/assert/equals";
import { sanitizeGeneratedMarkdown } from "../src/mod.ts";

Deno.test("sanitizeGeneratedMarkdown normaliza BOM y caracteres invisibles", () => {
  const input = "\uFEFF\u200B# Titulo\nTexto normal";
  const output = sanitizeGeneratedMarkdown(input);
  assertEquals(output.startsWith("# Titulo"), true);
});

Deno.test("sanitizeGeneratedMarkdown elimina líneas basura fuera de bloques de código", () => {
  const input = `# Mi Proyecto

{{repoBadges}}
Deno.readTextFile("algo");
makeExportInfo("x", "y");

Contenido legítimo.`;

  const output = sanitizeGeneratedMarkdown(input);
  assertEquals(output.includes("{{repoBadges}}"), false);
  assertEquals(output.includes("Deno.readTextFile("), false);
  assertEquals(output.includes("makeExportInfo("), false);
  assertEquals(output.includes("Contenido legítimo."), true);
});

Deno.test("sanitizeGeneratedMarkdown preserva código legítimo dentro de bloques markdown (fences)", () => {
  const input = `# Proyecto

\`\`\`typescript
import { assertEquals } from "jsr:@std/assert";
export function add(a: number, b: number) { return a + b; }
\`\`\`

Fin.`;

  const output = sanitizeGeneratedMarkdown(input);
  assertEquals(output.includes("import { assertEquals }"), true);
  assertEquals(output.includes("export function add"), true);
  assertEquals(output.includes("Fin."), true);
});

Deno.test("sanitizeGeneratedMarkdown reposiciona el banner al inicio del documento", () => {
  const input = `# Titulo

Texto intermedio

![Banner](images/banner-github.webp)

Pie de página`;

  const output = sanitizeGeneratedMarkdown(input);
  assertEquals(output.startsWith("![Banner](images/banner-github.webp)"), true);
});
