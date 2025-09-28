import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"], // 只生成 ESM 格式
  target: "esnext", // 使用最新的 ECMAScript 2024 标准
  dts: {
    resolve: true,
  },
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ["react", "react-dom"],
  tsconfig: "./tsconfig.json",
});