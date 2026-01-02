import { exists } from "jsr:@std/fs/exists";
import { join } from "jsr:@std/path/join";
import { parse as parseJsonc } from "jsr:@std/jsonc/parse";

export interface ImportMap {
  imports?: Record<string, string>;
}

export async function readImportMap(projectRoot: string): Promise<ImportMap | null> {
  const path = join(projectRoot, "import_map.json");
  if (!(await exists(path))) return null;

  const text = await Deno.readTextFile(path);
  const data = parseJsonc(text) as Record<string, unknown>;

  const imports = isRecord(data.imports) ? (data.imports as Record<string, string>) : undefined;
  return { imports };
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}
