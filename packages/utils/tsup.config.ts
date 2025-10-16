import { defineConfig } from "tsup";

export default defineConfig({
  entry: [
    "src/index.ts",
    "src/cn.ts",
    "src/array.ts",
    "src/function.ts",
    "src/date.ts",
    "src/object.ts",
    "src/string.ts",
    "src/validation.ts",
    "src/error.ts",
    "src/async.ts",
    "src/types.ts",
  ],
  format: ["esm"],
  dts: {
    resolve: true,
  },
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ["react", "react-dom"],
  tsconfig: "./tsconfig.build.json",
  treeshake: true,
  minify: false,
  target: "es2022",
});
