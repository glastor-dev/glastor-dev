import { assertStringIncludes } from "jsr:@std/assert/string-includes";
import { generateApiDocs } from "../src/generators/api.ts";

Deno.test("generateApiDocs genera secciones", () => {
  const md = generateApiDocs([
    {
      filePath: "src/x.ts",
      name: "hello",
      type: "function",
      isAsync: false,
      description: "Says hi",
      params: [],
      returns: "string",
      examples: ["hello()"],
    },
  ]);

  assertStringIncludes(md, "#### hello");
});
