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

export function generateBadges(config: BadgesConfig): string {
  const style = encodeURIComponent(config.badgeStyle ?? "for-the-badge");

  const badges: string[] = [
    `![Deno](https://img.shields.io/badge/deno-%23000000.svg?style=${style}&logo=deno&logoColor=white)`,
    `![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=${style}&logo=typescript&logoColor=white)`,
  ];

  if (config.license) {
    const lic = encodeURIComponent(config.license);
    badges.push(`![License](https://img.shields.io/badge/license-${lic}-blue.svg?style=${style})`);
  }

  if (config.denoVersion) {
    const v = encodeURIComponent(`^${config.denoVersion}`);
    badges.push(
      `![Deno Version](https://img.shields.io/badge/deno-${v}-green?style=${style}&logo=deno)`,
    );
  }

  if (config.hasWorkflows && config.repo) {
    const workflow = encodeURIComponent(config.workflowFile ?? "ci.yml");
    const branch = config.branch ? `?branch=${encodeURIComponent(config.branch)}` : "";
    badges.push(
      `![CI](https://github.com/${config.repo}/actions/workflows/${workflow}/badge.svg${branch})`,
    );
  }

  return badges.join("\n");
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
