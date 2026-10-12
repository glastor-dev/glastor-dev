import ts from "npm:typescript@^5.7.0";
import type { ExportInfo, ExportType, JSDocParam } from "./source_code.ts";

export interface JSDocInfo {
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

export async function extractExportsAst(filePath: string): Promise<ExportInfo[]> {
  const code = await Deno.readTextFile(filePath);
  return extractExportsAstFromCode(code, filePath);
}

export function extractExportsAstFromCode(code: string, filePath: string): ExportInfo[] {
  const sourceFile = ts.createSourceFile(filePath, code, ts.ScriptTarget.Latest, true);
  const exports: ExportInfo[] = [];

  for (const node of sourceFile.statements) {
    const isExported = ts.canHaveModifiers(node)
      ? Boolean(ts.getModifiers(node)?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword))
      : false;
    const isDefault = ts.canHaveModifiers(node)
      ? Boolean(ts.getModifiers(node)?.some((m) => m.kind === ts.SyntaxKind.DefaultKeyword))
      : false;

    const jsDoc = findLeadingJsDoc(node, code);

    // export function / export default function
    if (ts.isFunctionDeclaration(node) && (isExported || isDefault)) {
      const name = node.name?.text ?? (isDefault ? "default" : "(anonymous)");
      const isAsync = Boolean(
        ts.getModifiers(node)?.some((m) => m.kind === ts.SyntaxKind.AsyncKeyword),
      );
      const typeParams = node.typeParameters?.length
        ? `<${node.typeParameters.map((tp) => tp.getText(sourceFile)).join(", ")}>`
        : "";
      const params = node.parameters.map((p) => p.getText(sourceFile)).join(", ");
      const retType = node.type ? `: ${node.type.getText(sourceFile)}` : "";
      const signature = `${isAsync ? "async " : ""}${name}${typeParams}(${params})${retType}`
        .trim();

      exports.push(makeExportInfo(filePath, name, "function", isAsync, jsDoc, signature));
      continue;
    }

    // export class / export default class
    if (ts.isClassDeclaration(node) && (isExported || isDefault)) {
      const name = node.name?.text ?? (isDefault ? "default" : "(anonymous)");
      exports.push(makeExportInfo(filePath, name, "class", false, jsDoc, `class ${name}`));
      continue;
    }

    // export const / let / var
    if (ts.isVariableStatement(node) && isExported) {
      const flags = node.declarationList.flags;
      const kind: ExportType = (flags & ts.NodeFlags.Const)
        ? "const"
        : (flags & ts.NodeFlags.Let)
        ? "let"
        : "var";

      for (const decl of node.declarationList.declarations) {
        const name = decl.name.getText(sourceFile);
        let signature = `${kind} ${name}`;

        if (
          decl.initializer &&
          (ts.isArrowFunction(decl.initializer) || ts.isFunctionExpression(decl.initializer))
        ) {
          const fn = decl.initializer;
          const isAsync = Boolean(
            ts.canHaveModifiers(fn) &&
              ts.getModifiers(fn)?.some((m) => m.kind === ts.SyntaxKind.AsyncKeyword),
          );
          const typeParams = fn.typeParameters?.length
            ? `<${fn.typeParameters.map((tp) => tp.getText(sourceFile)).join(", ")}>`
            : "";
          const params = fn.parameters.map((p) => p.getText(sourceFile)).join(", ");
          const retType = fn.type ? `: ${fn.type.getText(sourceFile)}` : "";
          signature = `${kind} ${name} = ${
            isAsync ? "async " : ""
          }${typeParams}(${params})${retType} => …`;
        }

        exports.push(makeExportInfo(filePath, name, kind, false, jsDoc, signature));
      }
      continue;
    }

    // export interface
    if (ts.isInterfaceDeclaration(node) && isExported) {
      exports.push(makeExportInfo(filePath, node.name.text, "interface", false, jsDoc));
      continue;
    }

    // export type
    if (ts.isTypeAliasDeclaration(node) && isExported) {
      exports.push(makeExportInfo(filePath, node.name.text, "type", false, jsDoc));
      continue;
    }

    // export enum
    if (ts.isEnumDeclaration(node) && isExported) {
      exports.push(makeExportInfo(filePath, node.name.text, "enum", false, jsDoc));
      continue;
    }

    // export { a as b }
    if (ts.isExportDeclaration(node) && node.exportClause && ts.isNamedExports(node.exportClause)) {
      for (const el of node.exportClause.elements) {
        const name = el.name.text;
        exports.push(makeExportInfo(filePath, name, "const", false, jsDoc, `export { ${name} }`));
      }
      continue;
    }

    // export default <expression>
    if (ts.isExportAssignment(node) && !node.isExportEquals) {
      const name = node.expression.getText(sourceFile) || "default";
      exports.push(makeExportInfo(filePath, "default", "const", false, jsDoc, name));
      continue;
    }
  }

  // Deduplicar (puede haber colisiones por re-exports)
  const seen = new Set<string>();
  return exports.filter((e) => {
    const key = `${e.filePath}::${e.name}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function findLeadingJsDoc(node: ts.Node, code: string): JSDocInfo | null {
  const commentRanges = ts.getLeadingCommentRanges(code, node.pos);
  if (!commentRanges?.length) return null;
  const lastRange = commentRanges[commentRanges.length - 1];
  const text = code.substring(lastRange.pos, lastRange.end);
  if (!text.startsWith("/**")) return null;
  return parseJsDocText(text);
}

function parseJsDocText(commentText: string): JSDocInfo {
  const clean = commentText
    .replace(/^\/\*\*?/, "")
    .replace(/\*\/$/, "")
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

  for (const line of clean) {
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

    if (trimmed.startsWith("@")) continue;

    descriptionLines.push(trimmed);
  }

  if (inExample && currentExample.length) {
    examples.push(currentExample.join("\n").trim());
  }

  return {
    description: descriptionLines.join("\n").trim(),
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

function makeExportInfo(
  filePath: string,
  name: string,
  type: ExportType,
  isAsync: boolean,
  jsDoc: JSDocInfo | null,
  signature?: string,
): ExportInfo {
  return {
    filePath,
    name,
    type,
    isAsync,
    description: jsDoc?.description ?? "",
    signature,
    params: jsDoc?.params ?? [],
    returns: jsDoc?.returns,
    returnsType: jsDoc?.returnsType,
    throws: jsDoc?.throws,
    deprecated: jsDoc?.deprecated,
    since: jsDoc?.since,
    isBeta: jsDoc?.isBeta,
    isInternal: jsDoc?.isInternal,
    examples: jsDoc?.examples ?? [],
  };
}
