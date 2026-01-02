import { walk } from "jsr:@std/fs/walk";
import { basename } from "jsr:@std/path/basename";

export interface TestDetection {
  hasTests: boolean;
  testFiles: string[];
}

export async function detectTests(projectRoot: string): Promise<TestDetection> {
  const testFiles: string[] = [];

  for await (const entry of walk(projectRoot, { includeDirs: false, followSymlinks: false })) {
    const name = basename(entry.path);
    if (
      name.endsWith("_test.ts") || name.endsWith("_test.js") || entry.path.includes("/test/") ||
      entry.path.includes("\\test\\")
    ) {
      testFiles.push(entry.path);
    }
  }

  testFiles.sort();
  return { hasTests: testFiles.length > 0, testFiles };
}
