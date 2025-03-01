import path from "node:path";
import * as fs from "node:fs";
import ts from "typescript";

export const fileName = ".indexrc";

export type IndexFeature = "module";

export interface IndexConfig {
  language?: "typescript";
  features?: IndexFeature[];
  exportFormat?: "all";
}

export interface Index extends IndexConfig {
  dir: string;
}

export interface IndexedFile extends IndexConfig {
  relativePath: string;
  source: string;
  exports: Record<string, ts.Node>;
}

export interface ParsedIndex extends Index {
  files: IndexedFile[];
}

export interface Config extends IndexConfig {
  indexes: Index[];
}

export type ParsedConfig = Omit<Config, "indexes"> & { indexes: ParsedIndex[] };

export function resolveConfigPath() {
  let cwd = process.cwd();
  while (cwd !== "/") {
    const configPath = `${cwd}/${fileName}`;
    if (fs.existsSync(configPath)) {
      return configPath;
    }
    cwd = path.dirname(cwd);
  }

  return null;
}

export function parseConfig(filename: string): Config {
  if (!filename || !fs.existsSync(filename)) {
    return {
      indexes: [],
    };
  }

  const { indexes, ...sharedConfig } = JSON.parse(
    fs.readFileSync(filename, "utf-8"),
  );

  return {
    ...sharedConfig,
    indexes: indexes.map((index: Index) => {
      const item = { ...sharedConfig, ...index };

      item.dir = path.resolve(process.cwd(), item.dir);

      return item;
    }),
  };
}

export const IndexFiles: Record<
  Exclude<IndexConfig["language"], undefined>,
  string
> = {
  typescript: "index.ts",
};
