#!/usr/bin/env node

/**
 * Type check script for running type checking across the monorepo
 * This script runs tsc --noEmit for all packages and apps
 */

const { spawn } = require('child_process')
const path = require('path')

// Packages to type check
const packages = [
  'packages/ui',
  'packages/utils',
  'apps/website',
  'apps/blog',
  'apps/docs',
  'apps/hub',
]

// Function to run type checking for a package
function typeCheckPackage(packagePath) {
  return new Promise((resolve, reject) => {
    const packageDir = path.join(process.cwd(), packagePath)
    const child = spawn('pnpm', ['type-check'], {
      cwd: packageDir,
      stdio: 'inherit',
      shell: true,
    })

    child.on('close', code => {
      if (code === 0) {
        resolve()
      } else {
        reject(new Error(`Type check failed for ${packagePath}`))
      }
    })

    child.on('error', reject)
  })
}

// Run type checking for all packages
async function runTypeCheck() {
  console.log('Running type checking for all packages...\n')

  for (const pkg of packages) {
    try {
      console.log(`🔍 Type checking ${pkg}...`)
      await typeCheckPackage(pkg)
      console.log(`✅ ${pkg} type check passed\n`)
    } catch (error) {
      console.error(`❌ ${pkg} type check failed`)
      process.exit(1)
    }
  }

  console.log('🎉 All packages passed type checking!')
}

runTypeCheck()