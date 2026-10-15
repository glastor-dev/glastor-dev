import { assertEquals } from "jsr:@std/assert/equals";
import { calculateReviewResult, reviewFile } from "../scripts/code_review.ts";

Deno.test("reviewFile detecta riesgos de seguridad (Risk)", () => {
  const code = `
    const token = "ghp_123456789012345678901234567890123456";
    eval("console.log('danger')");
  `;
  const findings = reviewFile("sample.ts", code);
  const riskFindings = findings.filter((f) => f.pillar === "Risk");
  assertEquals(riskFindings.length >= 2, true);
  assertEquals(riskFindings.some((f) => f.rule.includes("Secret Leak")), true);
  assertEquals(riskFindings.some((f) => f.rule.includes("Dangerous Eval")), true);
});

Deno.test("reviewFile detecta fallos de confiabilidad (Reliability)", () => {
  const code = `
    try {
      doWork();
    } catch {}
  `;
  const findings = reviewFile("sample.ts", code);
  const relFindings = findings.filter((f) => f.pillar === "Reliability");
  assertEquals(relFindings.some((f) => f.rule.includes("Silent Error Catch")), true);
});

Deno.test("reviewFile detecta llamadas sin timeout (Resilience)", () => {
  const code = `
    export async function fetchRemote() {
      const res = await fetch("https://api.example.com");
      return res.json();
    }
  `;
  const findings = reviewFile("sample.ts", code);
  const resFindings = findings.filter((f) => f.pillar === "Resilience");
  assertEquals(resFindings.some((f) => f.rule.includes("Fetch Without Timeout")), true);
});

Deno.test("calculateReviewResult calcula correctamente los scores de las 4 Rs", () => {
  const result = calculateReviewResult([], ["src/sample.ts"]);
  assertEquals(result.overallScore, 100);
  assertEquals(result.passed, true);
  assertEquals(result.pillars.Risk.score, 100);
  assertEquals(result.pillars.Readability.score, 100);
  assertEquals(result.pillars.Reliability.score, 100);
  assertEquals(result.pillars.Resilience.score, 100);
});
