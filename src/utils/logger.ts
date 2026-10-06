import { colors } from "jsr:@cliffy/ansi@1.0.0-rc.7/colors";

export const Logger = {
  success(msg: string) {
    console.log(`${colors.green("✔")} ${colors.bold(msg)}`);
  },
  info(msg: string) {
    console.log(`${colors.blue("ℹ")} ${msg}`);
  },
  warn(msg: string) {
    console.warn(`${colors.yellow("⚠")} ${colors.yellow(msg)}`);
  },
  error(msg: string) {
    console.error(`${colors.red("✖")} ${colors.red(colors.bold("Error:"))} ${msg}`);
  },
  step(msg: string) {
    console.log(`${colors.magenta("➔")} ${colors.cyan(msg)}`);
  },
  banner(title: string) {
    console.log("\n" + colors.bgBlue(colors.white(colors.bold(` ${title} `))) + "\n");
  },
};
