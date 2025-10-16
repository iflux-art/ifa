import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/components/index.ts", "src/hooks/index.ts"],
  format: ["esm"],
  dts: {
    resolve: true,
  },
  sourcemap: true,
  clean: true,
  external: ["react", "react-dom"],
  treeshake: true,
  splitting: true,
  minify: false,
  target: "es2022",
  tsconfig: "./tsconfig.build.json",
});
