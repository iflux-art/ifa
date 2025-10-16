#!/usr/bin/env node

/**
 * 应用结构标准验证脚本
 * 检查应用是否符合统一的结构标准
 */

import { readdir, stat, readFile, access } from 'fs/promises'
import { join, dirname } from 'path'
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

// 验证结果类型
class ValidationResult {
  constructor() {
    this.errors = []
    this.warnings = []
    this.info = []
    this.passed = []
  }

  addError(message) {
    this.errors.push(message)
  }

  addWarning(message) {
    this.warnings.push(message)
  }

  addInfo(message) {
    this.info.push(message)
  }

  addPassed(message) {
    this.passed.push(message)
  }

  get isValid() {
    return this.errors.length === 0
  }

  print() {
    console.log('\n' + colorize('='.repeat(60), 'cyan'))
    console.log(colorize('应用结构验证报告', 'cyan'))
    console.log(colorize('='.repeat(60), 'cyan'))

    if (this.passed.length > 0) {
      console.log('\n' + colorize('✅ 通过的检查:', 'green'))
      this.passed.forEach(msg => console.log(`  ${colorize('✓', 'green')} ${msg}`))
    }

    if (this.warnings.length > 0) {
      console.log('\n' + colorize('⚠️  警告:', 'yellow'))
      this.warnings.forEach(msg => console.log(`  ${colorize('⚠', 'yellow')} ${msg}`))
    }

    if (this.errors.length > 0) {
      console.log('\n' + colorize('❌ 错误:', 'red'))
      this.errors.forEach(msg => console.log(`  ${colorize('✗', 'red')} ${msg}`))
    }

    if (this.info.length > 0) {
      console.log('\n' + colorize('ℹ️  信息:', 'blue'))
      this.info.forEach(msg => console.log(`  ${colorize('ℹ', 'blue')} ${msg}`))
    }

    console.log('\n' + colorize('='.repeat(60), 'cyan'))
    
    const status = this.isValid ? 
      colorize('验证通过 ✅', 'green') : 
      colorize('验证失败 ❌', 'red')
    
    console.log(`状态: ${status}`)
    console.log(`错误: ${this.errors.length}, 警告: ${this.warnings.length}, 通过: ${this.passed.length}`)
    console.log(colorize('='.repeat(60), 'cyan'))
  }
}

// 标准目录结构定义
const REQUIRED_DIRECTORIES = [
  'src',
  'src/app',
  'src/components',
  'src/lib',
  'src/hooks',
  'src/stores',
  'src/types',
  'src/config',
  'src/test',
  'e2e',
  'public',
]

const OPTIONAL_DIRECTORIES = [
  'scripts',
  'docs',
  'src/content', // blog 应用特有
  'src/components/ui',
  'src/components/layout',
  'src/components/features',
  'src/components/theme',
  'src/lib/utils',
  'src/lib/api',
]

const REQUIRED_FILES = [
  'package.json',
  'next.config.mjs',
  'tsconfig.json',
  'biome.json',
  'vitest.config.ts',
  'playwright.config.ts',
  'tailwind.config.mjs',
  'postcss.config.mjs',
  '.env.example',
  'README.md',
  'src/app/layout.tsx',
  'src/app/page.tsx',
  'src/app/loading.tsx',
  'src/app/not-found.tsx',
  'src/app/globals.css',
  'src/components/index.ts',
  'src/lib/index.ts',
  'src/hooks/index.ts',
  'src/stores/index.ts',
  'src/types/index.ts',
  'src/config/index.ts',
  'src/middleware.ts',
]

const OPTIONAL_FILES = [
  'vercel.json',
  '.env.development',
  '.env.production',
  '.env.test',
  '.gitignore',
  'LICENSE',
  'components.json',
  'src/app/favicon.ico',
  'src/config/env.ts',
  'src/config/metadata.ts',
  'src/config/features.ts',
  'src/test/setup.ts',
  'src/types/config.ts',
  'src/types/css-modules.d.ts',
]

// 标准脚本定义
const REQUIRED_SCRIPTS = [
  'dev',
  'build',
  'start',
  'lint',
  'lint:fix',
  'format',
  'format:check',
  'check',
  'check:fix',
  'type-check',
  'test',
  'test:run',
  'test:e2e',
  'depcheck',
]

const OPTIONAL_SCRIPTS = [
  'clean',
  'preview',
  'test:coverage',
  'test:e2e:ui',
  'update-deps',
  'update-deps:latest',
  'env:load',
  'env:validate',
]

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

async function readJsonFile(filePath) {
  try {
    const content = await readFile(filePath, 'utf-8')
    return JSON.parse(content)
  } catch {
    return null
  }
}

// 验证器类
class AppStructureValidator {
  constructor(appPath) {
    this.appPath = appPath
    this.result = new ValidationResult()
  }

  async validate() {
    console.log(colorize(`正在验证应用: ${this.appPath}`, 'cyan'))
    
    await this.validateDirectoryStructure()
    await this.validateRequiredFiles()
    await this.validatePackageJson()
    await this.validateTsConfig()
    await this.validateIndexFiles()
    await this.validateNamingConventions()
    
    return this.result
  }

  async validateDirectoryStructure() {
    console.log('检查目录结构...')
    
    // 检查必需目录
    for (const dir of REQUIRED_DIRECTORIES) {
      const dirPath = join(this.appPath, dir)
      if (await isDirectory(dirPath)) {
        this.result.addPassed(`必需目录存在: ${dir}`)
      } else {
        this.result.addError(`缺少必需目录: ${dir}`)
      }
    }

    // 检查可选目录
    for (const dir of OPTIONAL_DIRECTORIES) {
      const dirPath = join(this.appPath, dir)
      if (await isDirectory(dirPath)) {
        this.result.addInfo(`可选目录存在: ${dir}`)
      }
    }
  }

  async validateRequiredFiles() {
    console.log('检查必需文件...')
    
    for (const file of REQUIRED_FILES) {
      const filePath = join(this.appPath, file)
      if (await fileExists(filePath)) {
        this.result.addPassed(`必需文件存在: ${file}`)
      } else {
        this.result.addError(`缺少必需文件: ${file}`)
      }
    }

    for (const file of OPTIONAL_FILES) {
      const filePath = join(this.appPath, file)
      if (await fileExists(filePath)) {
        this.result.addInfo(`可选文件存在: ${file}`)
      }
    }
  }

  async validatePackageJson() {
    console.log('检查 package.json...')
    
    const packageJsonPath = join(this.appPath, 'package.json')
    const packageJson = await readJsonFile(packageJsonPath)
    
    if (!packageJson) {
      this.result.addError('无法读取 package.json')
      return
    }

    // 检查基本字段
    const requiredFields = ['name', 'version', 'private', 'type', 'scripts', 'dependencies']
    for (const field of requiredFields) {
      if (packageJson[field]) {
        this.result.addPassed(`package.json 包含必需字段: ${field}`)
      } else {
        this.result.addError(`package.json 缺少必需字段: ${field}`)
      }
    }

    // 检查脚本
    const scripts = packageJson.scripts || {}
    for (const script of REQUIRED_SCRIPTS) {
      if (scripts[script]) {
        this.result.addPassed(`package.json 包含必需脚本: ${script}`)
      } else {
        this.result.addError(`package.json 缺少必需脚本: ${script}`)
      }
    }

    for (const script of OPTIONAL_SCRIPTS) {
      if (scripts[script]) {
        this.result.addInfo(`package.json 包含可选脚本: ${script}`)
      }
    }

    // 检查 type 字段
    if (packageJson.type === 'module') {
      this.result.addPassed('package.json 正确设置 type: "module"')
    } else {
      this.result.addWarning('建议在 package.json 中设置 type: "module"')
    }

    // 检查 engines 字段
    if (packageJson.engines) {
      this.result.addPassed('package.json 包含 engines 字段')
      if (packageJson.engines.node) {
        this.result.addInfo(`Node.js 版本要求: ${packageJson.engines.node}`)
      }
      if (packageJson.engines.pnpm) {
        this.result.addInfo(`pnpm 版本要求: ${packageJson.engines.pnpm}`)
      }
    } else {
      this.result.addWarning('建议在 package.json 中添加 engines 字段')
    }
  }

  async validateTsConfig() {
    console.log('检查 TypeScript 配置...')
    
    const tsconfigPath = join(this.appPath, 'tsconfig.json')
    const tsconfig = await readJsonFile(tsconfigPath)
    
    if (!tsconfig) {
      this.result.addError('无法读取 tsconfig.json')
      return
    }

    // 检查路径映射
    const paths = tsconfig.compilerOptions?.paths
    if (paths) {
      const expectedPaths = [
        '@/*',
        '@/components',
        '@/lib',
        '@/hooks',
        '@/stores',
        '@/types',
        '@/config',
        '@/app',
      ]

      for (const expectedPath of expectedPaths) {
        if (paths[expectedPath]) {
          this.result.addPassed(`tsconfig.json 包含路径映射: ${expectedPath}`)
        } else {
          this.result.addWarning(`建议在 tsconfig.json 中添加路径映射: ${expectedPath}`)
        }
      }
    } else {
      this.result.addWarning('建议在 tsconfig.json 中配置路径映射')
    }

    // 检查严格模式
    if (tsconfig.compilerOptions?.strict) {
      this.result.addPassed('TypeScript 启用严格模式')
    } else {
      this.result.addWarning('建议启用 TypeScript 严格模式')
    }
  }

  async validateIndexFiles() {
    console.log('检查 index.ts 导出文件...')
    
    const indexFiles = [
      'src/components/index.ts',
      'src/lib/index.ts',
      'src/hooks/index.ts',
      'src/stores/index.ts',
      'src/types/index.ts',
      'src/config/index.ts',
    ]

    for (const indexFile of indexFiles) {
      const filePath = join(this.appPath, indexFile)
      if (await fileExists(filePath)) {
        try {
          const content = await readFile(filePath, 'utf-8')
          if (content.includes('export')) {
            this.result.addPassed(`${indexFile} 包含导出语句`)
          } else {
            this.result.addWarning(`${indexFile} 存在但没有导出语句`)
          }
        } catch {
          this.result.addWarning(`无法读取 ${indexFile}`)
        }
      }
    }
  }

  async validateNamingConventions() {
    console.log('检查命名规范...')
    
    // 检查组件目录命名
    const componentsPath = join(this.appPath, 'src/components')
    if (await isDirectory(componentsPath)) {
      try {
        const items = await readdir(componentsPath)
        for (const item of items) {
          const itemPath = join(componentsPath, item)
          if (await isDirectory(itemPath)) {
            // 目录应该使用 kebab-case
            if (item.match(/^[a-z][a-z0-9]*(-[a-z0-9]+)*$/)) {
              this.result.addPassed(`组件目录命名规范: ${item}`)
            } else {
              this.result.addWarning(`组件目录建议使用 kebab-case: ${item}`)
            }
          } else if (item.endsWith('.tsx') || item.endsWith('.ts')) {
            // 组件文件应该使用 PascalCase 或 kebab-case
            if (item.match(/^[A-Z][a-zA-Z0-9]*\.(tsx?|js)$/) || 
                item.match(/^[a-z][a-z0-9]*(-[a-z0-9]+)*\.(tsx?|js)$/)) {
              this.result.addPassed(`组件文件命名规范: ${item}`)
            } else {
              this.result.addWarning(`组件文件命名建议: ${item}`)
            }
          }
        }
      } catch {
        this.result.addWarning('无法读取 components 目录')
      }
    }

    // 检查 lib 目录命名
    const libPath = join(this.appPath, 'src/lib')
    if (await isDirectory(libPath)) {
      try {
        const items = await readdir(libPath)
        for (const item of items) {
          const itemPath = join(libPath, item)
          if (await isDirectory(itemPath)) {
            if (item.match(/^[a-z][a-z0-9]*(-[a-z0-9]+)*$/)) {
              this.result.addPassed(`lib 目录命名规范: ${item}`)
            } else {
              this.result.addWarning(`lib 目录建议使用 kebab-case: ${item}`)
            }
          }
        }
      } catch {
        this.result.addWarning('无法读取 lib 目录')
      }
    }
  }
}

// 主函数
async function main() {
  const args = process.argv.slice(2)
  
  if (args.length === 0) {
    console.error(colorize('用法: node validate-app-structure.js <app-path>', 'red'))
    console.error('示例: node validate-app-structure.js ../web')
    process.exit(1)
  }

  const appPath = args[0]
  
  // 检查应用目录是否存在
  if (!(await isDirectory(appPath))) {
    console.error(colorize(`错误: 应用目录不存在: ${appPath}`, 'red'))
    process.exit(1)
  }

  try {
    const validator = new AppStructureValidator(appPath)
    const result = await validator.validate()
    
    result.print()
    
    // 根据验证结果设置退出码
    process.exit(result.isValid ? 0 : 1)
  } catch (error) {
    console.error(colorize(`验证过程中发生错误: ${error.message}`, 'red'))
    process.exit(1)
  }
}

// 如果直接运行此脚本
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error)
}

export { AppStructureValidator, ValidationResult }