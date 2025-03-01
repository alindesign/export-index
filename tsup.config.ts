import type { Options } from "tsup";

const tsup: Options = {
  bundle: false,
  clean: true,
  dts: true,
  entry: ["src/**/*.ts"],
  format: ["cjs", "esm"],
  minify: false,
  outDir: "dist",
  skipNodeModulesBundle: true,
  sourcemap: true,
  splitting: true,
  target: "node22",
  keepNames: true,
};

export default tsup;
