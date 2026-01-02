import type { ExportInfo } from "../parsers/source_code.ts";
import { exists } from "jsr:@std/fs/exists";
import { join } from "jsr:@std/path/join";
import { walk } from "jsr:@std/fs/walk";

export interface ExamplesOptions {
  includeExamples?: boolean;
  exclude?: string[];
}

export interface ExamplesResult {
  basicExample: string;
  extracted: string[];
}

export async function generateExamples(
  projectRoot: string,
  exports: ExportInfo[],
  options: ExamplesOptions = {},
): Promise<ExamplesResult> {
  const include = options.includeExamples !== false;
  const extracted: string[] = [];

  if (include) {
    for (const exp of exports) {
      for (const ex of exp.examples) {
        if (ex.trim()) extracted.push(ex.trim());
      }
    }

    const examplesDir = join(projectRoot, "examples");
    if (await exists(examplesDir)) {
      for await (const entry of walk(examplesDir, { includeDirs: false, followSymlinks: false })) {
        if (!entry.path.endsWith(".ts") && !entry.path.endsWith(".js")) continue;
        extracted.push(await Deno.readTextFile(entry.path));
      }
    }
  }

  const basicExample = extracted[0]?.trim() ||
    `deno run -A src/main.ts --template modern --output README.md`;

  return { basicExample, extracted };
}
