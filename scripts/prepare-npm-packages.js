#!/usr/bin/env node

/**
 * 准备 npm 包发布脚本
 *
 * 此脚本用于将 monorepo 中的共享包重命名为 @iflux-art/* 格式，
 * 并生成可以独立发布的包配置。
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// 获取当前脚本的目录
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.join(__dirname, '..')
const packagesDir = path.join(projectRoot, 'packages')

console.log('开始准备 npm 包发布...\n')

// 需要重命名的包映射
const packageMappings = {
  '@repo/ui': '@iflux-art/ui',
  '@repo/utils': '@iflux-art/utils',
}

// 1. 更新 packages 目录下各个包的 package.json
console.log('1. 更新各包的 package.json...')

for (const [oldName, newName] of Object.entries(packageMappings)) {
  const packageName = oldName.replace('@repo/', '')
  const packagePath = path.join(packagesDir, packageName)
  const packageJsonPath = path.join(packagePath, 'package.json')

  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))

    // 更新包名称
    packageJson.name = newName

    // 更新版本号为 1.0.0
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

console.log('\n2. 更新应用中的依赖引用...')

// 2. 更新 apps 目录下各应用的 package.json
const appsDir = path.join(projectRoot, 'apps')
const apps = fs
  .readdirSync(appsDir)
  .filter(file => fs.statSync(path.join(appsDir, file)).isDirectory())

for (const app of apps) {
  const appPath = path.join(appsDir, app)
  const appPackageJsonPath = path.join(appPath, 'package.json')

  if (fs.existsSync(appPackageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(appPackageJsonPath, 'utf8'))

    // 更新 dependencies
    if (packageJson.dependencies) {
      for (const [oldName, newName] of Object.entries(packageMappings)) {
        if (packageJson.dependencies[oldName]) {
          const version = packageJson.dependencies[oldName]
          delete packageJson.dependencies[oldName]
          packageJson.dependencies[newName] = version
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
        }
      }
    }

    fs.writeFileSync(appPackageJsonPath, JSON.stringify(packageJson, null, 2))
    console.log(`   ✓ 更新 ${app} 的依赖引用`)
  }
}

console.log('\n3. 更新配置文件中的包引用...')

// 3. 更新其他配置文件中的包引用
const configFiles = [
  path.join(projectRoot, 'tsconfig.json'),
  path.join(projectRoot, 'turbo.json'),
]

for (const configFile of configFiles) {
  if (fs.existsSync(configFile)) {
    let content = fs.readFileSync(configFile, 'utf8')

    for (const [oldName, newName] of Object.entries(packageMappings)) {
      content = content.replace(
        new RegExp(oldName.replace('/', '\\/'), 'g'),
        newName
      )
    }

    fs.writeFileSync(configFile, content)
    console.log(`   ✓ 更新 ${path.basename(configFile)} 中的包引用`)
  }
}

console.log('\n4. 创建 npm 发布说明...')

// 4. 创建 npm 发布说明
const npmReadmeContent = `# @iflux-art Packages

This repository contains the following npm packages:

## Packages

${Object.entries(packageMappings)
  .map(
    ([oldName, newName]) =>
      `- [${newName}](./packages/${oldName.replace('@repo/', '')})`
  )
  .join('\n')}

## Installation

To install any of these packages, use npm or yarn:

\`\`\`bash
npm install @iflux-art/ui
# or
yarn add @iflux-art/ui
\`\`\`

## Usage

Each package can be used independently in your projects. For example:

\`\`\`javascript
import { Button } from '@iflux-art/ui';
import { cn } from '@iflux-art/utils';
\`\`\`

## Independent Deployment

With these packages published to npm, you can now easily deploy any app from the monorepo independently by simply installing the required packages instead of copying code manually.

For more information about independent deployment, see [INDEPENDENT_DEPLOYMENT.md](./INDEPENDENT_DEPLOYMENT.md).
`

const npmReadmePath = path.join(projectRoot, 'README.npm.md')
fs.writeFileSync(npmReadmePath, npmReadmeContent)
console.log('   ✓ 创建 README.npm.md')

console.log('\n5. 创建发布脚本...')

// 5. 创建发布脚本
const publishScriptContent = `#!/usr/bin/env bash

# npm 包发布脚本
# 运行此脚本前请确保已登录 npm

echo "开始发布 @iflux-art 包..."

# 构建所有包
echo "构建所有包..."
pnpm run build:packages

# 发布各包
cd packages/ui
echo "发布 @iflux-art/ui..."
npm publish

cd ../utils
echo "发布 @iflux-art/utils..."
npm publish

echo "所有包发布完成！"
`

const publishScriptPath = path.join(projectRoot, 'publish-packages.sh')
fs.writeFileSync(publishScriptPath, publishScriptContent)
fs.chmodSync(publishScriptPath, 0o755)
console.log('   ✓ 创建 publish-packages.sh')

console.log('\nnpm 包准备完成！')
console.log('\n接下来的步骤：')
console.log('1. 检查各包的 package.json 确保信息正确')
console.log('2. 运行 "pnpm build:packages" 构建所有包')
console.log('3. 登录 npm: "npm login"')
console.log('4. 运行发布脚本: "./publish-packages.sh"')
console.log('\n发布后，应用可以独立部署而无需复制代码！')