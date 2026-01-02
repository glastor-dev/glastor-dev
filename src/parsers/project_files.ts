import { exists } from "jsr:@std/fs/exists";
import { join } from "jsr:@std/path/join";

export async function detectProjectFiles(projectRoot: string): Promise<string[]> {
  const candidates = [
    "Dockerfile",
    "compose.yaml",
    "compose.yml",
    "docker-compose.yaml",
    "docker-compose.yml",
    "Makefile",
    ".env.example",
    ".env.sample",
    "LICENSE",
    "LICENSE.md",
    "LICENSE.txt",
    "CONTRIBUTING.md",
    "SECURITY.md",
    "CODE_OF_CONDUCT.md",
  ];

  const found: string[] = [];
  for (const name of candidates) {
    if (await exists(join(projectRoot, name))) found.push(name);
  }

  found.sort((a, b) => a.localeCompare(b));
  return found;
}
