import { parse } from "https://deno.land/x/swc@0.2.1/mod.ts";
import type { ExportInfo, ExportType, JSDocParam } from "./source_code.ts";

export async function extractExportsAst(filePath: string): Promise<ExportInfo[]> {
  const code = await Deno.readTextFile(filePath);

  // Usar parse de swc para Deno (async)
  const module = await parse(code, {
    syntax: inferSyntax(filePath),
    tsx: filePath.endsWith(".tsx"),
    target: "es2022",
    comments: true,
  }) as any;

  const comments = collectComments(module);
  const exports: ExportInfo[] = [];

  for (const node of module.body ?? []) {
    // export const/let/var
    if (node.type === "ExportDeclaration" && node.declaration) {
      const decl = node.declaration;
      const startPos = node.span?.start ?? decl.span?.start ?? 0;
      const jsDoc = findLeadingJsDoc(code, comments, startPos);

      if (decl.type === "FunctionDeclaration") {
        const name = decl.identifier?.value ?? "(anonymous)";
        const signature = buildFunctionSignature(code, name, decl);
        exports.push(
          makeExportInfo(filePath, name, "function", Boolean(decl.async), jsDoc, signature),
        );
        continue;
      }

      if (decl.type === "ClassDeclaration") {
        const name = decl.identifier?.value ?? "(anonymous)";
        exports.push(makeExportInfo(filePath, name, "class", false, jsDoc, `class ${name}`));
        continue;
      }

      if (decl.type === "VariableDeclaration") {
        const kind = decl.kind as ExportType; // const|let|var
        for (const d of decl.declarations ?? []) {
          const name = d.id?.type === "Identifier" ? d.id.value : null;
          if (!name) continue;
          const signature = buildVariableSignature(code, name, kind, d.init);
          exports.push(makeExportInfo(filePath, name, kind, false, jsDoc, signature));
        }
        continue;
      }

      // export interface/type/enum (los tratamos como const para docs simples)
      if (decl.type === "TsInterfaceDeclaration") {
        exports.push(
          makeExportInfo(filePath, decl.id?.value ?? "(anonymous)", "interface", false, jsDoc),
        );
        continue;
      }
      if (decl.type === "TsTypeAliasDeclaration") {
        exports.push(
          makeExportInfo(filePath, decl.id?.value ?? "(anonymous)", "type", false, jsDoc),
        );
        continue;
      }
      if (decl.type === "TsEnumDeclaration") {
        exports.push(
          makeExportInfo(filePath, decl.id?.value ?? "(anonymous)", "enum", false, jsDoc),
        );
        continue;
      }
    }

    // export default function/class
    if (node.type === "ExportDefaultDeclaration") {
      const decl = node.decl;
      const jsDoc = findLeadingJsDoc(code, comments, node.span?.start ?? 0);

      if (decl?.type === "FunctionExpression" || decl?.type === "FunctionDeclaration") {
        const name = decl.identifier?.value ?? "default";
        const signature = buildFunctionSignature(code, name, decl);
        exports.push(
          makeExportInfo(filePath, name, "function", Boolean(decl.async), jsDoc, signature),
        );
        continue;
      }
      if (decl?.type === "ClassExpression" || decl?.type === "ClassDeclaration") {
        const name = decl.identifier?.value ?? "default";
        exports.push(makeExportInfo(filePath, name, "class", false, jsDoc, `class ${name}`));
        continue;
      }

      exports.push(makeExportInfo(filePath, "default", "const", false, jsDoc, "default"));
      continue;
    }

    // export { a as b }
    if (node.type === "ExportNamedDeclaration") {
      const jsDoc = findLeadingJsDoc(code, comments, node.span?.start ?? 0);
      for (const spec of node.specifiers ?? []) {
        if (spec.type !== "ExportSpecifier") continue;
        const name = spec.exported?.value ?? spec.orig?.value;
        if (!name) continue;
        exports.push(makeExportInfo(filePath, name, "const", false, jsDoc, `export { ${name} }`));
      }
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

function inferSyntax(filePath: string): "typescript" | "ecmascript" {
  return filePath.endsWith(".ts") || filePath.endsWith(".tsx") ? "typescript" : "ecmascript";
}

type SwcComment = { kind: string; text: string; span: { start: number; end: number } };

function collectComments(module: any): SwcComment[] {
  // SWC guarda comentarios en module.comments (dependiendo de versión) o los anexa.
  const c: SwcComment[] = [];
  const raw = module?.comments;

  // Formatos vistos:
  // - { leading: [...], trailing: [...] }
  // - { leadingComments: [...], trailingComments: [...] }
  // - array
  if (!raw) return c;

  if (Array.isArray(raw)) return raw as SwcComment[];

  for (const key of ["leading", "trailing", "leadingComments", "trailingComments"]) {
    const arr = raw[key];
    if (Array.isArray(arr)) c.push(...arr);
  }

  return c;
}

function findLeadingJsDoc(
  code: string,
  comments: SwcComment[],
  position: number,
): JSDocInfo | null {
  // Elegimos el comentario de bloque más cercano antes de position
  const candidates = comments
    .filter((c) => c.kind === "Block" && c.span?.end != null && c.span.end <= position)
    .sort((a, b) => (b.span.end - a.span.end));

  const nearest = candidates[0];
  if (!nearest) return null;

  // Solo considerarlo JSDoc si está inmediatamente antes del export (ignorando whitespace)
  const between = code.slice(nearest.span.end, position);
  if (between.trim().length !== 0) return null;

  const text = nearest.text ?? "";
  // JSDoc suele ser /** ... */; en SWC el text viene sin /* */.
  if (!text.trimStart().startsWith("*")) return null;

  return parseJsDocFromBlockText(text);
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

function parseJsDocFromBlockText(blockText: string): JSDocInfo {
  // blockText es el contenido interno del /* ... */
  const lines = blockText
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
        // seguir con el tag actual
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

function buildFunctionSignature(code: string, name: string, fnNode: any): string {
  const asyncPrefix = fnNode?.async ? "async " : "";
  const typeParams = fnNode?.typeParams?.params
    ? `<${(fnNode.typeParams.params as any[]).map(formatTsTypeParam).join(", ")}>`
    : "";
  const params = (fnNode?.params ?? []).map((p: any) => formatParam(code, p)).join(", ");
  const returnType = fnNode?.returnType?.typeAnnotation
    ? `: ${formatTsType(fnNode.returnType.typeAnnotation)}`
    : "";
  return `${asyncPrefix}${name}${typeParams}(${params})${returnType}`.trim();
}

function buildVariableSignature(
  code: string,
  name: string,
  kind: ExportType,
  init: any,
): string | undefined {
  if (!init) return `${kind} ${name}`;

  if (init.type === "ArrowFunctionExpression" || init.type === "FunctionExpression") {
    const asyncPrefix = init?.async ? "async " : "";
    const params = (init?.params ?? []).map((p: any) => formatParam(code, p)).join(", ");
    const returnType = init?.returnType?.typeAnnotation
      ? `: ${formatTsType(init.returnType.typeAnnotation)}`
      : "";
    return `${kind} ${name} = ${asyncPrefix}(${params})${returnType} => …`;
  }

  return `${kind} ${name}`;
}

function formatParam(_code: string, param: any): string {
  const pat = param?.pat ?? param;
  if (!pat) return "";

  return formatPattern(pat);

  function formatPattern(p: any): string {
    if (!p) return "[param]";

    // foo = 123
    if (p.type === "AssignmentPattern") {
      const left = formatPattern(p.left);
      const right = formatExpressionLiteral(p.right);
      const type = p.typeAnnotation?.typeAnnotation
        ? `: ${formatTsType(p.typeAnnotation.typeAnnotation)}`
        : "";
      return `${left}${type} = ${right}`.trim();
    }

    if (p.type === "Identifier") {
      const name = p.value ?? "";
      const opt = p.optional ? "?" : "";
      const type = p.typeAnnotation?.typeAnnotation
        ? `: ${formatTsType(p.typeAnnotation.typeAnnotation)}`
        : "";
      return `${name}${opt}${type}`.trim();
    }

    if (p.type === "RestElement") {
      const arg = p.arg?.type === "Identifier" ? p.arg.value : "arg";
      const type = p.typeAnnotation?.typeAnnotation
        ? `: ${formatTsType(p.typeAnnotation.typeAnnotation)}`
        : "";
      return `...${arg}${type}`.trim();
    }

    if (p.type === "ObjectPattern") {
      const props = (p.properties ?? []).map((prop: any) => {
        if (!prop) return "";
        if (prop.type === "RestElement") return `...${formatPattern(prop.arg)}`;
        if (prop.type === "KeyValuePatternProperty") {
          const key = formatObjectKey(prop.key);
          const val = formatPattern(prop.value);
          // { a: a } -> { a }
          if (prop.value?.type === "Identifier" && prop.value.value === key) return key;
          return `${key}: ${val}`;
        }
        if (prop.type === "AssignmentPatternProperty") {
          const key = prop.key?.value ?? formatObjectKey(prop.key);
          const value = prop.value ? ` = ${formatExpressionLiteral(prop.value)}` : "";
          return `${key}${value}`.trim();
        }
        return "";
      }).filter(Boolean);

      const type = p.typeAnnotation?.typeAnnotation
        ? `: ${formatTsType(p.typeAnnotation.typeAnnotation)}`
        : "";
      return `{ ${props.join(", ")} }${type}`.trim();
    }

    if (p.type === "ArrayPattern") {
      const elems = (p.elements ?? []).map((e: any) => {
        if (!e) return "";
        if (e.type === "RestElement") return `...${formatPattern(e.arg)}`;
        return formatPattern(e);
      });
      const type = p.typeAnnotation?.typeAnnotation
        ? `: ${formatTsType(p.typeAnnotation.typeAnnotation)}`
        : "";
      return `[${elems.join(", ")}]${type}`.trim();
    }

    // Último recurso: no intentamos reconstruir el texto original.
    return "[param]";
  }

  function formatObjectKey(k: any): string {
    if (!k) return "key";
    if (k.type === "Identifier") return String(k.value);
    if (k.type === "StringLiteral") return JSON.stringify(k.value);
    if (k.type === "NumericLiteral") return String(k.value);
    return "key";
  }

  function formatExpressionLiteral(expr: any): string {
    if (!expr) return "…";
    if (expr.type === "StringLiteral") return JSON.stringify(expr.value);
    if (expr.type === "NumericLiteral") return String(expr.value);
    if (expr.type === "BooleanLiteral") return String(expr.value);
    if (expr.type === "NullLiteral") return "null";
    return "…";
  }
}

function formatTsTypeParam(p: any): string {
  const name = p?.name?.value ?? "T";
  const constraint = p?.constraint ? ` extends ${formatTsType(p.constraint)}` : "";
  const def = p?.default ? ` = ${formatTsType(p.default)}` : "";
  return `${name}${constraint}${def}`;
}

function formatTsType(t: any): string {
  if (!t || typeof t !== "object") return "unknown";

  if (t.type === "TsKeywordType") return String(t.kind);
  if (t.type === "TsThisType") return "this";
  if (t.type === "TsLitType") return formatTsLiteral(t.lit);
  if (t.type === "TsNullKeyword") return "null";

  if (t.type === "TsTypeRef") {
    const name = formatTsEntityName(t.typeName);
    const params = Array.isArray(t.typeParams?.params) && t.typeParams.params.length
      ? `<${t.typeParams.params.map(formatTsType).join(", ")}>`
      : "";
    return `${name}${params}`;
  }

  if (t.type === "TsArrayType") return `${formatTsType(t.elemType)}[]`;
  if (t.type === "TsParenthesizedType") return `(${formatTsType(t.typeAnnotation)})`;
  if (t.type === "TsUnionType") return (t.types ?? []).map(formatTsType).join(" | ") || "unknown";
  if (t.type === "TsIntersectionType") {
    return (t.types ?? []).map(formatTsType).join(" & ") || "unknown";
  }
  if (t.type === "TsTupleType") return `[${(t.elemTypes ?? []).map(formatTsType).join(", ")}]`;
  if (t.type === "TsTypeOperator") return `${t.operator} ${formatTsType(t.typeAnnotation)}`;

  if (t.type === "TsFnOrConstructorType") {
    const params = (t.params ?? []).map((p: any) => {
      const name = p?.pat?.type === "Identifier" ? p.pat.value : "param";
      const opt = p?.pat?.optional ? "?" : "";
      const ann = p?.typeAnnotation?.typeAnnotation
        ? formatTsType(p.typeAnnotation.typeAnnotation)
        : "unknown";
      return `${name}${opt}: ${ann}`;
    }).join(", ");
    const ret = t.typeAnnotation ? formatTsType(t.typeAnnotation) : "unknown";
    return `(${params}) => ${ret}`;
  }

  if (t.type === "TsTypeLit") {
    const members = (t.members ?? []).map((m: any) => {
      if (m.type === "TsPropertySignature") {
        const key = m.key?.type === "Identifier" ? m.key.value : "prop";
        const opt = m.optional ? "?" : "";
        const ann = m.typeAnnotation?.typeAnnotation
          ? formatTsType(m.typeAnnotation.typeAnnotation)
          : "unknown";
        return `${key}${opt}: ${ann}`;
      }
      return null;
    }).filter(Boolean);
    return `{ ${members.join("; ")} }`;
  }

  return "unknown";
}

function formatTsEntityName(n: any): string {
  if (!n) return "unknown";
  if (n.type === "Identifier") return String(n.value);
  if (n.type === "TsQualifiedName") {
    return `${formatTsEntityName(n.left)}.${formatTsEntityName(n.right)}`;
  }
  return "unknown";
}

function formatTsLiteral(lit: any): string {
  if (!lit) return "unknown";
  if (lit.type === "StringLiteral") return JSON.stringify(lit.value);
  if (lit.type === "NumericLiteral") return String(lit.value);
  if (lit.type === "BooleanLiteral") return String(lit.value);
  return "unknown";
}
