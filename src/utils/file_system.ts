import { exists } from "jsr:@std/fs/exists";

export async function ensureWritableOutput(
  outputPath: string,
  options: { force: boolean },
): Promise<void> {
  const outputExists = await exists(outputPath);
  if (!outputExists) return;

  if (!options.force) {
    throw new Error(
      `Refusing to overwrite existing ${outputPath}. Use --force to overwrite.`,
    );
  }

  const backup = `${outputPath}.bak`;
  const backupExists = await exists(backup);
  if (!backupExists) {
    const current = await Deno.readTextFile(outputPath);
    await Deno.writeTextFile(backup, current);
  }
}
