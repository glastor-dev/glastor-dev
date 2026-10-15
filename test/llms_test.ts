import { assertEquals } from "jsr:@std/assert/equals";
import { assertMatch } from "jsr:@std/assert/match";
import { generateLlmsTxt } from "../src/generators/llms.ts";

Deno.test("generateLlmsTxt produce el formato estándar de llms.txt", async () => {
  const content = await generateLlmsTxt({
    projectRoot: Deno.cwd(),
    exports: [
      {
        filePath: "src/sample.ts",
        name: "testFn",
        type: "function",
        isAsync: true,
        signature: "async testFn(): Promise<void>",
        description: "Executes a test function",
        params: [],
        examples: [],
      },
    ],
  });

  assertEquals(typeof content, "string");
  assertMatch(content, /^# @glastor-dev\/readmegen/);
  assertMatch(content, /## Quick Overview/);
  assertMatch(content, /## Public API Reference/);
  assertMatch(content, /testFn/);
});
