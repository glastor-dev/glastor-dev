/**
 * scripts/spell_add.ts
 *
 * Escanea archivos con CSpell y añade automáticamente las nuevas palabras
 * desconocidas al diccionario del proyecto (.cspell/custom-words.txt)
 * de forma ordenada y deduplicada.
 *
 * Uso:
 *   deno task spell:add                  # Escanea todos los archivos Markdown
 *   deno task spell:add README.profile.md # Escanea un archivo específico
 *   deno task spell:add 'src/**'           # Escanea código fuente
 */

const DICT_PATH = ".cspell/custom-words.txt";

async function main() {
  const targetPattern = Deno.args.length > 0 ? Deno.args.join(" ") : "**/*.md";
  console.log(`🔍 [SpellChecker] Escaneando objetivos: ${targetPattern}...`);

  // Ejecutar cspell con flags para listar palabras únicas desconocidas
  const isWindows = Deno.build.os === "windows";
  const cmd = isWindows ? "npx.cmd" : "npx";

  const command = new Deno.Command(cmd, {
    args: [
      "cspell",
      ...targetPattern.split(" "),
      "--words-only",
      "--unique",
      "--no-progress",
    ],
    stdout: "piped",
    stderr: "piped",
  });

  const { stdout } = await command.output();
  const rawOutput = new TextDecoder().decode(stdout);

  const words = rawOutput
    .split(/\r?\n/)
    .map((w) => w.trim())
    .filter((w) => w.length > 1 && !w.startsWith("CSpell:"));

  if (words.length === 0) {
    console.log("✅ No se detectaron palabras nuevas desconocidas.");
    return;
  }

  // Leer diccionario existente
  let existingWords: string[] = [];
  try {
    const content = await Deno.readTextFile(DICT_PATH);
    existingWords = content
      .split(/\r?\n/)
      .map((w: string) => w.trim())
      .filter((w: string) => w.length > 0);
  } catch (_e) {
    // Si no existe, se creará
  }

  const existingSet = new Set(existingWords.map((w) => w.toLowerCase()));
  const newWords = words.filter((w) => !existingSet.has(w.toLowerCase()));

  if (newWords.length === 0) {
    console.log("ℹ️ Todas las palabras detectadas ya están registradas en el diccionario.");
    return;
  }

  // Combinar y ordenar
  const combined = Array.from(new Set([...existingWords, ...newWords])).sort((a, b) =>
    a.localeCompare(b, undefined, { sensitivity: "base" })
  );

  await Deno.writeTextFile(DICT_PATH, combined.join("\n") + "\n");

  console.log(`✨ ¡Se añadieron ${newWords.length} nueva(s) palabra(s) a ${DICT_PATH}!`);
  console.log("Palabras añadidas:");
  for (const w of newWords) {
    console.log(`  + ${w}`);
  }
}

if ((import.meta as { main?: boolean }).main) {
  await main();
}
