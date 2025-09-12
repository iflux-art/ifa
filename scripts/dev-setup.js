#!/usr/bin/env node

const { spawn } = require('node:child_process')
const _path = require('node:path')

/**
 * Development setup script for the monorepo
 * This script ensures packages are built before starting development servers
 */

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
}

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`)
}

function runCommand(command, args = [], options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: 'inherit',
      shell: true,
      ...options,
    })

    child.on('close', code => {
      if (code === 0) {
        resolve()
      } else {
        reject(new Error(`Command failed with exit code ${code}`))
      }
    })

    child.on('error', reject)
  })
}

async function buildPackages() {
  log('🔨 Building shared packages...', colors.yellow)

  try {
    await runCommand('pnpm', ['turbo', 'run', 'build', '--filter=./packages/*'])
    log('✅ Packages built successfully!', colors.green)
  } catch (error) {
    log('❌ Failed to build packages', colors.red)
    throw error
  }
}

async function startDevelopment() {
  log('🚀 Starting development servers...', colors.cyan)

  try {
    await runCommand('pnpm', ['turbo', 'run', 'dev', '--parallel'])
  } catch (error) {
    log('❌ Failed to start development servers', colors.red)
    throw error
  }
}

async function main() {
  const args = process.argv.slice(2)
  const skipBuild = args.includes('--skip-build')
  const fastMode = args.includes('--fast')

  log('🎯 NextJS Monorepo Development Setup', colors.bright)
  log('=====================================', colors.bright)

  try {
    if (!skipBuild && !fastMode) {
      await buildPackages()
    } else if (fastMode) {
      log('⚡ Fast mode: Skipping package builds', colors.yellow)
    }

    await startDevelopment()
  } catch (error) {
    log(`❌ Setup failed: ${error.message}`, colors.red)
    process.exit(1)
  }
}

// Handle process termination
process.on('SIGINT', () => {
  log('\n👋 Development servers stopped', colors.yellow)
  process.exit(0)
})

process.on('SIGTERM', () => {
  log('\n👋 Development servers stopped', colors.yellow)
  process.exit(0)
})

main().catch(error => {
  log(`❌ Unexpected error: ${error.message}`, colors.red)
  process.exit(1)
})
