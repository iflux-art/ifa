#!/usr/bin/env node

/**
 * 更新包名称脚本
 *
 * 此脚本用于将所有 @repo/* 包重命名为 @iflux-art/* 包
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// 获取当前脚本的目录
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.join(__dirname, '..')

console.log('开始更新包名称...\n')

// 包名称映射
const packageMappings = {
  '@repo/ui': '@iflux-art/ui',
  '@repo/utils': '@iflux-art/utils',
  '@repo/tailwind-config': '@iflux-art/tailwind-config',
  '@repo/typescript-config': '@iflux-art/typescript-config',
  '@repo/biome-config': '@iflux-art/biome-config',
}

// 1. 更新 packages 目录下各包的名称
console.log('1. 更新 packages 目录下各包的 package.json...')

const packagesDir = path.join(projectRoot, 'packages')
const packages = fs
  .readdirSync(packagesDir)
  .filter(file => fs.statSync(path.join(packagesDir, file)).isDirectory())

for (const pkg of packages) {
  const packagePath = path.join(packagesDir, pkg)
  const packageJsonPath = path.join(packagePath, 'package.json')

  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))

    // 更新包名称
    const oldName = packageJson.name
    const newName = `@iflux-art/${pkg}`
    packageJson.name = newName

    // 更新版本号
    packageJson.version = '1.0.0'

    // 设置为公开包
    packageJson.private = false

    // 更新 README 文件名（如果存在）
    if (packageJson.files) {
      const readmeIndex = packageJson.files.indexOf('README.md')
      if (readmeIndex !== -1) {
        packageJson.files[readmeIndex] = 'README.npm.md'
      }
    }

    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2))
    console.log(`   ✓ ${oldName} → ${newName}`)
  }
}

// 2. 更新 apps 目录下各应用的依赖
console.log('\n2. 更新 apps 目录下各应用的依赖...')

const appsDir = path.join(projectRoot, 'apps')
const apps = fs
  .readdirSync(appsDir)
  .filter(file => fs.statSync(path.join(appsDir, file)).isDirectory())

for (const app of apps) {
  const appPath = path.join(appsDir, app)
  const appPackageJsonPath = path.join(appPath, 'package.json')

  if (fs.existsSync(appPackageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(appPackageJsonPath, 'utf8'))

    let updated = false

    // 更新 dependencies
    if (packageJson.dependencies) {
      for (const [oldName, newName] of Object.entries(packageMappings)) {
        if (packageJson.dependencies[oldName]) {
          const version = packageJson.dependencies[oldName]
          delete packageJson.dependencies[oldName]
          packageJson.dependencies[newName] = version
          updated = true
        }
      }
    }

    // 更新 devDependencies
    if (packageJson.devDependencies) {
      for (const [oldName, newName] of Object.entries(packageMappings)) {
        if (packageJson.devDependencies[oldName]) {
          const version = packageJson.devDependencies[oldName]
          delete packageJson.devDependencies[oldName]
          packageJson.devDependencies[newName] = version
          updated = true
        }
      }
    }

    if (updated) {
      fs.writeFileSync(appPackageJsonPath, JSON.stringify(packageJson, null, 2))
      console.log(`   ✓ 更新 ${app} 的依赖`)
    }
  }
}

// 3. 更新根目录 package.json 中的脚本
console.log('\n3. 更新根目录 package.json 中的脚本...')

const rootPackageJsonPath = path.join(projectRoot, 'package.json')
if (fs.existsSync(rootPackageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(rootPackageJsonPath, 'utf8'))

  // 更新脚本中的包过滤器
  if (packageJson.scripts) {
    for (const [scriptName, script] of Object.entries(packageJson.scripts)) {
      let updatedScript = script
      for (const [oldName, newName] of Object.entries(packageMappings)) {
        updatedScript = updatedScript.replace(
          new RegExp(oldName.replace('/', '\\/'), 'g'),
          newName
        )
      }

      if (updatedScript !== script) {
        packageJson.scripts[scriptName] = updatedScript
      }
    }

    fs.writeFileSync(rootPackageJsonPath, JSON.stringify(packageJson, null, 2))
    console.log('   ✓ 更新根目录脚本')
  }
}

// 4. 更新配置文件中的包引用
console.log('\n4. 更新配置文件中的包引用...')

const configFiles = ['tsconfig.json', 'turbo.json']

for (const configFile of configFiles) {
  const configPath = path.join(projectRoot, configFile)
  if (fs.existsSync(configPath)) {
    let content = fs.readFileSync(configPath, 'utf8')

    let updated = false
    for (const [oldName, newName] of Object.entries(packageMappings)) {
      if (content.includes(oldName)) {
        content = content.replace(
          new RegExp(oldName.replace('/', '\\/'), 'g'),
          newName
        )
        updated = true
      }
    }

    if (updated) {
      fs.writeFileSync(configPath, content)
      console.log(`   ✓ 更新 ${configFile} 中的包引用`)
    }
  }
}

// 5. 更新源代码中的导入语句
console.log('\n5. 更新源代码中的导入语句...')

function updateImportsInDirectory(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })

  for (const entry of entries) {
    const entryPath = path.join(dir, entry.name)

    if (entry.isDirectory()) {
      updateImportsInDirectory(entryPath)
    } else if (
      entry.isFile() &&
      (entry.name.endsWith('.ts') ||
        entry.name.endsWith('.tsx') ||
        entry.name.endsWith('.js') ||
        entry.name.endsWith('.jsx'))
    ) {
      let content = fs.readFileSync(entryPath, 'utf8')

      let updated = false
      for (const [oldName, newName] of Object.entries(packageMappings)) {
        if (content.includes(oldName)) {
          content = content.replace(
            new RegExp(oldName.replace('/', '\\/'), 'g'),
            newName
          )
          updated = true
        }
      }

      if (updated) {
        fs.writeFileSync(entryPath, content)
        console.log(
          `   ✓ 更新 ${path.relative(projectRoot, entryPath)} 中的导入语句`
        )
      }
    }
  }
}

// 更新 apps 和 packages 目录中的源代码
updateImportsInDirectory(appsDir)
updateImportsInDirectory(packagesDir)

console.log('\n包名称更新完成！')
console.log('\n接下来的步骤：')
console.log('1. 检查各包的 package.json 确保信息正确')
console.log('2. 运行 "pnpm build:packages" 构建所有包')
console.log('3. 登录 npm: "npm login"')
console.log('4. 运行发布脚本: "./publish-packages.sh"')
