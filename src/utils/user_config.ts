import { exists } from "jsr:@std/fs/exists";
import { join } from "jsr:@std/path/join";
import { parse as parseJsonc } from "jsr:@std/jsonc/parse";

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
  if (!(await exists(path))) {
    return {
      exclude: [".git", "node_modules", "dist", "build"],
      includeExamples: true,
      badgeStyle: "for-the-badge",
    };
  }

  const text = await Deno.readTextFile(path);
  const data = parseJsonc(text) as Record<string, unknown>;

  const repoUrl = asString((data as any).repoUrl);
  const repo = asString(data.repo) ?? (repoUrl ? parseGitHubRepoFromUrl(repoUrl) : undefined);

  return {
    projectName: asString(data.projectName),
    description: asString(data.description),
    repo,
    repoUrl,
    defaultBranch: asString((data as any).defaultBranch),
    ciWorkflow: asString((data as any).ciWorkflow),
    license: asString(data.license),
    exclude: asStringArray(data.exclude),
    includeExamples: asBoolean(data.includeExamples),
    badgeStyle: asString(data.badgeStyle),
    contributing: asString(data.contributing),
    sections: isRecord(data.sections)
      ? {
        installation: asBoolean((data.sections as any).installation),
        api: asBoolean((data.sections as any).api),
        contributing: asBoolean((data.sections as any).contributing),
        license: asBoolean((data.sections as any).license),
      }
      : undefined,
    api: isRecord((data as any).api)
      ? {
        include: asStringArray(((data as any).api as any).include),
        exclude: asStringArray(((data as any).api as any).exclude),
        hideInternal: asBoolean(((data as any).api as any).hideInternal),
      }
      : undefined,
    sanitize: isRecord((data as any).sanitize)
      ? {
        forceBannerFirst: asBoolean(((data as any).sanitize as any).forceBannerFirst),
        bannerLine: asString(((data as any).sanitize as any).bannerLine),
      }
      : undefined,
    strict: asBoolean((data as any).strict),
    customSections: Array.isArray(data.customSections)
      ? data.customSections
        .filter((x) => isRecord(x))
        .map((x) => ({
          title: asString((x as any).title) ?? "",
          content: asString((x as any).content) ?? "",
          position: asString((x as any).position),
        }))
        .filter((x) => x.title && x.content)
      : undefined,
  };
}

function asString(v: unknown): string | undefined {
  return typeof v === "string" ? v : undefined;
}

function asBoolean(v: unknown): boolean | undefined {
  return typeof v === "boolean" ? v : undefined;
}

function asStringArray(v: unknown): string[] | undefined {
  return Array.isArray(v) ? v.filter((x) => typeof x === "string") : undefined;
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function parseGitHubRepoFromUrl(url: string): string | undefined {
  // https://github.com/owner/repo(.git)
  try {
    const u = new URL(url);
    if (u.hostname !== "github.com") return undefined;

    const parts = u.pathname.replace(/^\/+/, "").replace(/\.git$/, "").split("/");
    if (parts.length < 2) return undefined;
    return `${parts[0]}/${parts[1]}`;
  } catch {
    // not a URL
  }

  // git@github.com:owner/repo(.git)
  const m = url.match(/^git@github\.com:([^/]+)\/([^\s]+?)(?:\.git)?$/);
  if (m) return `${m[1]}/${m[2]}`;

  return undefined;
}
