import type { ExportInfo } from "../parsers/source_code.ts";
import { readDenoConfig } from "../parsers/deno_json.ts";
import { loadUserConfig } from "../utils/user_config.ts";

export interface LlmsTxtOptions {
  projectRoot: string;
  exports: ExportInfo[];
}

export async function generateLlmsTxt(options: LlmsTxtOptions): Promise<string> {
  const denoConfig = await readDenoConfig(options.projectRoot);
  const userConfig = await loadUserConfig(options.projectRoot);

  const name = denoConfig?.name ?? userConfig.projectName ?? "Project";
  const desc = denoConfig?.description ?? userConfig.description ?? "Deno & TypeScript Project";
  const publicExports = options.exports.filter((e) => !e.isInternal);

  const lines: string[] = [
    `# ${name}`,
    ``,
    `> ${desc}`,
    ``,
    `## Quick Overview`,
    `- Version: ${denoConfig?.version ?? "latest"}`,
    `- License: ${denoConfig?.license ?? userConfig.license ?? "GPL-3.0"}`,
    `- Runtime: Deno >= 2.0.0`,
    `- Entrypoint: ${denoConfig?.exports ?? "./src/mod.ts"}`,
    ``,
    `## Public API Reference`,
  ];

  if (publicExports.length === 0) {
    lines.push(`- (No public exports detected)`);
  } else {
    for (const exp of publicExports) {
      const sig = exp.signature ? `\`${exp.signature}\`` : `\`${exp.name}\` (${exp.type})`;
      const doc = exp.description ? ` - ${exp.description.replace(/\r?\n+/g, " ")}` : "";
      lines.push(`- ${sig}${doc}`);
      if (exp.examples && exp.examples.length > 0) {
        lines.push(`  - Example: \`${exp.examples[0].replace(/\r?\n+/g, " ")}\``);
      }
    }
  }

  lines.push(``);
  lines.push(`## Documentation & Links`);
  if (userConfig.repo) {
    lines.push(`- Repository: https://github.com/${userConfig.repo}`);
  }
  lines.push(`- Documentation: ./book/`);
  lines.push(`- Full README: ./README.md`);

  return lines.join("\n") + "\n";
}
