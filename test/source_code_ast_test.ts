import { assertEquals } from "jsr:@std/assert/equals";

import { extractExports } from "../src/parsers/source_code.ts";

Deno.test("extractExports detecta exports avanzados", async () => {
  const tmp = await Deno.makeTempFile({ suffix: ".ts" });
  await Deno.writeTextFile(
    tmp,
    `/** Greets a person\n * @param name Nombre\n * @returns string\n */
export function hello(name: string) { return "hola " + name }

/** Example\n * @example\n * hello("Andres")\n */
export const x = 1;

export type UserId = string;
export interface User { id: UserId }
export enum Role { Admin = "admin" }

export { x as y };
export default function main() { return 123 }
`,
  );

  const exports = await extractExports(tmp);
  const byName = new Map(exports.map((e) => [e.name, e]));
  const names = exports.map((e) => e.name).sort();

  // Nota: el default function queda con nombre "main" (si está) o "default".
  assertEquals(names.includes("hello"), true);
  assertEquals(names.includes("x"), true);
  assertEquals(names.includes("y"), true);
  assertEquals(names.includes("UserId"), true);
  assertEquals(names.includes("User"), true);
  assertEquals(names.includes("Role"), true);
  assertEquals(names.includes("main") || names.includes("default"), true);

  // Firma básica
  assertEquals(byName.get("hello")?.signature?.includes("hello(") ?? false, true);
  assertEquals(byName.get("hello")?.signature?.includes("name: string") ?? false, true);
});
