import { dirname } from "jsr:@std/path/dirname";
import { fromFileUrl, join } from "jsr:@std/path";

export async function loadTemplate(name: string): Promise<string> {
  const normalized = name.toLowerCase();
  const fileName = normalized === "minimal" || normalized === "modern" || normalized === "detailed"
    ? `${normalized}.md`
    : "modern.md";

  const here = dirname(fromFileUrl(import.meta.url));
  const path = join(here, fileName);

  return await Deno.readTextFile(path);
}
