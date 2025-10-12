#!/usr/bin/env node

import { existsSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const REQUIRED_FILES = [
  'package.json',
  'next.config.mjs',
  'tsconfig.json',
  'biome.json',
  'vitest.config.ts',
  'playwright.config.ts',
  'tailwind.config.mjs',
  'postcss.config.mjs',
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
  'src/test/setup.ts',
  'src/middleware.ts'
]

const REQUIRED_DIRECTORIES = [
  'src',
  'src/app',
  'src/components',
  'src/components/ui',
  'src/components/theme',
  'src/lib',
  'src/lib/utils',
  'src/hooks',
  'src/stores',
  'src/types',
  'src/config',
  'src/test',
  'e2e',
  'public'
]

function validateApplication(appName) {
  const appDir = join(__dirname, '..', appName)
  
  if (!existsSync(appDir)) {
    console.error(`❌ Application directory not found: ${appName}`)
    return false
  }

  console.log(`\n🔍 Validating ${appName} application...`)
  
  let isValid = true
  
  // Check required directories
  console.log('\n📁 Checking directories:')
  for (const dir of REQUIRED_DIRECTORIES) {
    const fullPath = join(appDir, dir)
    if (existsSync(fullPath) && statSync(fullPath).isDirectory()) {
      console.log(`  ✅ ${dir}`)
    } else {
      console.log(`  ❌ ${dir} (missing)`)
      isValid = false
    }
  }
  
  // Check required files
  console.log('\n📄 Checking files:')
  for (const file of REQUIRED_FILES) {
    const fullPath = join(appDir, file)
    if (existsSync(fullPath) && statSync(fullPath).isFile()) {
      console.log(`  ✅ ${file}`)
    } else {
      console.log(`  ❌ ${file} (missing)`)
      isValid = false
    }
  }
  
  return isValid
}

function main() {
  const apps = ['web', 'blog', 'hub']
  let allValid = true
  
  console.log('🚀 Validating sub-application structure...')
  
  for (const app of apps) {
    const isValid = validateApplication(app)
    if (!isValid) {
      allValid = false
    }
  }
  
  console.log(`\n${'='.repeat(50)}`)
  if (allValid) {
    console.log('✅ All applications follow the standard structure!')
  } else {
    console.log('❌ Some applications need standardization.')
    process.exit(1)
  }
}

main()