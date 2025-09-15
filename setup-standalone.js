#!/usr/bin/env node

/**
 * 根目录独立部署设置脚本
 *
 * 此脚本用于为所有应用设置独立部署环境
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { spawn } from 'child_process'

// 获取当前脚本的目录
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

console.log('设置所有应用的独立部署环境...\n')

// 获取 apps 目录下的所有应用
const appsDir = path.join(__dirname, 'apps')
const apps = fs
  .readdirSync(appsDir)
  .filter(file => fs.statSync(path.join(appsDir, file)).isDirectory())

console.log(`发现 ${apps.length} 个应用: ${apps.join(', ')}\n`)

// 为每个应用运行独立部署设置脚本
for (const app of apps) {
  console.log(`处理应用: ${app}`)

  const appPath = path.join(appsDir, app)
  const setupScriptPath = path.join(appPath, 'setup-standalone.js')

  // 检查应用是否有独立部署脚本
  if (fs.existsSync(setupScriptPath)) {
    console.log(`  运行 ${app} 的独立部署脚本...`)

    try {
      // 运行应用的独立部署脚本
      const setupProcess = spawn('node', ['setup-standalone.js'], {
        cwd: appPath,
        stdio: 'inherit',
      })

      // 等待脚本执行完成
      await new Promise((resolve, reject) => {
        setupProcess.on('close', code => {
          if (code === 0) {
            console.log(`  ✓ ${app} 独立部署设置完成\n`)
            resolve()
          } else {
            console.log(`  ✗ ${app} 独立部署设置失败\n`)
            reject(new Error(`Setup script failed with code ${code}`))
          }
        })
      })
    } catch (error) {
      console.log(`  ✗ 运行 ${app} 的独立部署脚本时出错: ${error.message}\n`)
    }
  } else {
    console.log(`  ! ${app} 没有独立部署脚本，跳过...\n`)
  }
}

console.log('所有应用的独立部署环境设置完成！')
console.log('\n接下来的步骤：')
console.log('1. 进入特定应用目录')
console.log('2. 运行 "pnpm install" 安装依赖')
console.log('3. 运行 "pnpm dev" 开始开发')
console.log('\n注意：确保 @iflux-art/* 包已发布到 npm')
