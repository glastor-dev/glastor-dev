import { walk } from "jsr:@std/fs@^1.0.0/walk";
import { relative } from "jsr:@std/path@^1.0.0/relative";
import { join } from "jsr:@std/path@^1.0.0/join";
import { dirname } from "jsr:@std/path@^1.0.0/dirname";
import { extname } from "jsr:@std/path@^1.0.0/extname";

export interface MermaidGraphOptions {
  direction?: "TD" | "LR";
  includeExternal?: boolean;
}

export async function generateMermaidGraph(
  projectRoot: string,
  options: MermaidGraphOptions = {},
): Promise<string> {
  const direction = options.direction ?? "TD";
  const edges = new Set<string>();
  const nodes = new Map<string, string>();

  const srcDir = join(projectRoot, "src");
  let hasSrc = false;
  try {
    const stat = await Deno.stat(srcDir);
    hasSrc = stat.isDirectory;
  } catch {
    hasSrc = false;
  }

  const scanDir = hasSrc ? srcDir : projectRoot;

  for await (
    const entry of walk(scanDir, {
      includeDirs: false,
      followSymlinks: false,
      skip: [/\.git/, /node_modules/, /dist/, /build/, /test/, /bench/],
    })
  ) {
    const ext = extname(entry.path).toLowerCase();
    if (ext !== ".ts" && ext !== ".tsx" && ext !== ".js" && ext !== ".jsx") continue;

    const relSource = relative(projectRoot, entry.path).replaceAll("\\", "/");
    const sourceId = toNodeId(relSource);
    nodes.set(sourceId, relSource);

    const code = await Deno.readTextFile(entry.path);
    const importRegex = /\bimport\s+(?:type\s+)?(?:[^"']+from\s+)?["']([^"']+)["']/g;
    let match: RegExpExecArray | null;

    while ((match = importRegex.exec(code)) !== null) {
      const spec = match[1];
      if (spec.startsWith("./") || spec.startsWith("../")) {
        const fileDir = dirname(entry.path);
        const resolved = join(fileDir, spec);
        let targetPath = relative(projectRoot, resolved).replaceAll("\\", "/");
        if (!extname(targetPath)) targetPath += ".ts";

        const targetId = toNodeId(targetPath);
        nodes.set(targetId, targetPath);
        edges.add(`${sourceId} --> ${targetId}`);
      }
    }
  }

  if (edges.size === 0) return "";

  const lines = ["```mermaid", `graph ${direction}`];
  for (const [id, label] of nodes.entries()) {
    lines.push(`    ${id}["${label}"]`);
  }
  for (const edge of [...edges].sort()) {
    lines.push(`    ${edge}`);
  }
  lines.push("```");

  return lines.join("\n");
}

function toNodeId(path: string): string {
  return path.replace(/[^a-zA-Z0-9_]/g, "_").replace(/^_+|_+$/g, "");
}
