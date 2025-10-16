#!/usr/bin/env node

import { readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { execSync } from 'node:child_process'

/**
 * Project health check script
 * Validates project configuration, dependencies, and structure
 */

const REQUIRED_FILES = [
  'package.json',
  'tsconfig.json',
  'next.config.mjs',
  'tailwind.config.mjs',
  'biome.json',
  '.env.example'
]

const REQUIRED_DIRECTORIES = [
  'src',
  'src/app',
  'src/components',
  'src/lib'
]

function checkRequiredFiles() {
  console.log('🔍 Checking required files...')
  
  const missing = REQUIRED_FILES.filter(file => !existsSync(resolve(process.cwd(), file)))
  
  if (missing.length > 0) {
    console.error('❌ Missing required files:')
    missing.forEach(file => console.error(`   - ${file}`))
    return false
  }
  
  console.log('✅ All required files present')
  return true
}

function checkRequiredDirectories() {
  console.log('🔍 Checking required directories...')
  
  const missing = REQUIRED_DIRECTORIES.filter(dir => !existsSync(resolve(process.cwd(), dir)))
  
  if (missing.length > 0) {
    console.error('❌ Missing required directories:')
    missing.forEach(dir => console.error(`   - ${dir}`))
    return false
  }
  
  console.log('✅ All required directories present')
  return true
}

function checkPackageJson() {
  console.log('🔍 Checking package.json configuration...')
  
  try {
    const packageJson = JSON.parse(readFileSync('package.json', 'utf8'))
    
    const requiredScripts = [
      'dev', 'build', 'start', 'lint', 'type-check', 'test'
    ]
    
    const missingScripts = requiredScripts.filter(script => !packageJson.scripts?.[script])
    
    if (missingScripts.length > 0) {
      console.error('❌ Missing required scripts in package.json:')
      missingScripts.forEach(script => console.error(`   - ${script}`))
      return false
    }
    
    // Check for required dependencies
    const requiredDeps = ['next', 'react', 'react-dom']
    const missingDeps = requiredDeps.filter(dep => 
      !packageJson.dependencies?.[dep] && !packageJson.devDependencies?.[dep]
    )
    
    if (missingDeps.length > 0) {
      console.error('❌ Missing required dependencies:')
      missingDeps.forEach(dep => console.error(`   - ${dep}`))
      return false
    }
    
    console.log('✅ package.json configuration is valid')
    return true
  } catch (error) {
    console.error('❌ Error reading package.json:', error.message)
    return false
  }
}

function checkTypeScript() {
  console.log('🔍 Checking TypeScript configuration...')
  
  try {
    execSync('npx tsc --noEmit', { stdio: 'pipe' })
    console.log('✅ TypeScript compilation successful')
    return true
  } catch (error) {
    console.error('❌ TypeScript compilation failed')
    console.error(error.stdout?.toString() || error.message)
    return false
  }
}

function checkLinting() {
  console.log('🔍 Checking code quality with Biome...')
  
  try {
    execSync('npx biome check .', { stdio: 'pipe' })
    console.log('✅ Code quality check passed')
    return true
  } catch (error) {
    console.error('❌ Code quality issues found')
    console.error(error.stdout?.toString() || error.message)
    return false
  }
}

function checkDependencies() {
  console.log('🔍 Checking for unused dependencies...')
  
  try {
    execSync('npx depcheck', { stdio: 'pipe' })
    console.log('✅ No unused dependencies found')
    return true
  } catch (error) {
    const output = error.stdout?.toString() || error.message
    if (output.includes('No depcheck issue')) {
      console.log('✅ No unused dependencies found')
      return true
    } else {
      console.warn('⚠️  Potential dependency issues found:')
      console.warn(output)
      return true // Don't fail the check for this
    }
  }
}

function generateReport(results) {
  console.log('\n📊 Project Health Report:')
  console.log('========================')
  
  const passed = results.filter(r => r.passed).length
  const total = results.length
  
  results.forEach(result => {
    const icon = result.passed ? '✅' : '❌'
    console.log(`${icon} ${result.name}`)
  })
  
  console.log(`\nOverall: ${passed}/${total} checks passed`)
  
  if (passed === total) {
    console.log('🎉 Project is healthy!')
    return true
  } else {
    console.log('⚠️  Project needs attention')
    return false
  }
}

// Main execution
async function main() {
  console.log('🏥 Running project health check...\n')
  
  const checks = [
    { name: 'Required Files', fn: checkRequiredFiles },
    { name: 'Required Directories', fn: checkRequiredDirectories },
    { name: 'Package Configuration', fn: checkPackageJson },
    { name: 'TypeScript Compilation', fn: checkTypeScript },
    { name: 'Code Quality', fn: checkLinting },
    { name: 'Dependencies', fn: checkDependencies }
  ]
  
  const results = []
  
  for (const check of checks) {
    try {
      const passed = await check.fn()
      results.push({ name: check.name, passed })
    } catch (error) {
      console.error(`❌ ${check.name} check failed:`, error.message)
      results.push({ name: check.name, passed: false })
    }
    console.log('') // Add spacing between checks
  }
  
  const success = generateReport(results)
  process.exit(success ? 0 : 1)
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error('💥 Health check failed:', error.message)
    process.exit(1)
  })
}