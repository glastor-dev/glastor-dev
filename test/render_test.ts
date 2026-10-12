import { assertEquals } from "jsr:@std/assert/equals";
import { assertMatch } from "jsr:@std/assert/match";
import { renderTemplate } from "../src/templates/render.ts";
import { analyzeProject } from "../src/project/analyze.ts";

Deno.test("renderTemplate reemplaza placeholders", () => {
  const out = renderTemplate("Hello {{name}}", { name: "World" });
  assertEquals(out, "Hello World");
});

Deno.test("analyzeProject genera nextOpening dinámicamente (+1 mes)", async () => {
  const analysis = await analyzeProject({
    projectRoot: Deno.cwd(),
    readmePath: "README.md",
  });
  assertEquals(typeof analysis.templateData.nextOpening, "string");
  assertEquals(analysis.templateData.nextOpening, analysis.templateData.proximasAperturas);
  assertMatch(
    analysis.templateData.nextOpening,
    /^(Enero|Febrero|Marzo|Abril|Mayo|Junio|Julio|Agosto|Septiembre|Octubre|Noviembre|Diciembre)\s+\d{4}$/,
  );
});
