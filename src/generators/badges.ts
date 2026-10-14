export interface BadgesConfig {
  license?: string;
  denoVersion?: string;
  repo?: string; // owner/repo
  hasWorkflows?: boolean;
  workflowFile?: string;
  branch?: string;
  badgeStyle?: string; // shields.io style
}

export interface RepoBadgesConfig {
  repo: string; // owner/repo
  badgeStyle?: string;
  branch?: string;
}

export function generateBadges(_config: BadgesConfig): string {
  return [
    `[![Deno](https://img.shields.io/badge/Deno-%5E2.0.0-black?logo=deno&logoColor=white)](https://deno.land/)`,
    `[![Docker](https://img.shields.io/badge/Docker-ready-blue?logo=docker&logoColor=white)](https://hub.docker.com/)`,
    `[![Lefthook](https://img.shields.io/badge/lefthook-enabled-brightgreen?logo=lefthook&logoColor=white)](https://github.com/evilmartians/lefthook)`,
  ].join("\n");
}

export function generateRepoBadges(config: RepoBadgesConfig): string {
  const style = encodeURIComponent(config.badgeStyle ?? "for-the-badge");
  const repo = config.repo;
  const branch = config.branch ? `&branch=${encodeURIComponent(config.branch)}` : "";

  return [
    `![Stars](https://img.shields.io/github/stars/${repo}.svg?style=${style})`,
    `![Forks](https://img.shields.io/github/forks/${repo}.svg?style=${style})`,
    `![Issues](https://img.shields.io/github/issues/${repo}.svg?style=${style})`,
    `![Last Commit](https://img.shields.io/github/last-commit/${repo}.svg?style=${style}${branch})`,
  ].join("\n");
}

export interface VisitorBadgeConfig {
  target: string; // e.g. "github.com/glastor-dev" or "glastor-dev"
  style?: string; // e.g. "flat-square"
  label?: string; // e.g. "Visitas"
  extraCount?: number;
  color?: string; // e.g. "8a2be2"
  labelColor?: string; // e.g. "555555"
}

export function generateVisitorBadge(config: VisitorBadgeConfig): string {
  const target = config.target.startsWith("github.com/")
    ? config.target
    : `github.com/${config.target}`;
  const style = encodeURIComponent(config.style ?? "flat-square");
  const label = encodeURIComponent(config.label ?? "Visitas");
  const extraCount = typeof config.extraCount === "number"
    ? `&extraCount=${config.extraCount}`
    : "";
  const color = encodeURIComponent(config.color ?? "8a2be2");
  const labelColor = encodeURIComponent(config.labelColor ?? "555555");

  const badgeUrl =
    `https://hits.sh/${target}.svg?style=${style}&label=${label}${extraCount}&color=${color}&labelColor=${labelColor}`;
  const targetUrl = `https://hits.sh/${target}/`;

  return `[![Profile Views](${badgeUrl})](${targetUrl})`;
}
