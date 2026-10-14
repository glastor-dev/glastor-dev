import { assertEquals } from "jsr:@std/assert/equals";
import { assertMatch } from "jsr:@std/assert/match";
import { renderTemplate } from "../src/templates/render.ts";
import { analyzeProject } from "../src/project/analyze.ts";
import { generateVisitorBadge } from "../src/generators/badges.ts";

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

Deno.test("generateVisitorBadge genera URL correcta con hits.sh y extraCount", () => {
  const badge = generateVisitorBadge({
    target: "glastor-dev",
    extraCount: 1465,
    style: "flat-square",
    label: "Visitas",
    color: "8a2be2",
    labelColor: "555555",
  });
  assertEquals(
    badge,
    "[![Profile Views](https://hits.sh/github.com/glastor-dev.svg?style=flat-square&label=Visitas&extraCount=1465&color=8a2be2&labelColor=555555)](https://hits.sh/github.com/glastor-dev/)",
  );
});
