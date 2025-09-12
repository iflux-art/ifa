#!/usr/bin/env node

const { spawn } = require('node:child_process')
const _path = require('node:path')

/**
 * Code quality checking script for monorepo
 * Runs linting, formatting, and type checking
 */

async function runCommand(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    console.log(`🔍 Running: ${command} ${args.join(' ')}`)

    const child = spawn(command, args, {
      stdio: 'inherit',
      ...options,
    })

    child.on('close', code => {
      if (code === 0) {
        resolve()
      } else {
        reject(new Error(`Command failed with exit code ${code}`))
      }
    })

    child.on('error', error => {
      reject(error)
    })
  })
}

async function runQualityChecks() {
  console.log('🚀 Starting code quality checks...\n')

  try {
    // 1. Biome linting and formatting check
    console.log('📋 Running Biome checks...')
    await runCommand('pnpm', ['turbo', 'run', 'check'])
    console.log('✅ Biome checks passed\n')

    // 2. TypeScript type checking
    console.log('🔍 Running TypeScript type checking...')
    await runCommand('pnpm', ['turbo', 'run', 'type-check'])
    console.log('✅ Type checking passed\n')

    // 3. Run tests
    console.log('🧪 Running tests...')
    await runCommand('pnpm', ['turbo', 'run', 'test'])
    console.log('✅ Tests passed\n')

    console.log('🎉 All quality checks passed!')
  } catch (error) {
    console.error('❌ Quality checks failed:', error.message)
    process.exit(1)
  }
}

// Handle CLI arguments
const args = process.argv.slice(2)
const _skipTests = args.includes('--skip-tests')
const fixIssues = args.includes('--fix')

if (fixIssues) {
  console.log('🔧 Running quality checks with auto-fix...\n')

  runCommand('pnpm', ['turbo', 'run', 'format'])
    .then(() => runQualityChecks())
    .catch(error => {
      console.error('❌ Failed to fix issues:', error.message)
      process.exit(1)
    })
} else {
  runQualityChecks()
}

module.exports = { runQualityChecks }
