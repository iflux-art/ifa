import { defineConfig } from "tsup";

export default defineConfig({
  entry: [
    "src/index.ts",
    "src/env.ts",
    "src/features.ts",
    "src/database.ts",
    "src/auth.ts",
    "src/api.ts",
    "src/validation.ts",
  ],
  format: ["esm"],
  dts: {
    resolve: true,
  },
  sourcemap: true,
  clean: true,
  treeshake: true,
  minify: false,
  target: "es2022",
  splitting: false,
  external: ["zod"],
  tsconfig: "./tsconfig.build.json",
});
