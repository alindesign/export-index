import type { Options } from "tsup";

const tsup: Options = {
  bundle: true,
  clean: true,
  dts: false,
  entry: ["src/index.ts"],
  format: ["cjs"],
  minify: true,
  outDir: "dist",
  skipNodeModulesBundle: true,
  target: "node22",
  outExtension: () => ({ js: ".js" }),
};

export default tsup;
