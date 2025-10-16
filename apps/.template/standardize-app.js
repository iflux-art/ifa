#!/usr/bin/env node

/**
 * 应用标准化脚本
 * 自动将现有应用迁移到统一的结构标准
 */

import { readdir, stat, readFile, writeFile, mkdir, copyFile, access } from 'fs/promises'
import { join, dirname, relative } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// 颜色输出工具
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
}

function colorize(text, color) {
  return `${colors[color]}${text}${colors.reset}`
}

// 标准化结果类
class StandardizationResult {
  constructor() {
    this.created = []
    this.updated = []
    this.warnings = []
    this.errors = []
  }

  addCreated(item) {
    this.created.push(item)
  }

  addUpdated(item) {
    this.updated.push(item)
  }

  addWarning(message) {
    this.warnings.push(message)
  }

  addError(message) {
    this.errors.push(message)
  }

  print() {
    console.log('\n' + colorize('='.repeat(60), 'cyan'))
    console.log(colorize('应用标准化报告', 'cyan'))
    console.log(colorize('='.repeat(60), 'cyan'))

    if (this.created.length > 0) {
      console.log('\n' + colorize('📁 创建的文件/目录:', 'green'))
      this.created.forEach(item => console.log(`  ${colorize('+', 'green')} ${item}`))
    }

    if (this.updated.length > 0) {
      console.log('\n' + colorize('📝 更新的文件:', 'blue'))
      this.updated.forEach(item => console.log(`  ${colorize('~', 'blue')} ${item}`))
    }

    if (this.warnings.length > 0) {
      console.log('\n' + colorize('⚠️  警告:', 'yellow'))
      this.warnings.forEach(msg => console.log(`  ${colorize('⚠', 'yellow')} ${msg}`))
    }

    if (this.errors.length > 0) {
      console.log('\n' + colorize('❌ 错误:', 'red'))
      this.errors.forEach(msg => console.log(`  ${colorize('✗', 'red')} ${msg}`))
    }

    console.log('\n' + colorize('='.repeat(60), 'cyan'))
    
    const status = this.errors.length === 0 ? 
      colorize('标准化完成 ✅', 'green') : 
      colorize('标准化部分完成 ⚠️', 'yellow')
    
    console.log(`状态: ${status}`)
    console.log(`创建: ${this.created.length}, 更新: ${this.updated.length}, 警告: ${this.warnings.length}, 错误: ${this.errors.length}`)
    console.log(colorize('='.repeat(60), 'cyan'))
  }
}

// 工具函数
async function fileExists(filePath) {
  try {
    await access(filePath)
    return true
  } catch {
    return false
  }
}

async function isDirectory(path) {
  try {
    const stats = await stat(path)
    return stats.isDirectory()
  } catch {
    return false
  }
}

async function ensureDirectory(dirPath) {
  try {
    await mkdir(dirPath, { recursive: true })
    return true
  } catch {
    return false
  }
}

async function readJsonFile(filePath) {
  try {
    const content = await readFile(filePath, 'utf-8')
    return JSON.parse(content)
  } catch {
    return null
  }
}

async function writeJsonFile(filePath, data) {
  try {
    await writeFile(filePath, JSON.stringify(data, null, 2) + '\n', 'utf-8')
    return true
  } catch {
    return false
  }
}

// 标准化器类
class AppStandardizer {
  constructor(appPath, templatePath) {
    this.appPath = appPath
    this.templatePath = templatePath
    this.result = new StandardizationResult()
  }

  async standardize(options = {}) {
    const { dryRun = false, force = false } = options
    
    console.log(colorize(`正在标准化应用: ${this.appPath}`, 'cyan'))
    if (dryRun) {
      console.log(colorize('(预览模式 - 不会实际修改文件)', 'yellow'))
    }
    
    await this.createDirectoryStructure(dryRun)
    await this.createMissingFiles(dryRun)
    await this.standardizePackageJson(dryRun, force)
    await this.createIndexFiles(dryRun)
    await this.updateTsConfig(dryRun)
    
    return this.result
  }

  async createDirectoryStructure(dryRun) {
    console.log('创建标准目录结构...')
    
    const requiredDirectories = [
      'src',
      'src/app',
      'src/components',
      'src/components/ui',
      'src/components/layout',
      'src/components/features',
      'src/components/theme',
      'src/lib',
      'src/lib/utils',
      'src/hooks',
      'src/stores',
      'src/types',
      'src/config',
      'src/test',
      'e2e',
      'public',
      'scripts',
    ]

    for (const dir of requiredDirectories) {
      const dirPath = join(this.appPath, dir)
      if (!(await isDirectory(dirPath))) {
        if (!dryRun) {
          if (await ensureDirectory(dirPath)) {
            this.result.addCreated(`目录: ${dir}`)
          } else {
            this.result.addError(`无法创建目录: ${dir}`)
          }
        } else {
          this.result.addCreated(`目录: ${dir} (预览)`)
        }
      }
    }
  }

  async createMissingFiles(dryRun) {
    console.log('创建缺失的标准文件...')
    
    const templateFiles = [
      { src: 'src/app/layout.tsx', required: true },
      { src: 'src/app/page.tsx', required: true },
      { src: 'src/app/loading.tsx', required: true },
      { src: 'src/app/not-found.tsx', required: true },
      { src: 'src/app/globals.css', required: true },
      { src: 'src/middleware.ts', required: true },
      { src: 'src/test/setup.ts', required: false },
      { src: 'vitest.config.ts', required: true },
      { src: 'playwright.config.ts', required: true },
      { src: 'next.config.mjs', required: true },
      { src: 'biome.json', required: true },
      { src: 'tailwind.config.mjs', required: true },
      { src: 'postcss.config.mjs', required: true },
      { src: '.env.example', required: true },
    ]

    for (const file of templateFiles) {
      const targetPath = join(this.appPath, file.src)
      const templateFilePath = join(this.templatePath, file.src)
      
      if (!(await fileExists(targetPath))) {
        if (await fileExists(templateFilePath)) {
          if (!dryRun) {
            try {
              await copyFile(templateFilePath, targetPath)
              this.result.addCreated(`文件: ${file.src}`)
            } catch (error) {
              this.result.addError(`无法复制文件 ${file.src}: ${error.message}`)
            }
          } else {
            this.result.addCreated(`文件: ${file.src} (预览)`)
          }
        } else if (file.required) {
          this.result.addWarning(`模板文件不存在: ${file.src}`)
        }
      }
    }
  }

  async standardizePackageJson(dryRun, force) {
    console.log('标准化 package.json...')
    
    const packageJsonPath = join(this.appPath, 'package.json')
    const templatePackageJsonPath = join(this.templatePath, 'package.json.template')
    
    const currentPackageJson = await readJsonFile(packageJsonPath)
    const templatePackageJson = await readJsonFile(templatePackageJsonPath)
    
    if (!currentPackageJson) {
      this.result.addError('无法读取当前 package.json')
      return
    }

    if (!templatePackageJson) {
      this.result.addWarning('无法读取模板 package.json')
      return
    }

    // 合并配置
    const updatedPackageJson = {
      ...currentPackageJson,
      type: 'module',
      engines: templatePackageJson.engines || currentPackageJson.engines,
      scripts: {
        ...currentPackageJson.scripts,
        ...templatePackageJson.scripts,
      },
    }

    // 更新 lint-staged 配置
    if (templatePackageJson['lint-staged']) {
      updatedPackageJson['lint-staged'] = templatePackageJson['lint-staged']
    }

    // 确保 sideEffects 设置
    if (templatePackageJson.sideEffects !== undefined) {
      updatedPackageJson.sideEffects = templatePackageJson.sideEffects
    }

    // 检查是否有变化
    const hasChanges = JSON.stringify(currentPackageJson) !== JSON.stringify(updatedPackageJson)
    
    if (hasChanges) {
      if (!dryRun) {
        if (await writeJsonFile(packageJsonPath, updatedPackageJson)) {
          this.result.addUpdated('package.json')
        } else {
          this.result.addError('无法更新 package.json')
        }
      } else {
        this.result.addUpdated('package.json (预览)')
      }
    }
  }

  async createIndexFiles(dryRun) {
    console.log('创建 index.ts 导出文件...')
    
    const indexFiles = [
      {
        path: 'src/components/index.ts',
        content: `// Export all components from this file for easier imports
export * from './ui'
export * from './layout'
export * from './features'
export * from './theme'
`
      },
      {
        path: 'src/lib/index.ts',
        content: `// Export all utilities from this file for easier imports
export * from './utils'
`
      },
      {
        path: 'src/hooks/index.ts',
        content: `// Export all hooks from this file for easier imports
// Add your custom hooks here
`
      },
      {
        path: 'src/stores/index.ts',
        content: `// Export all stores from this file for easier imports
// Add your Zustand stores here
`
      },
      {
        path: 'src/types/index.ts',
        content: `// Export all types from this file for easier imports
export * from './config'
`
      },
      {
        path: 'src/config/index.ts',
        content: `// Export all configuration from this file for easier imports
export * from './env'
export * from './metadata'
`
      },
    ]

    for (const indexFile of indexFiles) {
      const filePath = join(this.appPath, indexFile.path)
      
      if (!(await fileExists(filePath))) {
        if (!dryRun) {
          try {
            await writeFile(filePath, indexFile.content, 'utf-8')
            this.result.addCreated(`文件: ${indexFile.path}`)
          } catch (error) {
            this.result.addError(`无法创建文件 ${indexFile.path}: ${error.message}`)
          }
        } else {
          this.result.addCreated(`文件: ${indexFile.path} (预览)`)
        }
      }
    }
  }

  async updateTsConfig(dryRun) {
    console.log('更新 TypeScript 配置...')
    
    const tsconfigPath = join(this.appPath, 'tsconfig.json')
    const templateTsconfigPath = join(this.templatePath, 'tsconfig.json')
    
    const currentTsconfig = await readJsonFile(tsconfigPath)
    const templateTsconfig = await readJsonFile(templateTsconfigPath)
    
    if (!currentTsconfig) {
      this.result.addError('无法读取当前 tsconfig.json')
      return
    }

    if (!templateTsconfig) {
      this.result.addWarning('无法读取模板 tsconfig.json')
      return
    }

    // 合并路径映射
    const updatedTsconfig = {
      ...currentTsconfig,
      compilerOptions: {
        ...currentTsconfig.compilerOptions,
        paths: {
          ...currentTsconfig.compilerOptions?.paths,
          ...templateTsconfig.compilerOptions?.paths,
        },
      },
    }

    // 检查是否有变化
    const hasChanges = JSON.stringify(currentTsconfig) !== JSON.stringify(updatedTsconfig)
    
    if (hasChanges) {
      if (!dryRun) {
        if (await writeJsonFile(tsconfigPath, updatedTsconfig)) {
          this.result.addUpdated('tsconfig.json')
        } else {
          this.result.addError('无法更新 tsconfig.json')
        }
      } else {
        this.result.addUpdated('tsconfig.json (预览)')
      }
    }
  }
}

// 主函数
async function main() {
  const args = process.argv.slice(2)
  
  // 解析命令行参数
  const options = {
    dryRun: args.includes('--dry-run') || args.includes('-n'),
    force: args.includes('--force') || args.includes('-f'),
    help: args.includes('--help') || args.includes('-h'),
  }

  const appPaths = args.filter(arg => !arg.startsWith('-'))

  if (options.help || appPaths.length === 0) {
    console.log(colorize('应用标准化工具', 'cyan'))
    console.log('\n用法: node standardize-app.js [选项] <app-path> [app-path2] ...')
    console.log('\n选项:')
    console.log('  -n, --dry-run    预览模式，不实际修改文件')
    console.log('  -f, --force      强制覆盖现有文件')
    console.log('  -h, --help       显示帮助信息')
    console.log('\n示例:')
    console.log('  node standardize-app.js ../web')
    console.log('  node standardize-app.js --dry-run ../web ../blog')
    console.log('  node standardize-app.js --force ../hub')
    process.exit(0)
  }

  const templatePath = __dirname
  let hasErrors = false

  for (const appPath of appPaths) {
    // 检查应用目录是否存在
    if (!(await isDirectory(appPath))) {
      console.error(colorize(`错误: 应用目录不存在: ${appPath}`, 'red'))
      hasErrors = true
      continue
    }

    try {
      const standardizer = new AppStandardizer(appPath, templatePath)
      const result = await standardizer.standardize(options)
      
      result.print()
      
      if (result.errors.length > 0) {
        hasErrors = true
      }
    } catch (error) {
      console.error(colorize(`标准化过程中发生错误: ${error.message}`, 'red'))
      hasErrors = true
    }

    // 如果处理多个应用，添加分隔符
    if (appPaths.length > 1 && appPath !== appPaths[appPaths.length - 1]) {
      console.log('\n' + colorize('-'.repeat(60), 'gray'))
    }
  }

  // 根据结果设置退出码
  process.exit(hasErrors ? 1 : 0)
}

// 如果直接运行此脚本
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error)
}

export { AppStandardizer, StandardizationResult }