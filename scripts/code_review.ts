/**
 * scripts/code_review.ts
 *
 * Automated 4R Code Review Engine for Deno & TypeScript
 * Pillars: Risk, Readability, Reliability, Resilience
 *
 * Usage:
 *   deno run -A scripts/code_review.ts            # Run on modified files (or src/ if none)
 *   deno run -A scripts/code_review.ts --all      # Run on all files in src/
 *   deno run -A scripts/code_review.ts --diff     # Run on git diff compared to master
 *   deno run -A scripts/code_review.ts --format markdown --output review.md
 */

import { walk } from "jsr:@std/fs@^1.0.0/walk";
import { relative } from "jsr:@std/path@^1.0.0/relative";
import { join } from "jsr:@std/path@^1.0.0/join";
import { extname } from "jsr:@std/path@^1.0.0/extname";

export type Pillar = "Risk" | "Readability" | "Reliability" | "Resilience";
export type Severity = "CRITICAL" | "WARNING" | "INFO";

export interface Finding {
  pillar: Pillar;
  severity: Severity;
  file: string;
  line: number;
  message: string;
  rule: string;
  snippet?: string;
  suggestion?: string;
}

export interface PillarScore {
  pillar: Pillar;
  score: number;
  status: "PASSED" | "WARNING" | "FAILED";
  findings: Finding[];
}

export interface ReviewResult {
  overallScore: number;
  pillars: Record<Pillar, PillarScore>;
  filesAnalyzed: string[];
  totalFindings: number;
  passed: boolean;
}

// ---------------------------------------------------------------------------
// 4R Analysis Rules & Checks
// ---------------------------------------------------------------------------

export function reviewFile(filePath: string, content: string): Finding[] {
  const findings: Finding[] = [];
  const lines = content.split(/\r?\n/);

  // 1. 🛡️ Risk Checks
  analyzeRisk(filePath, lines, findings);

  // 2. 📖 Readability Checks
  analyzeReadability(filePath, lines, findings);

  // 3. 🎯 Reliability Checks
  analyzeReliability(filePath, lines, findings);

  // 4. 🏗️ Resilience Checks
  analyzeResilience(filePath, lines, findings);

  return findings;
}

function analyzeRisk(filePath: string, lines: string[], findings: Finding[]): void {
  const secretPattern =
    /(?:ghp_[A-Za-z0-9_]{36}|github_pat_[A-Za-z0-9_]{82}|AKIA[0-9A-Z]{16}|bearer\s+[a-zA-Z0-9_\-\.]{30,})/i;
  const privateKeyPattern = /-----BEGIN (?:RSA|EC|OPENSSH|PRIVATE) KEY-----/;
  const passwordAssignPattern =
    /(?:password|secret|auth_token|api_key|apiKey)\s*[:=]\s*["'](?![${])[^"']{8,}["']/i;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNum = i + 1;

    // Secret Leak Detection
    if (secretPattern.test(line) && !line.includes("secretPattern")) {
      findings.push({
        pillar: "Risk",
        severity: "CRITICAL",
        file: filePath,
        line: lineNum,
        rule: "RISK-001 (Secret Leak)",
        message: "Posible token o secreto de alta entropía expuesto en el código.",
        snippet: line.trim(),
        suggestion: "Utiliza variables de entorno o GitHub Secrets en lugar de valores literales.",
      });
    }

    if (privateKeyPattern.test(line)) {
      findings.push({
        pillar: "Risk",
        severity: "CRITICAL",
        file: filePath,
        line: lineNum,
        rule: "RISK-002 (Private Key)",
        message: "Clave privada detectada en el código fuente.",
        snippet: line.trim(),
        suggestion: "Remueve la clave inmediatamente y rótala en tu infraestructura.",
      });
    }

    if (
      passwordAssignPattern.test(line) &&
      !line.includes("placeholder") &&
      !line.includes("example") &&
      !line.includes("test") &&
      !line.includes("passwordAssignPattern")
    ) {
      findings.push({
        pillar: "Risk",
        severity: "CRITICAL",
        file: filePath,
        line: lineNum,
        rule: "RISK-003 (Hardcoded Credential)",
        message: "Asignación sospechosa de credencial hardcodeada.",
        snippet: line.trim(),
        suggestion: "Carga esta credencial dinámicamente mediante Deno.env.get().",
      });
    }

    // Dangerous Execution Detection
    if (/\beval\s*\(/.test(line)) {
      findings.push({
        pillar: "Risk",
        severity: "CRITICAL",
        file: filePath,
        line: lineNum,
        rule: "RISK-004 (Dangerous Eval)",
        message: "Uso de eval() introduce vulnerabilidad crítica de inyección de código.",
        snippet: line.trim(),
        suggestion: "Reemplaza eval() por parsers seguros como JSON.parse o AST parsing.",
      });
    }

    if (/\.innerHTML\s*=/.test(line)) {
      findings.push({
        pillar: "Risk",
        severity: "WARNING",
        file: filePath,
        line: lineNum,
        rule: "RISK-005 (XSS Risk)",
        message: "Asignación directa a innerHTML puede provocar Cross-Site Scripting (XSS).",
        snippet: line.trim(),
        suggestion: "Utiliza textContent o sanitiza el contenido antes de insertarlo.",
      });
    }
  }
}

function analyzeReadability(filePath: string, lines: string[], findings: Finding[]): void {
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNum = i + 1;

    // Detect missing JSDoc on public exports
    const exportMatch = line.match(
      /^export\s+(?:async\s+)?(function|class|interface|type)\s+([A-Za-z0-9_]+)/,
    );
    if (exportMatch) {
      const type = exportMatch[1];
      const name = exportMatch[2];
      const prevLine = i > 0 ? lines[i - 1].trim() : "";
      if (!prevLine.endsWith("*/")) {
        findings.push({
          pillar: "Readability",
          severity: "WARNING",
          file: filePath,
          line: lineNum,
          rule: "READ-001 (Missing JSDoc)",
          message: `El export público '${name}' (${type}) no cuenta con documentación JSDoc.`,
          snippet: line.trim(),
          suggestion: "Agrega un bloque /** ... */ describiendo su propósito y parámetros.",
        });
      }
    }

    // Prohibited `any` type usage
    if (/:\s*any\b/.test(line) && !line.includes("//") && !line.includes("eslint-disable")) {
      findings.push({
        pillar: "Readability",
        severity: "WARNING",
        file: filePath,
        line: lineNum,
        rule: "READ-002 (Any Type)",
        message: "Uso de tipo 'any' reduce la legibilidad y la seguridad de tipos.",
        snippet: line.trim(),
        suggestion: "Especifica un tipo explícito o 'unknown' con type narrowing.",
      });
    }

    if (/\bas\s+any\b/.test(line) && !line.includes("//")) {
      findings.push({
        pillar: "Readability",
        severity: "INFO",
        file: filePath,
        line: lineNum,
        rule: "READ-003 (Type Cast Any)",
        message: "Aserción de tipo forzada con 'as any'.",
        snippet: line.trim(),
        suggestion: "Utiliza interfaces precisas o generics.",
      });
    }
  }
}

function analyzeReliability(filePath: string, lines: string[], findings: Finding[]): void {
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNum = i + 1;

    // Silent catch swallowing
    if (/catch\s*(?:\([^)]*\))?\s*\{\s*\}/.test(line)) {
      findings.push({
        pillar: "Reliability",
        severity: "CRITICAL",
        file: filePath,
        line: lineNum,
        rule: "REL-001 (Silent Error Catch)",
        message: "Bloque catch vacío silencia excepciones sin registro ni manejo.",
        snippet: line.trim(),
        suggestion: "Registra el error en Logger o relánzalo con contexto.",
      });
    }

    // Blind multiple non-null assertions
    if (/!!{2,}/.test(line) || /[a-zA-Z0-9_]!\.[a-zA-Z0-9_]+!\./.test(line)) {
      findings.push({
        pillar: "Reliability",
        severity: "WARNING",
        file: filePath,
        line: lineNum,
        rule: "REL-002 (Risky Non-Null Assertion)",
        message: "Aserciones consecutivas de no-nulo (!) pueden causar TypeError en runtime.",
        snippet: line.trim(),
        suggestion: "Utiliza optional chaining (?.) con coalescencia nula (??).",
      });
    }

    // Unsafe JSON.parse without try/catch
    if (/\bJSON\.parse\(/.test(line) && !isInsideTryBlock(lines, i)) {
      findings.push({
        pillar: "Reliability",
        severity: "INFO",
        file: filePath,
        line: lineNum,
        rule: "REL-003 (Unprotected JSON Parse)",
        message: "JSON.parse directo puede lanzar SyntaxError si el payload es inválido.",
        snippet: line.trim(),
        suggestion: "Envuelve en un bloque try/catch o provee un fallback seguro.",
      });
    }
  }
}

function analyzeResilience(filePath: string, lines: string[], findings: Finding[]): void {
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNum = i + 1;

    // Fetch without timeout or AbortSignal
    if (/\bfetch\s*\(/.test(line)) {
      const windowText = lines.slice(i, Math.min(lines.length, i + 6)).join(" ");
      if (
        !windowText.includes("signal") && !windowText.includes("AbortSignal") &&
        !windowText.includes("timeout")
      ) {
        findings.push({
          pillar: "Resilience",
          severity: "WARNING",
          file: filePath,
          line: lineNum,
          rule: "RES-001 (Fetch Without Timeout)",
          message:
            "Llamada fetch() sin AbortSignal ni timeout puede colgar la aplicación indefinidamente.",
          snippet: line.trim(),
          suggestion: "Agrega AbortSignal.timeout(5000) en el objeto de opciones del fetch.",
        });
      }
    }

    // Direct synchronous sleep or infinite loop risk
    if (
      /while\s*\(\s*true\s*\)/.test(line) &&
      !lines.slice(i, i + 10).some((l) => l.includes("break"))
    ) {
      findings.push({
        pillar: "Resilience",
        severity: "WARNING",
        file: filePath,
        line: lineNum,
        rule: "RES-002 (Unbounded Loop)",
        message: "Bucle 'while(true)' sin condición de corte inmediata detectada.",
        snippet: line.trim(),
        suggestion: "Asegura una condición límite o contador máximo de iteraciones.",
      });
    }
  }
}

function isInsideTryBlock(lines: string[], currentLineIndex: number): boolean {
  for (let i = currentLineIndex; i >= Math.max(0, currentLineIndex - 15); i--) {
    if (/\btry\s*\{/.test(lines[i])) return true;
  }
  return false;
}

// ---------------------------------------------------------------------------
// Scorecard Calculation & Aggregation
// ---------------------------------------------------------------------------

export function calculateReviewResult(findings: Finding[], filesAnalyzed: string[]): ReviewResult {
  const pillars: Record<Pillar, PillarScore> = {
    Risk: { pillar: "Risk", score: 100, status: "PASSED", findings: [] },
    Readability: { pillar: "Readability", score: 100, status: "PASSED", findings: [] },
    Reliability: { pillar: "Reliability", score: 100, status: "PASSED", findings: [] },
    Resilience: { pillar: "Resilience", score: 100, status: "PASSED", findings: [] },
  };

  const ruleDeductions = new Map<string, number>();

  for (const f of findings) {
    pillars[f.pillar].findings.push(f);
    let penalty = 2;
    let maxCap = 20;

    if (f.severity === "CRITICAL") {
      penalty = 25;
      maxCap = 100;
    } else if (f.severity === "WARNING") {
      penalty = 5;
      maxCap = 35;
    }

    const currentDeduction = ruleDeductions.get(f.rule) ?? 0;
    if (currentDeduction < maxCap) {
      const apply = Math.min(penalty, maxCap - currentDeduction);
      pillars[f.pillar].score = Math.max(0, pillars[f.pillar].score - apply);
      ruleDeductions.set(f.rule, currentDeduction + apply);
    }
  }

  for (const p of Object.values(pillars)) {
    if (p.score >= 85) p.status = "PASSED";
    else if (p.score >= 70) p.status = "WARNING";
    else p.status = "FAILED";
  }

  const scores = Object.values(pillars).map((p) => p.score);
  const overallScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);

  const hasCriticalRisk = pillars.Risk.findings.some((f) => f.severity === "CRITICAL");
  const passed = !hasCriticalRisk && overallScore >= 70;

  return {
    overallScore,
    pillars,
    filesAnalyzed,
    totalFindings: findings.length,
    passed,
  };
}

// ---------------------------------------------------------------------------
// Output Formatters
// ---------------------------------------------------------------------------

export function formatTerminal(result: ReviewResult): string {
  const lines: string[] = [];
  lines.push("\n=======================================================");
  lines.push("          GLASTOR 4R AUTOMATED CODE REVIEW             ");
  lines.push("=======================================================\n");

  lines.push(`Archivos analizados: ${result.filesAnalyzed.length}`);
  lines.push(
    `Score Global: ${result.overallScore}/100 - ${result.passed ? "✔ PASSED" : "✖ FAILED"}\n`,
  );

  lines.push("DIMENSIÓN          SCORE    ESTADO     HALLAZGOS");
  lines.push("-------------------------------------------------------");

  const icons: Record<Pillar, string> = {
    Risk: "🛡️ Risk        ",
    Readability: "📖 Readability ",
    Reliability: "🎯 Reliability ",
    Resilience: "🏗️ Resilience  ",
  };

  for (const [key, p] of Object.entries(result.pillars)) {
    const icon = icons[key as Pillar];
    const scoreStr = `${p.score}/100`.padEnd(8);
    const statusStr = p.status.padEnd(10);
    const countStr = `${p.findings.length} hallazgos`;
    lines.push(`${icon}  ${scoreStr} ${statusStr} ${countStr}`);
  }

  lines.push("-------------------------------------------------------\n");

  if (result.totalFindings > 0) {
    lines.push("DETALLE DE HALLAZGOS:");
    for (const p of Object.values(result.pillars)) {
      for (const f of p.findings) {
        const sevTag = f.severity === "CRITICAL"
          ? "[CRITICAL]"
          : f.severity === "WARNING"
          ? "[WARNING]"
          : "[INFO]";
        lines.push(`\n${sevTag} ${f.pillar} - ${f.rule}`);
        lines.push(`  Archivo: ${f.file}:${f.line}`);
        lines.push(`  Mensaje: ${f.message}`);
        if (f.snippet) lines.push(`  Código:  ${f.snippet}`);
        if (f.suggestion) lines.push(`  Sugerencia: ${f.suggestion}`);
      }
    }
  } else {
    lines.push("✨ Excelente: No se detectaron observaciones en las 4 dimensiones.");
  }

  lines.push("\n=======================================================\n");
  return lines.join("\n");
}

export function formatMarkdown(result: ReviewResult): string {
  const lines: string[] = [];
  lines.push("## 📊 Automated 4R Code Review Scorecard");
  lines.push("");
  lines.push(
    `> **Score Global:** \`${result.overallScore}/100\` — **Estado:** ${
      result.passed ? "🟢 **PASSED**" : "🔴 **FAILED**"
    }`,
  );
  lines.push(
    `> **Archivos analizados:** \`${result.filesAnalyzed.length}\` | **Total de observaciones:** \`${result.totalFindings}\``,
  );
  lines.push("");
  lines.push("| Dimensión | Score | Estado | Hallazgos |");
  lines.push("| :--- | :---: | :---: | :--- |");

  const statusBadges: Record<string, string> = {
    PASSED: "🟢 Aprobado",
    WARNING: "🟡 Advertencia",
    FAILED: "🔴 Fallido",
  };

  const icons: Record<Pillar, string> = {
    Risk: "🛡️ **Risk (Riesgo)**",
    Readability: "📖 **Readability (Legibilidad)**",
    Reliability: "🎯 **Reliability (Confiabilidad)**",
    Resilience: "🏗️ **Resilience (Resiliencia)**",
  };

  for (const [key, p] of Object.entries(result.pillars)) {
    const icon = icons[key as Pillar];
    const badge = statusBadges[p.status];
    lines.push(`| ${icon} | **${p.score}/100** | ${badge} | ${p.findings.length} observaciones |`);
  }

  lines.push("");

  if (result.totalFindings > 0) {
    lines.push("<details>");
    lines.push(
      "<summary><strong>🔍 Ver Detalle de Observaciones y Recomendaciones</strong></summary>\n",
    );

    for (const p of Object.values(result.pillars)) {
      if (p.findings.length === 0) continue;
      lines.push(`### ${p.pillar}\n`);
      for (const f of p.findings) {
        const normFile = f.file.replaceAll("\\", "/");
        const sevEmoji = f.severity === "CRITICAL" ? "🔴" : f.severity === "WARNING" ? "🟡" : "ℹ️";
        lines.push(
          `#### ${sevEmoji} \`${f.rule}\` — [${normFile}#L${f.line}](file:///${normFile}#L${f.line})`,
        );
        lines.push(`- **Mensaje:** ${f.message}`);
        if (f.snippet) lines.push(`- **Fragmento:** \`${f.snippet}\``);
        if (f.suggestion) lines.push(`- **Sugerencia:** ${f.suggestion}`);
        lines.push("");
      }
    }

    lines.push("</details>\n");
  } else {
    lines.push(
      "✨ **¡Código impecable!** No se detectaron vulnerabilidades de riesgo, problemas de legibilidad, fallos de confiabilidad ni debilidades de resiliencia.\n",
    );
  }

  return lines.join("\n");
}

// ---------------------------------------------------------------------------
// File Discovery & CLI Execution
// ---------------------------------------------------------------------------

async function getFilesToScan(args: string[]): Promise<string[]> {
  const scanAll = args.includes("--all");
  const scanDiff = args.includes("--diff");

  if (!scanAll && scanDiff) {
    try {
      const cmd = new Deno.Command("git", {
        args: ["diff", "--name-only", "origin/master...HEAD"],
        stdout: "piped",
      });
      const output = await cmd.output();
      if (output.success) {
        const text = new TextDecoder().decode(output.stdout);
        const files = text
          .split(/\r?\n/)
          .map((f) => f.trim())
          .filter((f) => f.startsWith("src/") && (f.endsWith(".ts") || f.endsWith(".js")));
        if (files.length > 0) return files;
      }
    } catch {
      // fallback to scanning src/
    }
  }

  const files: string[] = [];
  const srcDir = join(Deno.cwd(), "src");
  for await (
    const entry of walk(srcDir, {
      includeDirs: false,
      followSymlinks: false,
      skip: [/\.git/, /node_modules/, /dist/, /build/, /test/, /bench/],
    })
  ) {
    const ext = extname(entry.path).toLowerCase();
    if (ext === ".ts" || ext === ".js") {
      files.push(relative(Deno.cwd(), entry.path).replaceAll("\\", "/"));
    }
  }

  return files.sort();
}

if (import.meta.main) {
  const args = Deno.args;
  const files = await getFilesToScan(args);
  const allFindings: Finding[] = [];

  for (const file of files) {
    try {
      const content = await Deno.readTextFile(file);
      const fileFindings = await reviewFile(file, content);
      allFindings.push(...fileFindings);
    } catch {
      // Ignorar archivos no accesibles
    }
  }

  const result = calculateReviewResult(allFindings, files);

  const formatIdx = args.indexOf("--format");
  const format = formatIdx >= 0 ? args[formatIdx + 1] : "terminal";

  const outputIdx = args.indexOf("--output");
  const outputPath = outputIdx >= 0 ? args[outputIdx + 1] : undefined;

  if (format === "markdown") {
    const md = formatMarkdown(result);
    if (outputPath) {
      await Deno.writeTextFile(outputPath, md);
      console.log(`Markdown review written to: ${outputPath}`);
    } else {
      console.log(md);
    }
  } else {
    console.log(formatTerminal(result));
  }

  // Si estamos en CI o se solicita fail-on-critical
  if (args.includes("--fail-on-critical") && !result.passed) {
    Deno.exit(1);
  }
}
