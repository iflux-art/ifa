#!/usr/bin/env node

/**
 * 独立部署设置脚本
 *
 * 此脚本为Web应用程序设置独立部署环境。
 * 它将必要的文件从monorepo根目录复制过来，使应用程序可以独立部署。
 */

import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const rootDir = resolve(process.cwd(), "../..");
const appDir = resolve(process.cwd());

console.log("正在设置独立部署环境...");
console.log("   - 根目录: apps/web");
console.log("   - Monorepo根目录:", rootDir);

// 创建必要的目录
const dirsToCreate = [".github/workflows", ".husky"];
dirsToCreate.forEach((dir) => {
  const fullPath = join(appDir, dir);
  if (!existsSync(fullPath)) {
    mkdirSync(fullPath, { recursive: true });
    console.log(`   ✓ 已创建目录: ${dir}`);
  }
});

// 从monorepo根目录复制文件
const filesToCopy = [
  // 配置文件
  "biome.json",
  "LICENSE",
  "README.md",

  // GitHub Actions
  ".github/workflows/ci.yml",

  // Husky git hooks
  ".husky/pre-commit",

  // 忽略文件
  ".gitignore",
];

filesToCopy.forEach((file) => {
  const srcPath = join(rootDir, file);
  const destPath = join(appDir, file);

  if (existsSync(srcPath)) {
    // 确保目标目录存在
    const destDir = destPath.substring(0, destPath.lastIndexOf("/"));
    if (destDir && !existsSync(destDir)) {
      mkdirSync(destDir, { recursive: true });
    }

    copyFileSync(srcPath, destPath);
    console.log(`   ✓ 已复制: ${file}`);
  } else {
    console.log(`   ! 跳过 (未找到): ${file}`);
  }
});

// 更新package.json以移除workspace引用
const packageJsonPath = join(appDir, "package.json");
if (existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"));

  // 移除workspace依赖
  if (packageJson.dependencies) {
    Object.keys(packageJson.dependencies).forEach((dep) => {
      if (packageJson.dependencies[dep].startsWith("workspace:")) {
        delete packageJson.dependencies[dep];
        console.log(`   ✓ 已移除workspace依赖: ${dep}`);
      }
    });
  }

  // 更新脚本以移除turbo命令
  if (packageJson.scripts) {
    Object.keys(packageJson.scripts).forEach((script) => {
      if (packageJson.scripts[script].includes("turbo")) {
        packageJson.scripts[script] = packageJson.scripts[script].replace(/turbo run /g, "");
        console.log(`   ✓ 已更新脚本: ${script}`);
      }
    });
  }

  writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  console.log("   ✓ 已更新 package.json");
}

console.log("\n✓ 独立部署环境设置完成!");
console.log("\n下一步:");
console.log("1. 检查复制的文件并进行必要的调整");
console.log("2. 运行 'pnpm install' 安装依赖");
console.log("3. 运行 'pnpm build' 构建应用程序");
console.log("4. 运行 'pnpm start' 启动生产服务器");
