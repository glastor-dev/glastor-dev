import type { ExportInfo } from "../parsers/source_code.ts";

export interface DocCoverageResult {
  totalExports: number;
  documentedExports: number;
  percentage: number;
  summary: string;
  badge: string;
}

export function calculateDocCoverage(exports: ExportInfo[]): DocCoverageResult {
  const publicExports = exports.filter((e) => !e.isInternal);
  const total = publicExports.length;

  if (total === 0) {
    return {
      totalExports: 0,
      documentedExports: 0,
      percentage: 100,
      summary: "100% (No public exports)",
      badge: "![Doc Coverage](https://img.shields.io/badge/docs-100%25-brightgreen.svg)",
    };
  }

  const documented = publicExports.filter((e) => {
    return Boolean(
      (e.description && e.description.trim().length > 0) ||
        (e.params && e.params.length > 0 && e.params.some((p) => p.description)) ||
        (e.examples && e.examples.length > 0),
    );
  }).length;

  const percentage = Math.round((documented / total) * 100);
  let color = "red";
  if (percentage >= 90) color = "brightgreen";
  else if (percentage >= 75) color = "green";
  else if (percentage >= 50) color = "yellow";

  const badge =
    `[![Doc Coverage](https://img.shields.io/badge/docs-${percentage}%25-${color}.svg)](https://jsr.io/@glastor-dev/readmegen)`;
  const summary = `${percentage}% (${documented}/${total} documented)`;

  return {
    totalExports: total,
    documentedExports: documented,
    percentage,
    summary,
    badge,
  };
}
