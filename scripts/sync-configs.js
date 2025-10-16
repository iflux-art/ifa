#!/usr/bin/env node

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { execSync } from 'node:child_process'

/**
 * Configuration Synchronization Tool
 * 
 * This tool synchronizes configuration files from the .template directory
 * to individual applications, supporting variable substitution and app-specific
 * customizations while preserving existing app-specific configurations.
 */

const TEMPLATE_DIR = resolve(process.cwd(), 'apps/.template')
const APPS_DIR = resolve(process.cwd(), 'apps')
const CONFIG_FILE = resolve(TEMPLATE_DIR, 'template-config.json')

// Configuration files to sync
const CONFIG_FILES = [
  'package.json',
  'tsconfig.json',
  'biome.json',
  'next.config.mjs',
  'tailwind.config.mjs',
  'vitest.config.ts',
  'playwright.config.ts',
  'postcss.config.mjs',
  '.env.example'
]

// Script files to sync
const SCRIPT_FILES = [
  'scripts/load-env.js',
  'scripts/check-project.js'
]

// Test setup files to sync
const TEST_FILES = [
  'src/test/setup.ts'
]

class ConfigSynchronizer {
  constructor() {
    this.templateConfig = this.loadTemplateConfig()
    this.apps = this.discoverApps()
  }

  loadTemplateConfig() {
    try {
      const configContent = readFileSync(CONFIG_FILE, 'utf8')
      return JSON.parse(configContent)
    } catch (error) {
      console.error('❌ Failed to load template configuration:', error.message)
      process.exit(1)
    }
  }

  discoverApps() {
    try {
      const apps = Object.keys(this.templateConfig.appSpecificConfigs)
      console.log(`🔍 Discovered apps: ${apps.join(', ')}`)
      return apps
    } catch (error) {
      console.error('❌ Failed to discover apps:', error.message)
      process.exit(1)
    }
  }

  substituteVariables(content, appName) {
    const appConfig = this.templateConfig.appSpecificConfigs[appName]
    if (!appConfig) {
      throw new Error(`No configuration found for app: ${appName}`)
    }

    let result = content

    // Substitute template variables
    Object.entries(this.templateConfig.templateVariables).forEach(([variable, config]) => {
      const value = appConfig[variable.replace(/[{}]/g, '')] || config.default || ''
      result = result.replace(new RegExp(variable.replace(/[{}]/g, '\\{\\}'), 'g'), value)
    })

    return result
  }

  mergePackageJson(templateContent, appName, existingPath) {
    const appConfig = this.templateConfig.appSpecificConfigs[appName]
    const template = JSON.parse(templateContent)
    
    // Load existing package.json if it exists
    let existing = {}
    if (existsSync(existingPath)) {
      try {
        existing = JSON.parse(readFileSync(existingPath, 'utf8'))
      } catch (error) {
        console.warn(`⚠️  Could not parse existing package.json for ${appName}:`, error.message)
      }
    }

    // Merge configurations
    const merged = {
      ...template,
      ...existing, // Preserve existing top-level properties
      scripts: {
        ...template.scripts,
        ...existing.scripts, // Preserve existing scripts
        ...(appConfig.additionalScripts || {}) // Add app-specific scripts
      },
      dependencies: {
        ...template.dependencies,
        ...(appConfig.additionalDependencies || {}),
        ...existing.dependencies // Preserve existing dependencies
      },
      devDependencies: {
        ...template.devDependencies,
        ...(appConfig.additionalDevDependencies || {}),
        ...existing.devDependencies // Preserve existing dev dependencies
      }
    }

    // Sort dependencies alphabetically
    if (merged.dependencies) {
      const sortedDeps = {}
      Object.keys(merged.dependencies).sort().forEach(key => {
        sortedDeps[key] = merged.dependencies[key]
      })
      merged.dependencies = sortedDeps
    }

    if (merged.devDependencies) {
      const sortedDevDeps = {}
      Object.keys(merged.devDependencies).sort().forEach(key => {
        sortedDevDeps[key] = merged.devDependencies[key]
      })
      merged.devDependencies = sortedDevDeps
    }

    return JSON.stringify(merged, null, 2)
  }

  syncConfigFile(fileName, appName) {
    const templatePath = resolve(TEMPLATE_DIR, fileName === 'package.json' ? 'package.json.template' : fileName)
    const appDir = resolve(APPS_DIR, appName)
    const targetPath = resolve(appDir, fileName)

    if (!existsSync(templatePath)) {
      console.warn(`⚠️  Template file not found: ${fileName}`)
      return false
    }

    try {
      let content = readFileSync(templatePath, 'utf8')
      
      // Substitute variables
      content = this.substituteVariables(content, appName)

      // Special handling for package.json
      if (fileName === 'package.json') {
        content = this.mergePackageJson(content, appName, targetPath)
      }

      // Ensure target directory exists
      const targetDir = dirname(targetPath)
      if (!existsSync(targetDir)) {
        mkdirSync(targetDir, { recursive: true })
      }

      // Write the file
      writeFileSync(targetPath, content, 'utf8')
      console.log(`✅ Synced ${fileName} for ${appName}`)
      return true
    } catch (error) {
      console.error(`❌ Failed to sync ${fileName} for ${appName}:`, error.message)
      return false
    }
  }

  syncScriptFile(filePath, appName) {
    const templatePath = resolve(TEMPLATE_DIR, filePath)
    const appDir = resolve(APPS_DIR, appName)
    const targetPath = resolve(appDir, filePath)

    if (!existsSync(templatePath)) {
      console.warn(`⚠️  Template script not found: ${filePath}`)
      return false
    }

    try {
      let content = readFileSync(templatePath, 'utf8')
      
      // Substitute variables if needed
      content = this.substituteVariables(content, appName)

      // Ensure target directory exists
      const targetDir = dirname(targetPath)
      if (!existsSync(targetDir)) {
        mkdirSync(targetDir, { recursive: true })
      }

      // Write the file
      writeFileSync(targetPath, content, 'utf8')
      console.log(`✅ Synced script ${filePath} for ${appName}`)
      return true
    } catch (error) {
      console.error(`❌ Failed to sync script ${filePath} for ${appName}:`, error.message)
      return false
    }
  }

  validateConfiguration(appName) {
    const appDir = resolve(APPS_DIR, appName)
    const packageJsonPath = resolve(appDir, 'package.json')

    if (!existsSync(packageJsonPath)) {
      console.error(`❌ package.json not found for ${appName}`)
      return false
    }

    try {
      const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'))
      
      // Validate required scripts
      const requiredScripts = ['dev', 'build', 'start', 'lint', 'type-check']
      const missingScripts = requiredScripts.filter(script => !packageJson.scripts?.[script])
      
      if (missingScripts.length > 0) {
        console.error(`❌ Missing required scripts in ${appName}: ${missingScripts.join(', ')}`)
        return false
      }

      // Validate required dependencies
      const requiredDeps = ['next', 'react', 'react-dom']
      const missingDeps = requiredDeps.filter(dep => 
        !packageJson.dependencies?.[dep] && !packageJson.devDependencies?.[dep]
      )

      if (missingDeps.length > 0) {
        console.error(`❌ Missing required dependencies in ${appName}: ${missingDeps.join(', ')}`)
        return false
      }

      console.log(`✅ Configuration validation passed for ${appName}`)
      return true
    } catch (error) {
      console.error(`❌ Configuration validation failed for ${appName}:`, error.message)
      return false
    }
  }

  checkConsistency() {
    console.log('🔍 Checking configuration consistency across apps...')
    
    const inconsistencies = []
    const baseVersions = {}

    // Collect base dependency versions from template
    try {
      const templatePackage = JSON.parse(readFileSync(resolve(TEMPLATE_DIR, 'package.json.template'), 'utf8'))
      const templateContent = this.substituteVariables(JSON.stringify(templatePackage), this.apps[0])
      const template = JSON.parse(templateContent)
      
      Object.assign(baseVersions, template.dependencies || {})
      Object.assign(baseVersions, template.devDependencies || {})
    } catch (error) {
      console.warn('⚠️  Could not load template versions for consistency check')
    }

    // Check each app
    for (const appName of this.apps) {
      const packageJsonPath = resolve(APPS_DIR, appName, 'package.json')
      
      if (!existsSync(packageJsonPath)) continue

      try {
        const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'))
        const allDeps = { ...packageJson.dependencies, ...packageJson.devDependencies }

        Object.entries(allDeps).forEach(([dep, version]) => {
          if (baseVersions[dep] && baseVersions[dep] !== version) {
            inconsistencies.push({
              app: appName,
              dependency: dep,
              expected: baseVersions[dep],
              actual: version
            })
          }
        })
      } catch (error) {
        console.warn(`⚠️  Could not check consistency for ${appName}:`, error.message)
      }
    }

    if (inconsistencies.length > 0) {
      console.warn('⚠️  Configuration inconsistencies found:')
      inconsistencies.forEach(issue => {
        console.warn(`   ${issue.app}: ${issue.dependency} (expected: ${issue.expected}, actual: ${issue.actual})`)
      })
      return false
    } else {
      console.log('✅ All configurations are consistent')
      return true
    }
  }

  syncApp(appName) {
    console.log(`\n🔄 Syncing configuration for ${appName}...`)
    
    let success = true

    // Sync configuration files
    for (const fileName of CONFIG_FILES) {
      if (!this.syncConfigFile(fileName, appName)) {
        success = false
      }
    }

    // Sync script files
    for (const filePath of SCRIPT_FILES) {
      if (!this.syncScriptFile(filePath, appName)) {
        success = false
      }
    }

    // Sync test files
    for (const filePath of TEST_FILES) {
      if (!this.syncScriptFile(filePath, appName)) {
        success = false
      }
    }

    // Validate configuration
    if (!this.validateConfiguration(appName)) {
      success = false
    }

    return success
  }

  syncAll() {
    console.log('🚀 Starting configuration synchronization...\n')
    
    let overallSuccess = true

    for (const appName of this.apps) {
      if (!this.syncApp(appName)) {
        overallSuccess = false
      }
    }

    // Check consistency across apps
    if (!this.checkConsistency()) {
      overallSuccess = false
    }

    console.log('\n📊 Synchronization Summary:')
    console.log('==========================')
    
    if (overallSuccess) {
      console.log('✅ All configurations synchronized successfully!')
      console.log('\n💡 Next steps:')
      console.log('   1. Review the changes in each app')
      console.log('   2. Run `pnpm install` in each app directory')
      console.log('   3. Test that each app builds and runs correctly')
    } else {
      console.log('❌ Some configurations failed to sync')
      console.log('\n🔧 Please review the errors above and fix any issues')
    }

    return overallSuccess
  }
}

// CLI interface
function printUsage() {
  console.log('Configuration Synchronization Tool')
  console.log('==================================')
  console.log('')
  console.log('Usage:')
  console.log('  node scripts/sync-configs.js [command] [options]')
  console.log('')
  console.log('Commands:')
  console.log('  sync [app]     Sync configurations (all apps or specific app)')
  console.log('  validate [app] Validate configurations (all apps or specific app)')
  console.log('  check          Check configuration consistency')
  console.log('  help           Show this help message')
  console.log('')
  console.log('Examples:')
  console.log('  node scripts/sync-configs.js sync')
  console.log('  node scripts/sync-configs.js sync web')
  console.log('  node scripts/sync-configs.js validate')
  console.log('  node scripts/sync-configs.js check')
}

async function main() {
  const args = process.argv.slice(2)
  const command = args[0] || 'sync'
  const targetApp = args[1]

  const synchronizer = new ConfigSynchronizer()

  switch (command) {
    case 'sync':
      if (targetApp) {
        if (!synchronizer.apps.includes(targetApp)) {
          console.error(`❌ Unknown app: ${targetApp}`)
          console.log(`Available apps: ${synchronizer.apps.join(', ')}`)
          process.exit(1)
        }
        const success = synchronizer.syncApp(targetApp)
        process.exit(success ? 0 : 1)
      } else {
        const success = synchronizer.syncAll()
        process.exit(success ? 0 : 1)
      }
      break

    case 'validate':
      if (targetApp) {
        if (!synchronizer.apps.includes(targetApp)) {
          console.error(`❌ Unknown app: ${targetApp}`)
          process.exit(1)
        }
        const success = synchronizer.validateConfiguration(targetApp)
        process.exit(success ? 0 : 1)
      } else {
        let allValid = true
        for (const appName of synchronizer.apps) {
          if (!synchronizer.validateConfiguration(appName)) {
            allValid = false
          }
        }
        process.exit(allValid ? 0 : 1)
      }
      break

    case 'check':
      const consistent = synchronizer.checkConsistency()
      process.exit(consistent ? 0 : 1)
      break

    case 'help':
      printUsage()
      process.exit(0)
      break

    default:
      console.error(`❌ Unknown command: ${command}`)
      printUsage()
      process.exit(1)
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error('💥 Synchronization failed:', error.message)
    process.exit(1)
  })
}

export { ConfigSynchronizer }