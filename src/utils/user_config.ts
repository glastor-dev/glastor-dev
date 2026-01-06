import { exists } from "jsr:@std/fs@^1.0.0/exists";
import { join } from "jsr:@std/path@^1.0.0/join";
import { parse as parseJsonc } from "jsr:@std/jsonc@^1.0.0/parse";

export interface UserConfig {
  projectName?: string;
  description?: string;
  repo?: string;
  repoUrl?: string;
  defaultBranch?: string;
  ciWorkflow?: string;
  license?: string;
  exclude?: string[];
  includeExamples?: boolean;
  badgeStyle?: string;
  contributing?: string;
  sections?: {
    installation?: boolean;
    api?: boolean;
    contributing?: boolean;
    license?: boolean;
    dependencies?: boolean;
  };
  api?: {
    include?: string[];
    exclude?: string[];
    hideInternal?: boolean;
  };
  sanitize?: {
    forceBannerFirst?: boolean;
    bannerLine?: string;
  };
  strict?: boolean;
  customSections?: Array<{ title: string; content: string; position?: string }>;
}

export async function loadUserConfig(projectRoot: string): Promise<UserConfig> {
  const path = join(projectRoot, ".readmegen.json");
  const defaultConfig: UserConfig = {
    exclude: [".git", "node_modules", "dist", "build"],
    includeExamples: true,
    badgeStyle: "for-the-badge",
  };

  if (!(await exists(path))) return defaultConfig;

  try {
    const text = await Deno.readTextFile(path);
    const data = parseJsonc(text) as any;

    // Validación básica Pro: asegurar tipos correctos
    validateConfig(data);

    const repoUrl = asString(data.repoUrl);
    const repo = asString(data.repo) ?? (repoUrl ? parseGitHubRepoFromUrl(repoUrl) : undefined);

    return {
      ...defaultConfig,
      projectName: asString(data.projectName),
      description: asString(data.description),
      repo,
      repoUrl,
      defaultBranch: asString(data.defaultBranch),
      ciWorkflow: asString(data.ciWorkflow),
      license: asString(data.license),
      exclude: asStringArray(data.exclude) ?? defaultConfig.exclude,
      includeExamples: asBoolean(data.includeExamples) ?? defaultConfig.includeExamples,
      badgeStyle: asString(data.badgeStyle) ?? defaultConfig.badgeStyle,
      contributing: asString(data.contributing),
      sections: isRecord(data.sections) ? data.sections : undefined,
      api: isRecord(data.api) ? data.api : undefined,
      sanitize: isRecord(data.sanitize) ? data.sanitize : undefined,
      strict: asBoolean(data.strict),
      customSections: validateCustomSections(data.customSections),
    };
  } catch (e) {
    throw new Error(
      `Invalid configuration in .readmegen.json: ${e instanceof Error ? e.message : String(e)}`,
    );
  }
}

function validateConfig(config: any) {
  if (config.exclude && !Array.isArray(config.exclude)) {
    throw new Error("'exclude' must be an array of strings.");
  }
  if (config.sections && !isRecord(config.sections)) {
    throw new Error("'sections' must be an object.");
  }
}

function validateCustomSections(sections: any) {
  if (!Array.isArray(sections)) return undefined;
  return sections
    .filter(isRecord)
    .map((s: any) => ({
      title: asString(s.title) || "",
      content: asString(s.content) || "",
      position: asString(s.position),
    }))
    .filter((s) => s.title && s.content);
}

function asString(v: unknown): string | undefined {
  return typeof v === "string" ? v : undefined;
}

function asBoolean(v: unknown): boolean | undefined {
  return typeof v === "boolean" ? v : undefined;
}

function asStringArray(v: unknown): string[] | undefined {
  return Array.isArray(v) ? v.filter((i) => typeof i === "string") as string[] : undefined;
}

function isRecord(v: unknown): v is Record<string, any> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function parseGitHubRepoFromUrl(url: string): string | undefined {
  try {
    const u = new URL(url);
    if (u.hostname !== "github.com") return undefined;
    const parts = u.pathname.replace(/^\/+/, "").replace(/\.git$/, "").split("/");
    if (parts.length >= 2) return `${parts[0]}/${parts[1]}`;
  } catch { /* ignore */ }

  const m = url.match(/^git@github\.com:([^/]+)\/([^\s]+?)(?:\.git)?$/);
  return m ? `${m[1]}/${m[2]}` : undefined;
}
