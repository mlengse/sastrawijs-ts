import babel from "@rollup/plugin-babel";
import json from "@rollup/plugin-json";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";
import { readFileSync } from "fs";

const pkg = JSON.parse(readFileSync("./package.json", "utf8"));

export default {
  input: "src/index.ts",
  output: [
    {
      file: pkg.browser,
      format: "umd",
      name: pkg.name,
    },
    {
      file: pkg.main,
      format: "cjs",
    },
    {
      file: pkg.module,
      format: "es",
    },
  ],
  plugins: [
    json(),
    babel({ babelHelpers: "bundled" }),
    terser(),
    typescript({ tsconfig: "./tsconfig.json" }),
  ],
};
