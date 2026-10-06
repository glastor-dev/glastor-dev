import { globToRegExp } from "jsr:@std/path/glob-to-regexp";
import { walk } from "jsr:@std/fs/walk";

export async function detectWorkflows(projectRoot: string): Promise<string[]> {
  const workflows: string[] = [];
  const re = globToRegExp("**/.github/workflows/*.{yml,yaml}", { extended: true, globstar: true });

  for await (const entry of walk(projectRoot, { includeDirs: false, followSymlinks: false })) {
    const normalized = entry.path.replaceAll("\\\\", "/");
    if (re.test(normalized)) workflows.push(normalized);
  }

  workflows.sort();
  return workflows;
}
