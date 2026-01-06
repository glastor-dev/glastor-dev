import { Confirm, Input, Select } from "jsr:@cliffy/prompt@1.0.0-rc.7";
import { Logger } from "./logger.ts";
import { join } from "jsr:@std/path/join";

export async function runInitWizard(projectRoot: string) {
  Logger.banner("GLASTOR README GENERATOR - SETUP");

  const projectName = await Input.prompt({
    message: "Project Name:",
    default: projectRoot.split(/[\\/]/).pop() || "my-project",
  });

  const description = await Input.prompt({
    message: "Short description:",
    validate: (v) => v.length > 0 || "Description is required",
  });

  const repo = await Input.prompt({
    message: "GitHub Repository (owner/repo):",
    placeholder: "glastor-dev/glastor-deno",
  });

  const badgeStyle = await Select.prompt({
    message: "Badge Style:",
    options: [
      { name: "Flat", value: "flat" },
      { name: "Flat Square", value: "flat-square" },
      { name: "Plastic", value: "plastic" },
      { name: "For the Badge", value: "for-the-badge" },
    ],
    default: "for-the-badge",
  });

  const includeExamples = await Confirm.prompt({
    message: "Auto-detect examples in source code?",
    default: true,
  });

  const config = {
    projectName,
    description,
    repo,
    badgeStyle,
    includeExamples,
    exclude: [".git", "node_modules", "dist", "build", ".venv"],
    strict: false,
  };

  const configPath = join(projectRoot, ".readmegen.json");
  await Deno.writeTextFile(configPath, JSON.stringify(config, null, 2));

  console.log("");
  Logger.success("Configuration saved to .readmegen.json");
  Logger.info("You can now run 'readmegen' to generate your README.");
}
