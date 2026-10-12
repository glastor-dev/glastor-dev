import { assertEquals } from "jsr:@std/assert/equals";
import { assertRejects } from "jsr:@std/assert/rejects";
import { exists } from "jsr:@std/fs/exists";
import { join } from "jsr:@std/path/join";
import { loadUserConfig } from "../src/utils/user_config.ts";
import { ensureWritableOutput } from "../src/utils/file_system.ts";

Deno.test("loadUserConfig retorna valores por defecto cuando no hay archivo", async () => {
  const tmpDir = await Deno.makeTempDir();
  try {
    const config = await loadUserConfig(tmpDir);
    assertEquals(config.badgeStyle, "for-the-badge");
    assertEquals(config.includeExamples, true);
    assertEquals(Array.isArray(config.exclude), true);
  } finally {
    await Deno.remove(tmpDir, { recursive: true });
  }
});

Deno.test("loadUserConfig carga y parsea .readmegen.json correctamente", async () => {
  const tmpDir = await Deno.makeTempDir();
  try {
    const configData = {
      projectName: "test-lib",
      description: "Libreria de prueba",
      badgeStyle: "flat-square",
      strict: true,
    };
    await Deno.writeTextFile(
      join(tmpDir, ".readmegen.json"),
      JSON.stringify(configData, null, 2),
    );

    const config = await loadUserConfig(tmpDir);
    assertEquals(config.projectName, "test-lib");
    assertEquals(config.description, "Libreria de prueba");
    assertEquals(config.badgeStyle, "flat-square");
    assertEquals(config.strict, true);
  } finally {
    await Deno.remove(tmpDir, { recursive: true });
  }
});

Deno.test("ensureWritableOutput rechaza sobreescritura si force es false", async () => {
  const tmpFile = await Deno.makeTempFile();
  try {
    await assertRejects(
      () => ensureWritableOutput(tmpFile, { force: false }),
      Error,
      "Refusing to overwrite",
    );
  } finally {
    await Deno.remove(tmpFile);
  }
});

Deno.test("ensureWritableOutput crea backup .bak cuando force es true", async () => {
  const tmpFile = await Deno.makeTempFile();
  const bakFile = `${tmpFile}.bak`;
  try {
    await Deno.writeTextFile(tmpFile, "contenido original");
    await ensureWritableOutput(tmpFile, { force: true });

    assertEquals(await exists(bakFile), true);
    assertEquals(await Deno.readTextFile(bakFile), "contenido original");
  } finally {
    await Deno.remove(tmpFile);
    if (await exists(bakFile)) await Deno.remove(bakFile);
  }
});
