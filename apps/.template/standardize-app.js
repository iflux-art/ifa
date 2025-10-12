#!/usr/bin/env node

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

function standardizeApp(appName, appTitle, appDescription) {
  const templateDir = __dirname
  const appDir = join(__dirname, '..', appName)
  
  console.log(`Standardizing ${appName} application...`)
  
  // Create missing directories
  const requiredDirs = [
    'src/hooks',
    'src/stores', 
    'src/types',
    'src/config'
  ]
  
  requiredDirs.forEach(dir => {
    const fullPath = join(appDir, dir)
    if (!existsSync(fullPath)) {
      mkdirSync(fullPath, { recursive: true })
      console.log(`Created directory: ${dir}`)
    }
  })
  
  // Files to copy/update
  const filesToProcess = [
    'package.json',
    'next.config.mjs',
    'tsconfig.json',
    'biome.json',
    'vitest.config.ts',
    'playwright.config.ts',
    'tailwind.config.mjs',
    'postcss.config.mjs',
    'README.md',
    'src/hooks/index.ts',
    'src/stores/index.ts',
    'src/types/index.ts',
    'src/config/index.ts',
    'src/test/setup.ts',
    'src/middleware.ts'
  ]
  
  filesToProcess.forEach(file => {
    const templatePath = join(templateDir, file)
    const appPath = join(appDir, file)
    
    if (existsSync(templatePath)) {
      let content = readFileSync(templatePath, 'utf8')
      
      // Replace placeholders
      content = content.replace(/\{\{APP_NAME\}\}/g, appName)
      content = content.replace(/\{\{APP_TITLE\}\}/g, appTitle)
      content = content.replace(/\{\{APP_DESCRIPTION\}\}/g, appDescription)
      
      writeFileSync(appPath, content)
      console.log(`Updated: ${file}`)
    }
  })
  
  console.log(`✅ ${appName} application standardized successfully!`)
}

// Export for use in other scripts
export { standardizeApp }