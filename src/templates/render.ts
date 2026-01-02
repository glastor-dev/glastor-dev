export function renderTemplate(template: string, data: Record<string, string>): string {
  return template.replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (_m, key) => {
    const value = data[key];
    return value == null ? "" : String(value);
  });
}
