import { defineConfig } from "tsup";
import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

export default defineConfig((options) => ({
  entry: [
    "src/index.ts", 
    "src/components/theme/theme-provider.tsx",
    "src/components/theme/theme-toggle.tsx",
    "src/components/ui/button/github-button.tsx",
    "src/components/ui/button/travel-button.tsx",
    "src/components/ui/button/user-button.tsx",
    "src/components/ui/footer.tsx",
    "src/components/ui/logo.tsx"
  ],
  format: ["esm"], // 只生成 ESM 格式
  target: "es2024", // 使用最新的 ECMAScript 2024 标准
  dts: !options.watch, // Skip DTS generation in watch mode for faster rebuilds
  splitting: false,
  sourcemap: true,
  clean: !options.watch, // Skip cleaning in watch mode for faster rebuilds
  external: ["react", "react-dom"],
  // 在构建完成后添加 "use client" 指令
  onSuccess: async () => {
    // 为 index.js 添加 "use client" 指令
    const indexPath = resolve(__dirname, "dist/index.js");
    let content = readFileSync(indexPath, "utf-8");
    if (!content.startsWith('"use client";')) {
      content = '"use client";\n' + content;
      writeFileSync(indexPath, content);
      console.log("✅ Added 'use client' directive to dist/index.js");
    }
    
    // 为 theme-provider.js 添加 "use client" 指令（如果需要）
    const themeProviderPath = resolve(__dirname, "dist/components/theme/theme-provider.js");
    try {
      let themeProviderContent = readFileSync(themeProviderPath, "utf-8");
      if (!themeProviderContent.startsWith('"use client";')) {
        themeProviderContent = '"use client";\n' + themeProviderContent;
        writeFileSync(themeProviderPath, themeProviderContent);
        console.log("✅ Added 'use client' directive to dist/components/theme/theme-provider.js");
      }
    } catch (error) {
      // theme-provider.js 可能不存在，忽略错误
    }
    
    // 为其他需要 "use client" 指令的文件添加指令
    const filesToAddUseClient = [
      "dist/components/theme/theme-toggle.js",
      "dist/components/ui/button/github-button.js",
      "dist/components/ui/button/travel-button.js",
      "dist/components/ui/footer.js",
      "dist/components/ui/logo.js"
    ];
    
    for (const file of filesToAddUseClient) {
      const filePath = resolve(__dirname, file);
      try {
        let fileContent = readFileSync(filePath, "utf-8");
        if (!fileContent.startsWith('"use client";') && fileContent.includes("use client")) {
          fileContent = '"use client";\n' + fileContent;
          writeFileSync(filePath, fileContent);
          console.log(`✅ Added 'use client' directive to ${file}`);
        }
      } catch (error) {
        // 文件可能不存在，忽略错误
      }
    }
  },
  // Development optimizations
  ...(options.watch && {
    // Enable faster incremental builds
    incremental: true,
  }),
  // Production optimizations
  ...(!options.watch && {
    minify: false, // Keep readable for debugging
    treeshake: true,
  }),
}));