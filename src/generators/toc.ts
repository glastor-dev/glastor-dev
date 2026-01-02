export interface TocOptions {
  includeInstallation: boolean;
  includeUsage: boolean;
  includeApi: boolean;
  includeTesting: boolean;
  includeContributing: boolean;
  includeLicense: boolean;
  includeDependencies: boolean;
  includeCi: boolean;
}

export function generateToc(options: TocOptions): string {
  const items: { title: string; anchor: string }[] = [];

  if (options.includeInstallation) items.push({ title: "Installation", anchor: "installation" });
  if (options.includeUsage) items.push({ title: "Usage", anchor: "usage" });
  if (options.includeApi) items.push({ title: "API Reference", anchor: "api-reference" });
  if (options.includeDependencies) items.push({ title: "Dependencies", anchor: "dependencies" });
  if (options.includeCi) items.push({ title: "CI/CD", anchor: "cicd" });
  if (options.includeTesting) items.push({ title: "Testing", anchor: "testing" });
  if (options.includeContributing) items.push({ title: "Contributing", anchor: "contributing" });
  if (options.includeLicense) items.push({ title: "License", anchor: "license" });

  return items.map((i) => `- [${i.title}](#${i.anchor})`).join("\n");
}
