#!/usr/bin/env node

/**
 * 根目录独立部署信息脚本
 *
 * 此脚本用于显示所有应用的独立部署信息
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// 获取当前脚本的目录
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("所有应用均已完全独立，无需运行任何脚本即可直接部署到 Vercel\n");

// 获取 apps 目录下的所有应用
const appsDir = path.join(__dirname, "apps");
const apps = fs
  .readdirSync(appsDir)
  .filter((file) => fs.statSync(path.join(appsDir, file)).isDirectory());

console.log(`发现 ${apps.length} 个完全独立的应用: ${apps.join(", ")}\n`);

console.log("部署说明：");
console.log("1. 所有应用都不依赖任何 workspace 包，可直接部署");
console.log("2. 确保各应用 package.json 中的依赖版本与 Vercel 环境兼容");
console.log("3. 可直接推送到 GitHub 并在 Vercel 上部署");

console.log("\nVercel 部署步骤：");
console.log("1. 登录 Vercel 控制台");
console.log("2. 点击 'Add New Project'");
console.log("3. 选择你的 GitHub 仓库");
console.log("4. 在项目设置中选择对应的应用目录：");
for (const app of apps) {
  console.log(`   - ${app}: apps/${app}`);
}
console.log("5. 设置构建命令: next build");
console.log("6. 设置输出目录: .next");
console.log("7. 点击 'Deploy'");
