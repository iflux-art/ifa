import { defineConfig } from "tsup";
import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

export default defineConfig((options) => ({
  entry: [
    "src/index.ts", 
    "src/components/client.ts",
    // 独立组件导出，支持按需导入
    "src/components/theme/theme-toggle.tsx",
    "src/components/ui/button/github-button.tsx",
    "src/components/ui/button/travel-button.tsx",
    "src/components/ui/footer.tsx",
    "src/components/ui/logo.tsx",
    "src/components/ui/layout/grid-layout.tsx",
    "src/components/ui/card/card.tsx",
    "src/components/ui/card/link-card.tsx",
    "src/components/ui/back-button.tsx",
    "src/components/twikoo-comment.tsx"
  ],
  format: ["esm"], // 只生成 ESM 格式
  target: "es2024", // 使用最新的 ECMAScript 2024 标准
  dts: !options.watch, // Skip DTS generation in watch mode for faster rebuilds
  splitting: false,
  sourcemap: true,
  clean: !options.watch, // Skip cleaning in watch mode for faster rebuilds
  external: [
    "react", 
    "react-dom", 
    "react/jsx-runtime",
    // 添加其他需要外部化的依赖
    "lucide-react",
    "next/link",
    "next-themes"
  ],
  // 移除 jsx: "transform" 配置，让 Next.js 和 React 19 自动处理 JSX 转换
  // jsx: "transform", // 使用 transform 模式处理 JSX
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
    
    // 为 client.js 添加 "use client" 指令
    const clientIndexPath = resolve(__dirname, "dist/components/client.js");
    try {
      let clientIndexContent = readFileSync(clientIndexPath, "utf-8");
      if (!clientIndexContent.startsWith('"use client";')) {
        clientIndexContent = '"use client";\n' + clientIndexContent;
        writeFileSync(clientIndexPath, clientIndexContent);
        console.log("✅ Added 'use client' directive to dist/components/client.js");
      }
    } catch (error) {
      // client.js 可能不存在，忽略错误
    }
    
    // 为其他需要 "use client" 指令的文件添加指令
    const filesToAddUseClient = [
      "dist/components/theme/theme-toggle.js",
      "dist/components/ui/button/github-button.js",
      "dist/components/ui/button/travel-button.js",
      "dist/components/ui/footer.js",
      "dist/components/ui/logo.js",
      "dist/components/ui/layout/grid-layout.js",
      "dist/components/ui/card/card.js",
      "dist/components/ui/card/link-card.js",
      "dist/components/ui/back-button.js",
      "dist/components/twikoo-comment.js"
    ];
    
    for (const file of filesToAddUseClient) {
      const filePath = resolve(__dirname, file);
      try {
        let fileContent = readFileSync(filePath, "utf-8");
        // 总是为这些文件添加 "use client" 指令，因为它们包含客户端组件
        if (!fileContent.startsWith('"use client";')) {
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