#!/usr/bin/env node

/**
 * 独立部署设置脚本
 *
 * 用户下载应用后运行此脚本，自动设置独立部署环境
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

// 获取当前脚本的目录
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

console.log('设置独立部署环境...\n')

// 1. 检查是否存在独立部署版本的 package.json
const standalonePackagePath = path.join(
  __dirname,
  'package.standalone.final.json'
)
const regularPackagePath = path.join(__dirname, 'package.json')

if (fs.existsSync(standalonePackagePath)) {
  console.log('1. 使用独立部署版本的 package.json...')
  // 备份原始 package.json
  if (fs.existsSync(regularPackagePath)) {
    fs.copyFileSync(
      regularPackagePath,
      path.join(__dirname, 'package.json.backup')
    )
    console.log('   ✓ 备份原始 package.json')
  }

  // 替换为独立部署版本
  fs.copyFileSync(standalonePackagePath, regularPackagePath)
  console.log('   ✓ 替换为独立部署版本的 package.json\n')
} else {
  console.log('1. 未找到独立部署版本的 package.json，跳过...\n')
}

console.log('2. 更新配置文件...')

// 更新 next.config.js
const nextConfigPath = path.join(__dirname, 'next.config.js')
if (fs.existsSync(nextConfigPath)) {
  let nextConfigContent = fs.readFileSync(nextConfigPath, 'utf8')

  // 移除 transpilePackages 中的 workspace 包
  nextConfigContent = nextConfigContent.replace(
    /transpilePackages: \[(.*?)\]/gs,
    (_match, packages) => {
      const packageList = packages
        .split(',')
        .map(p => p.trim())
        .filter(p => !p.includes('@repo/'))
        .join(', ')
      // 如果还有包需要 transpile，则保留配置
      if (packageList.trim()) {
        return `transpilePackages: [${packageList}]`
      }
      // 如果没有包需要 transpile，则移除整个配置项
      return '// transpilePackages: []'
    }
  )

  // 移除 optimizePackageImports 中的 workspace 包
  nextConfigContent = nextConfigContent.replace(
    /optimizePackageImports: \[(.*?)\]/gs,
    (_match, packages) => {
      const packageList = packages
        .split(',')
        .map(p => p.trim())
        .filter(p => !p.includes('@repo/'))
        .join(', ')
      // 如果还有包需要 optimize，则保留配置
      if (packageList.trim()) {
        return `optimizePackageImports: [${packageList}]`
      }
      // 如果没有包需要 optimize，则移除整个配置项
      return '// optimizePackageImports: []'
    }
  )

  fs.writeFileSync(nextConfigPath, nextConfigContent)
  console.log('   ✓ 更新 next.config.js')
}

// 更新 tsconfig.json
const tsconfigPath = path.join(__dirname, 'tsconfig.json')
if (fs.existsSync(tsconfigPath)) {
  let tsconfigContent = fs.readFileSync(tsconfigPath, 'utf8')

  // 移除对 @repo/typescript-config 的继承
  tsconfigContent = tsconfigContent.replace(
    /"extends": "@repo\/typescript-config\/nextjs.json",?\n?/,
    ''
  )

  fs.writeFileSync(tsconfigPath, tsconfigContent)
  console.log('   ✓ 更新 tsconfig.json')
}

console.log('\n3. 清理缓存...')
// 删除 .next 目录（如果存在）
const nextDir = path.join(__dirname, '.next')
if (fs.existsSync(nextDir)) {
  fs.rmSync(nextDir, { recursive: true, force: true })
  console.log('   ✓ 清理 .next 目录')
}

// 删除 node_modules/.cache 目录（如果存在）
const cacheDir = path.join(__dirname, 'node_modules', '.cache')
if (fs.existsSync(cacheDir)) {
  fs.rmSync(cacheDir, { recursive: true, force: true })
  console.log('   ✓ 清理 node_modules/.cache 目录')
}

console.log('\n独立部署环境设置完成！')
console.log('\n接下来的步骤：')
console.log('1. 运行 "pnpm install" 安装依赖')
console.log('2. 运行 "pnpm dev" 开始开发')
console.log('3. 运行 "pnpm build" 构建应用')
console.log('4. 运行 "pnpm start" 启动生产服务器')
console.log('\n注意：确保 @iflux-art/* 包已发布到 npm')
