import { readDenoConfig } from "../parsers/deno_json.ts";
import { readImportMap } from "../parsers/import_map.ts";
import { analyzeImports } from "../parsers/imports.ts";
import { extractExportsFromProject } from "../parsers/source_code.ts";
import { detectTests } from "../parsers/tests.ts";
import { detectWorkflows } from "../parsers/workflows.ts";
import { detectProjectFiles } from "../parsers/project_files.ts";
import { loadUserConfig } from "../utils/user_config.ts";
import { generateBadges, generateRepoBadges } from "../generators/badges.ts";
import { generateToc } from "../generators/toc.ts";
import { generateApiDocs } from "../generators/api.ts";
import { generateExamples } from "../generators/examples.ts";
import { inferDescriptionFromReadme } from "../utils/readme_infer.ts";

export interface AnalyzeProjectOptions {
  projectRoot: string;
  readmePath: string;
}

export interface TemplateData {
  projectName: string;
  badges: string;
  ciBadge: string;
  repoBadges: string;
  description: string;
  toc: string;
  installation: string;
  usage: string;
  basicExample: string;
  apiDocs: string;
  testCommand: string;
  contributing: string;
  license: string;
  dependencies: string;
  ci: string;
  customSections: string;
}

export interface ProjectAnalysis {
  templateData: Record<string, string>;
}

export async function analyzeProject(options: AnalyzeProjectOptions): Promise<ProjectAnalysis> {
  const userConfig = await loadUserConfig(options.projectRoot);

  const projectName = userConfig.projectName ?? basenameSafe(options.projectRoot);

  const [denoConfig, importMap, workflows, tests, projectFiles, importAnalysis] = await Promise.all(
    [
      readDenoConfig(options.projectRoot),
      readImportMap(options.projectRoot),
      detectWorkflows(options.projectRoot),
      detectTests(options.projectRoot),
      detectProjectFiles(options.projectRoot),
      analyzeImports(options.projectRoot, { exclude: userConfig.exclude }),
    ],
  );

  const detectedConfigFiles: string[] = [];
  if (denoConfig) detectedConfigFiles.push("deno.json/deno.jsonc");
  if (importMap) detectedConfigFiles.push("import_map.json");

  const exports = await extractExportsFromProject(options.projectRoot, {
    exclude: [...(userConfig.exclude ?? []), ...(userConfig.api?.exclude ?? [])],
    include: userConfig.api?.include,
  });

  const filteredExports = (userConfig.api?.hideInternal)
    ? exports.filter((e) => !e.isInternal)
    : exports;

  const existingReadmeDescription = await inferDescriptionFromReadme(options.readmePath);
  const description = userConfig.description ?? existingReadmeDescription ?? "";

  const license = userConfig.license ?? "";

  const repo = userConfig.repo ?? "";
  const defaultBranch = userConfig.defaultBranch ?? "main";
  const ciWorkflow = userConfig.ciWorkflow ?? "ci.yml";

  const badges = await generateBadges({
    badgeStyle: userConfig.badgeStyle,
    license,
    denoVersion: denoConfig?.version ?? "",
    repo,
    hasWorkflows: workflows.length > 0,
    workflowFile: ciWorkflow,
    branch: defaultBranch,
  });

  const repoBadges = repo
    ? generateRepoBadges({
      repo,
      badgeStyle: userConfig.badgeStyle,
      branch: defaultBranch,
    })
    : "";

  const ciBadge = repo
    ? `![Build Status](https://github.com/${repo}/actions/workflows/${
      encodeURIComponent(ciWorkflow)
    }/badge.svg?branch=${encodeURIComponent(defaultBranch)})`
    : "";
  const apiDocs = generateApiDocs(filteredExports);
  const examples = await generateExamples(options.projectRoot, filteredExports, {
    includeExamples: userConfig.includeExamples,
    exclude: userConfig.exclude,
  });

  const binName = denoConfig?.name
    ? denoConfig.name.replace(/^@/, "").replaceAll("/", "-")
    : "readmegen";
  const installation = denoConfig?.name
    ? `deno install -A -n ${binName} ./src/main.ts`
    : `deno install -A -n readmegen ./src/main.ts`;

  const usage = denoConfig?.tasks?.["readme"]
    ? `deno task readme`
    : `${binName} --template modern --output README.md`;
  const basicExample = examples.basicExample;

  const testCommand = denoConfig?.tasks?.test
    ? `deno task test`
    : tests.hasTests
    ? `deno test -A`
    : "(no tests detected)";

  const contributing = userConfig.contributing ?? "Contributions welcome. Open an issue or a PR.";

  const dependencies = formatDependencies(importAnalysis, detectedConfigFiles, projectFiles);
  const ci = workflows.map((w) => `- ${w}`).join("\n");

  const sections = {
    installation: userConfig.sections?.installation !== false,
    api: userConfig.sections?.api !== false,
    contributing: userConfig.sections?.contributing !== false,
    license: userConfig.sections?.license !== false,
    dependencies: userConfig.sections?.dependencies !== false,
  };

  const toc = generateToc({
    includeInstallation: sections.installation,
    includeUsage: true,
    includeApi: sections.api,
    includeTesting: true,
    includeContributing: sections.contributing,
    includeLicense: sections.license,
    includeDependencies: true,
    includeCi: workflows.length > 0,
  });

  const templateData: TemplateData = {
    projectName,
    badges,
    ciBadge,
    repoBadges,
    description: description || "(No description detected)",
    toc,
    installation,
    usage,
    basicExample,
    apiDocs: sections.api ? apiDocs : "",
    testCommand,
    contributing: sections.contributing ? contributing : "",
    license: sections.license ? (license || "(No license detected)") : "",
    dependencies: userConfig.sections?.dependencies !== false ? dependencies : "",
    ci,
    customSections: "",
  };

  if (userConfig.strict) {
    const missing: string[] = [];
    if (!templateData.description || templateData.description.includes("No description")) {
      missing.push("description");
    }
    if (sections.api && (!apiDocs || apiDocs.includes("No public exports"))) {
      missing.push("apiDocs");
    }
    if (
      sections.license && (!templateData.license || templateData.license.includes("No license"))
    ) missing.push("license");
    if (missing.length) {
      throw new Error(`Strict mode: missing required fields: ${missing.join(", ")}`);
    }
  }

  if (Array.isArray(userConfig.customSections) && userConfig.customSections.length > 0) {
    templateData["customSections"] = userConfig.customSections
      .map((s) => `## ${s.title}\n\n${s.content}`)
      .join("\n\n");
  } else {
    templateData["customSections"] = "";
  }

  return {
    templateData: templateData as unknown as Record<string, string>,
  };
}

function basenameSafe(path: string): string {
  const parts = path.replaceAll("\\", "/").split("/").filter(Boolean);
  return parts[parts.length - 1] ?? "project";
}

function formatDependencies(
  importAnalysis: { std: string[]; thirdParty: string[] },
  configFiles: string[],
  projectFiles: string[],
): string {
  const sections = [
    { title: "### Config files", items: configFiles },
    { title: "### Project files", items: projectFiles },
    { title: "### Standard Library", items: importAnalysis.std },
    { title: "### Third-party", items: importAnalysis.thirdParty },
  ];

  return sections
    .map(({ title, items }) =>
      `${title}\n${items.length ? items.map((f) => `- ${f}`).join("\n") : "- (none)"}`
    )
    .join("\n\n");
}
