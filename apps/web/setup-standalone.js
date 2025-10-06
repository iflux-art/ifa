#!/usr/bin/env node

// This script sets up the standalone deployment environment for the web application.
// It copies necessary files from the monorepo root to make the app independently deployable.

import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { join, resolve } from "path";

const rootDir = resolve(process.cwd(), "../..");
const appDir = resolve(process.cwd());

console.log("Setting up standalone deployment environment...");
console.log("   - Root Directory: apps/web");
console.log("   - Monorepo Root:", rootDir);

// Create necessary directories
const dirsToCreate = [".github/workflows", ".husky"];
dirsToCreate.forEach((dir) => {
  const fullPath = join(appDir, dir);
  if (!existsSync(fullPath)) {
    mkdirSync(fullPath, { recursive: true });
    console.log(`   ✓ Created directory: ${dir}`);
  }
});

// Copy files from monorepo root
const filesToCopy = [
  // Config files
  "biome.json",
  "LICENSE",
  "README.md",
  
  // GitHub Actions
  ".github/workflows/ci.yml",
  
  // Husky git hooks
  ".husky/pre-commit",
  
  // Ignore files
  ".gitignore",
];

filesToCopy.forEach((file) => {
  const srcPath = join(rootDir, file);
  const destPath = join(appDir, file);
  
  if (existsSync(srcPath)) {
    // Ensure destination directory exists
    const destDir = destPath.substring(0, destPath.lastIndexOf("/"));
    if (destDir && !existsSync(destDir)) {
      mkdirSync(destDir, { recursive: true });
    }
    
    copyFileSync(srcPath, destPath);
    console.log(`   ✓ Copied: ${file}`);
  } else {
    console.log(`   ! Skipped (not found): ${file}`);
  }
});

// Update package.json to remove workspace references
const packageJsonPath = join(appDir, "package.json");
if (existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"));
  
  // Remove workspace dependencies
  if (packageJson.dependencies) {
    Object.keys(packageJson.dependencies).forEach((dep) => {
      if (packageJson.dependencies[dep].startsWith("workspace:")) {
        delete packageJson.dependencies[dep];
        console.log(`   ✓ Removed workspace dependency: ${dep}`);
      }
    });
  }
  
  // Update scripts to remove turbo commands
  if (packageJson.scripts) {
    Object.keys(packageJson.scripts).forEach((script) => {
      if (packageJson.scripts[script].includes("turbo")) {
        packageJson.scripts[script] = packageJson.scripts[script].replace(/turbo run /g, "");
        console.log(`   ✓ Updated script: ${script}`);
      }
    });
  }
  
  writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  console.log("   ✓ Updated package.json");
}

console.log("\n✓ Standalone deployment environment setup complete!");
console.log("\nNext steps:");
console.log("1. Review the copied files and make any necessary adjustments");
console.log("2. Run 'pnpm install' to install dependencies");
console.log("3. Run 'pnpm build' to build the application");
console.log("4. Run 'pnpm start' to start the production server");