import { hideBin } from "yargs/helpers";
import yargs from "yargs";
import chalk from "chalk";
import { parseConfig, ParsedConfig, resolveConfigPath } from "./config";
import { generateIndex, generateInitConfiguration } from "./generator";
import { populateIndex } from "./indexer";

async function main() {
  const start = performance.now();
  const argv = await yargs(hideBin(process.argv))
    .option("config", {
      alias: "c",
      type: "string",
      description: "Path to config file",
      default: resolveConfigPath() || "",
    })
    .option("cwd", {
      alias: "C",
      type: "string",
      description: "Current working directory",
      default: process.cwd(),
    })
    .option("init", {
      alias: "i",
      type: "boolean",
      description: "Create configuration",
    })
    .middleware((argv) => {
      if (argv.cwd) {
        process.chdir(argv.cwd);
      }

      argv.config = argv.config || resolveConfigPath() || "";
      const config = parseConfig(argv.config);
      config.indexes = config.indexes.map(populateIndex);
      argv.parsedConfig = config;
    })
    .help().argv;

  if (argv.init) {
    console.log(chalk.green("Creating configuration..."));
    await generateInitConfiguration();
    return;
  }

  console.log(chalk.green("Generating indexes..."));
  const { indexes } = argv.parsedConfig as ParsedConfig;
  await Promise.all(indexes.map((index) => generateIndex(index)));

  const diff = performance.now() - start;
  console.log(chalk.green("Done in %ds"), (diff / 1000).toFixed(2));
}

void main();
