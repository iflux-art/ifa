import { defineConfig } from "tsup";

export default defineConfig({
  entry: [
    "src/index.ts",
    "src/api.ts",
    "src/config.ts",
    "src/ui.ts",
    "src/auth.ts",
    "src/database.ts",
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
  external: ["react"],
  tsconfig: "./tsconfig.build.json",
});
