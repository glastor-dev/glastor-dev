import { exists } from "jsr:@std/fs/exists";

export async function inferDescriptionFromReadme(readmePath: string): Promise<string | null> {
  if (!(await exists(readmePath))) return null;

  const text = await Deno.readTextFile(readmePath);
  const lines = text.split("\n");

  // Heurística: primera línea no vacía que no sea heading/imagen/badge
  for (const line of lines) {
    const t = line.trim();
    if (!t) continue;
    if (t.startsWith("#")) continue;
    if (t.startsWith("![") || t.startsWith("[![")) continue;
    if (t.startsWith("<")) continue;
    if (t.includes("{{") && t.includes("}}")) continue;
    if (t.length < 20) continue;
    return t;
  }

  return null;
}
