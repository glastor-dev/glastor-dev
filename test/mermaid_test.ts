import { assertEquals } from "jsr:@std/assert/equals";
import { assertMatch } from "jsr:@std/assert/match";
import { generateMermaidGraph } from "../src/generators/mermaid.ts";

Deno.test("generateMermaidGraph produce un grafo válido de dependencias", async () => {
  const graph = await generateMermaidGraph(Deno.cwd());
  assertEquals(typeof graph, "string");
  assertMatch(graph, /^```mermaid\r?\ngraph TD/);
  assertMatch(graph, /src_main_ts/);
  assertMatch(graph, /-->/);
});
