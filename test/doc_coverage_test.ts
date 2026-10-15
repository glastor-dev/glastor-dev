import { assertEquals } from "jsr:@std/assert/equals";
import { calculateDocCoverage } from "../src/generators/doc_coverage.ts";
import type { ExportInfo } from "../src/parsers/source_code.ts";

Deno.test("calculateDocCoverage calcula correctamente el porcentaje de documentación", () => {
  const mockExports: ExportInfo[] = [
    {
      filePath: "src/foo.ts",
      name: "documentedFn",
      type: "function",
      isAsync: false,
      description: "A well documented function",
      params: [],
      examples: [],
    },
    {
      filePath: "src/bar.ts",
      name: "undocumentedFn",
      type: "function",
      isAsync: false,
      description: "",
      params: [],
      examples: [],
    },
  ];

  const result = calculateDocCoverage(mockExports);
  assertEquals(result.totalExports, 2);
  assertEquals(result.documentedExports, 1);
  assertEquals(result.percentage, 50);
  assertEquals(result.summary, "50% (1/2 documented)");
});
