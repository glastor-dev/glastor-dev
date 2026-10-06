export function renderTemplate(template: string, data: Record<string, string>): string {
  return template.replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (_m, key) => {
    const value = data[key];
    if (value == null) {
      console.warn(`[Warning] Template key "${key}" not found in project analysis.`);
      return "";
    }
    return String(value);
  });
}
