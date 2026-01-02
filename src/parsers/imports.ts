import { walk } from "jsr:@std/fs/walk";
import { extname } from "jsr:@std/path/extname";

export interface ImportAnalysis {
  std: string[];
  thirdParty: string[];
  local: string[];
}

export interface AnalyzeImportsOptions {
  exclude?: string[];
}

const IMPORT_REGEX = /\bimport\s+(?:type\s+)?(?:[^"']+from\s+)?["']([^"']+)["']/g;

export async function analyzeImports(
  projectRoot: string,
  options: AnalyzeImportsOptions = {},
): Promise<ImportAnalysis> {
  const std = new Set<string>();
  const thirdParty = new Set<string>();
  const local = new Set<string>();

  for await (
    const entry of walk(projectRoot, {
      includeDirs: false,
      followSymlinks: false,
      skip: buildSkips(options.exclude),
    })
  ) {
    const ext = extname(entry.path).toLowerCase();
    if (!isSourceExt(ext)) continue;

    const code = await Deno.readTextFile(entry.path);
    for (const spec of extractImports(code)) {
      if (spec.startsWith("./") || spec.startsWith("../")) {
        local.add(spec);
      } else if (
        spec.startsWith("https://deno.land/std") || spec.startsWith("@std/") ||
        spec.startsWith("jsr:@std/")
      ) {
        std.add(spec);
      } else {
        thirdParty.add(spec);
      }
    }
  }

  return {
    std: [...std].sort(),
    thirdParty: [...thirdParty].sort(),
    local: [...local].sort(),
  };
}

function extractImports(code: string): string[] {
  const found: string[] = [];
  let match: RegExpExecArray | null;
  while ((match = IMPORT_REGEX.exec(code)) !== null) {
    found.push(match[1]);
  }
  return found;
}

function isSourceExt(ext: string): boolean {
  return ext === ".ts" || ext === ".tsx" || ext === ".js" || ext === ".jsx";
}

function buildSkips(exclude: string[] | undefined): RegExp[] {
  const list = exclude && exclude.length ? exclude : [".git", "node_modules", "dist", "build"];
  // walk({ skip }) espera RegExp[] (se compara contra entry.path)
  return list
    .map((segment) => segment.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .map((escaped) => new RegExp(escaped));
}
