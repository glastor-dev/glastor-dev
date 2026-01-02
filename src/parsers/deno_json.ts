import { exists } from "jsr:@std/fs/exists";
import { join } from "jsr:@std/path/join";
import { parse as parseJsonc } from "jsr:@std/jsonc/parse";

export interface DenoConfig {
  name?: string;
  version?: string;
  exports?: unknown;
  tasks?: Record<string, string>;
}

export async function readDenoConfig(projectRoot: string): Promise<DenoConfig | null> {
  const denoJson = join(projectRoot, "deno.json");
  const denoJsonc = join(projectRoot, "deno.jsonc");

  let filePath: string | null = null;
  if (await exists(denoJson)) filePath = denoJson;
  else if (await exists(denoJsonc)) filePath = denoJsonc;

  if (!filePath) return null;

  const text = await Deno.readTextFile(filePath);
  const data = parseJsonc(text) as Record<string, unknown>;

  const name = typeof data.name === "string" ? data.name : undefined;
  const version = typeof data.version === "string" ? data.version : undefined;
  const exportsField = (data as any).exports;
  const tasks = isRecord(data.tasks) ? (data.tasks as Record<string, string>) : undefined;

  return { name, version, exports: exportsField, tasks };
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}
