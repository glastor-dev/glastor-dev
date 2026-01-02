import { walk } from "jsr:@std/fs/walk";
import { extname } from "jsr:@std/path/extname";
import { extractExportsAst } from "./source_code_ast.ts";

export type ExportType =
  | "function"
  | "class"
  | "const"
  | "let"
  | "var"
  | "type"
  | "interface"
  | "enum";

export interface JSDocParam {
  name: string;
  type?: string;
  description: string;
}

export interface ExportInfo {
  filePath: string;
  name: string;
  type: ExportType;
  isAsync: boolean;
  description: string;
  signature?: string;
  params: JSDocParam[];
  returns?: string;
  returnsType?: string;
  throws?: string[];
  deprecated?: string;
  since?: string;
  isBeta?: boolean;
  isInternal?: boolean;
  examples: string[];
}

export interface ExtractOptions {
  exclude?: string[];
  include?: string[];
}

const EXPORT_REGEX =
  /export\s+(async\s+)?(function|class|const|let|var|type|interface|enum)\s+(\w+)/g;

export async function extractExports(filePath: string): Promise<ExportInfo[]> {
  // Preferimos el analizador AST si está disponible, porque es más preciso.
  try {
    const ast = await extractExportsAst(filePath);
    if (ast.length) return ast;
  } catch {
    // fallback a regex
  }

  const code = await Deno.readTextFile(filePath);
  const exports: ExportInfo[] = [];

  let match: RegExpExecArray | null;
  while ((match = EXPORT_REGEX.exec(code)) !== null) {
    const isAsync = Boolean(match[1]);
    const type = match[2] as ExportType;
    const name = match[3];

    const jsDoc = extractJSDoc(code, match.index);

    exports.push({
      filePath,
      name,
      type,
      isAsync,
      description: jsDoc?.description ?? "",
      params: jsDoc?.params ?? [],
      returns: jsDoc?.returns,
      returnsType: jsDoc?.returnsType,
      throws: jsDoc?.throws,
      deprecated: jsDoc?.deprecated,
      since: jsDoc?.since,
      isBeta: jsDoc?.isBeta,
      isInternal: jsDoc?.isInternal,
      examples: jsDoc?.examples ?? [],
    });
  }

  return exports;
}

export async function extractExportsFromProject(
  projectRoot: string,
  options: ExtractOptions = {},
): Promise<ExportInfo[]> {
  const results: ExportInfo[] = [];
  const include = (options.include ?? []).filter(Boolean);
  for await (
    const entry of walk(projectRoot, {
      includeDirs: false,
      followSymlinks: false,
      skip: buildSkipRegexes(options.exclude),
    })
  ) {
    if (include.length) {
      const normalized = entry.path.replaceAll("\\\\", "/");
      const ok = include.some((seg) => normalized.includes(seg.replaceAll("\\\\", "/")));
      if (!ok) continue;
    }

    const ext = extname(entry.path).toLowerCase();
    if (!isSourceExt(ext)) continue;

    // Evitar analizar templates embebidos o archivos muy grandes si existieran
    if (entry.path.includes("/src/templates/") || entry.path.includes("\\src\\templates\\")) {
      continue;
    }

    const found = await extractExports(entry.path);
    results.push(...found);
  }
  return results;
}

interface JSDocInfo {
  description: string;
  params: JSDocParam[];
  returns?: string;
  returnsType?: string;
  throws?: string[];
  deprecated?: string;
  since?: string;
  isBeta?: boolean;
  isInternal?: boolean;
  examples: string[];
}

function extractJSDoc(code: string, position: number): JSDocInfo | null {
  const before = code.slice(0, position);
  const end = before.lastIndexOf("*/");
  if (end === -1) return null;

  const start = before.lastIndexOf("/**", end);
  if (start === -1) return null;

  const between = before.slice(end + 2);
  if (!/^\s*$/.test(between)) return null;

  const raw = before.slice(start + 3, end);
  const lines = raw
    .split("\n")
    .map((l) => l.replace(/^\s*\*\s?/, "").trimEnd());

  const descriptionLines: string[] = [];
  const params: JSDocParam[] = [];
  let returns: string | undefined;
  let returnsType: string | undefined;
  const throwsList: string[] = [];
  let deprecated: string | undefined;
  let since: string | undefined;
  let isBeta = false;
  let isInternal = false;
  const examples: string[] = [];

  let inExample = false;
  let currentExample: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      if (!inExample) descriptionLines.push("");
      continue;
    }

    if (trimmed.startsWith("@example")) {
      inExample = true;
      const rest = trimmed.replace(/^@example\s*/, "");
      if (rest) currentExample.push(rest);
      continue;
    }

    if (inExample) {
      if (trimmed.startsWith("@")) {
        inExample = false;
        if (currentExample.length) examples.push(currentExample.join("\n").trim());
        currentExample = [];
        // continuar procesando el tag actual
      } else {
        currentExample.push(line);
        continue;
      }
    }

    const paramMatch = trimmed.match(/^@param\s+(?:\{([^}]+)\}\s+)?(\w+)\s*-?\s*(.*)$/);
    if (paramMatch) {
      params.push({ name: paramMatch[2], type: paramMatch[1], description: paramMatch[3] ?? "" });
      continue;
    }

    const returnsMatch = trimmed.match(/^@returns?\s+(?:\{([^}]+)\}\s+)?-?\s*(.*)$/);
    if (returnsMatch) {
      returnsType = returnsMatch[1];
      returns = returnsMatch[2] ?? "";
      continue;
    }

    const throwsMatch = trimmed.match(/^@throws\s+(?:\{([^}]+)\}\s+)?-?\s*(.*)$/);
    if (throwsMatch) {
      const type = throwsMatch[1]?.trim();
      const msg = throwsMatch[2]?.trim();
      throwsList.push([type, msg].filter(Boolean).join(" ").trim() || "(throws)");
      continue;
    }

    const deprecatedMatch = trimmed.match(/^@deprecated\s*(.*)$/);
    if (deprecatedMatch) {
      deprecated = deprecatedMatch[1]?.trim() || "deprecated";
      continue;
    }

    const sinceMatch = trimmed.match(/^@since\s+(.*)$/);
    if (sinceMatch) {
      since = sinceMatch[1]?.trim();
      continue;
    }

    if (trimmed === "@beta") {
      isBeta = true;
      continue;
    }

    if (trimmed === "@internal") {
      isInternal = true;
      continue;
    }

    if (trimmed.startsWith("@")) {
      continue;
    }

    descriptionLines.push(trimmed);
  }

  if (inExample && currentExample.length) {
    examples.push(currentExample.join("\n").trim());
  }

  const description = descriptionLines.join("\n").trim();
  return {
    description,
    params,
    returns,
    returnsType,
    throws: throwsList.length ? throwsList : undefined,
    deprecated,
    since,
    isBeta,
    isInternal,
    examples,
  };
}

function isSourceExt(ext: string): boolean {
  return ext === ".ts" || ext === ".tsx" || ext === ".js" || ext === ".jsx";
}

function buildSkipRegexes(exclude: string[] | undefined): RegExp[] {
  const list = exclude && exclude.length ? exclude : [".git", "node_modules", "dist", "build"];
  return list.map((segment) => new RegExp(escapeRegExp(segment)));
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
