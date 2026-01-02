import { parseArgs } from "jsr:@std/cli/parse-args";
import { generateReadme } from "./mod.ts";

const args = parseArgs(Deno.args, {
  boolean: ["help", "version", "force"],
  string: ["template", "output"],
  default: {
    template: "modern",
    output: "README.md",
    force: false,
  },
});

if (args.help) {
  console.log(`\
README Generator for Deno Projects

USAGE:
  readmegen [OPTIONS]

OPTIONS:
  --template    Template style (minimal|modern|detailed)
  --output      Output file (default: README.md)
  --force       Overwrite existing file (creates README.md.bak)
  --help        Show this help
  --version     Show version
`);
  Deno.exit(0);
}

if (args.version) {
  try {
    const denoJsonText = await Deno.readTextFile(new URL("../deno.json", import.meta.url));
    const denoJson = JSON.parse(denoJsonText);
    console.log(denoJson?.version ?? "0.0.0");
  } catch {
    console.log("0.0.0");
  }
  Deno.exit(0);
}

await generateReadme({
  template: String(args.template ?? "modern"),
  output: String(args.output ?? "README.md"),
  force: Boolean(args.force),
});
