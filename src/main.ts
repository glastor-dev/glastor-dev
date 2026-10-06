import { Command } from "jsr:@cliffy/command@1.0.0-rc.7";
import { generateReadme } from "./mod.ts";
import { runInitWizard } from "./utils/init_wizard.ts";
import { Logger } from "./utils/logger.ts";

const denoJson = JSON.parse(await Deno.readTextFile(new URL("../deno.json", import.meta.url)));

await new Command()
  .name("readmegen")
  .version(denoJson.version)
  .description("README Generator for Deno Projects")
  // El comando principal genera el readme
  .option("-t, --template <name:string>", "Template style (minimal|modern|detailed)", {
    default: "modern",
  })
  .option("-o, --output <path:string>", "Output file path", { default: "README.md" })
  .option("-f, --force", "Overwrite existing file", { default: false })
  .action(async ({ template, output, force }) => {
    try {
      Logger.step(`Generating README using '${template}' template...`);
      await generateReadme({
        template: template as string,
        output: output as string,
        force: !!force,
      });
      Logger.success(`Successfully generated: ${output}`);
    } catch (error) {
      Logger.error(error instanceof Error ? error.message : String(error));
      Deno.exit(1);
    }
  })
  // Subcomando init para configuración guiada
  .command("init", "Initialize a new .readmegen.json configuration")
  .action(async () => {
    try {
      await runInitWizard(Deno.cwd());
    } catch (error) {
      Logger.error(error instanceof Error ? error.message : String(error));
      Deno.exit(1);
    }
  })
  .parse(Deno.args);
