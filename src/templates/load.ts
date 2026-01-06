export async function loadTemplate(name: string): Promise<string> {
  const normalized = name.toLowerCase();
  const fileName = normalized === "minimal" || normalized === "modern" || normalized === "detailed"
    ? `${normalized}.md`
    : "modern.md";

  const templateUrl = new URL(fileName, import.meta.url);
  return await Deno.readTextFile(templateUrl);
}
