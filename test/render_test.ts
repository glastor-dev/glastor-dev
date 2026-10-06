import { assertEquals } from "jsr:@std/assert/equals";
import { renderTemplate } from "../src/templates/render.ts";

Deno.test("renderTemplate reemplaza placeholders", () => {
  const out = renderTemplate("Hello {{name}}", { name: "World" });
  assertEquals(out, "Hello World");
});
