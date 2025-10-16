import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  dts: {
    resolve: true,
  },
  clean: true,
  splitting: false,
  sourcemap: true,
  tsconfig: "./tsconfig.build.json",
});
