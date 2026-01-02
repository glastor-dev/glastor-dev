import type { ExportInfo } from "../parsers/source_code.ts";

export function generateApiDocs(exports: ExportInfo[]): string {
  if (!exports.length) return "(No public exports detected)";

  const groups = groupByFile(exports);
  const sections: string[] = [];

  for (const filePath of Object.keys(groups).sort()) {
    sections.push(`### ${normalizePath(filePath)}`);

    for (const exp of groups[filePath].sort((a, b) => a.name.localeCompare(b.name))) {
      sections.push(`#### ${exp.name}`);
      if (exp.description) sections.push(exp.description);

      const meta: string[] = [];
      meta.push(`- Type: ${exp.type}${exp.isAsync ? " (async)" : ""}`);
      if (exp.signature) meta.push(`- Signature: \`${exp.signature}\``);
      if (exp.isBeta) meta.push("- Stability: beta");
      if (exp.isInternal) meta.push("- Visibility: internal");
      if (exp.since) meta.push(`- Since: ${exp.since}`);
      if (exp.deprecated) meta.push(`- Deprecated: ${exp.deprecated}`);
      if (exp.throws?.length) meta.push(`- Throws: ${exp.throws.join("; ")}`);
      if (exp.params.length) {
        meta.push("- Params:");
        for (const p of exp.params) {
          const type = p.type ? `: ${p.type}` : "";
          const desc = p.description ? ` - ${p.description}` : "";
          meta.push(`  - ${p.name}${type}${desc}`);
        }
      }
      if (exp.returns || exp.returnsType) {
        const type = exp.returnsType ? `: ${exp.returnsType}` : "";
        const desc = exp.returns ? ` - ${exp.returns}` : "";
        meta.push(`- Returns${type}${desc}`);
      }

      sections.push(meta.join("\n"));

      if (exp.examples.length) {
        for (const ex of exp.examples) {
          sections.push("\n```ts\n" + ex.trim() + "\n```\n");
        }
      }
      sections.push("");
    }
  }

  return sections.join("\n").trim();
}

function groupByFile(exports: ExportInfo[]): Record<string, ExportInfo[]> {
  return exports.reduce((acc, exp) => {
    (acc[exp.filePath] ??= []).push(exp);
    return acc;
  }, {} as Record<string, ExportInfo[]>);
}

function normalizePath(p: string): string {
  return p.replaceAll("\\\\", "/");
}
