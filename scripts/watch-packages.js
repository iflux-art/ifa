#!/usr/bin/env node

const chokidar = require('chokidar')
const { spawn } = require('node:child_process')
const path = require('node:path')
const debounce = require('lodash.debounce')

/**
 * Package watcher script for cross-package dependency monitoring
 * Watches for changes in shared packages and triggers rebuilds
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
  const timestamp = new Date().toLocaleTimeString()
  console.log(`${color}[${timestamp}] ${message}${colors.reset}`)
}

function runCommand(command, args = [], options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: 'pipe',
      shell: true,
      ...options,
    })

    let output = ''
    child.stdout?.on('data', data => {
      output += data.toString()
    })

    child.stderr?.on('data', data => {
      output += data.toString()
    })

    child.on('close', code => {
      if (code === 0) {
        resolve(output)
      } else {
        reject(new Error(`Command failed: ${output}`))
      }
    })

    child.on('error', reject)
  })
}

// Package configurations
const packages = {
  'packages/ui': {
    name: '@repo/ui',
    buildCommand: ['pnpm', 'turbo', 'run', 'build', '--filter=@repo/ui'],
    dependents: ['@repo/website', '@repo/blog', '@repo/docs'],
  },
  'packages/utils': {
    name: '@repo/utils',
    buildCommand: ['pnpm', 'turbo', 'run', 'build', '--filter=@repo/utils'],
    dependents: ['@repo/ui', '@repo/website', '@repo/blog', '@repo/docs'],
  },
}

// Debounced rebuild functions for each package
const debouncedRebuilds = {}

for (const packagePath of Object.keys(packages)) {
  const pkg = packages[packagePath]

  debouncedRebuilds[packagePath] = debounce(async () => {
    log(`🔄 Rebuilding ${pkg.name}...`, colors.yellow)

    try {
      await runCommand(pkg.buildCommand[0], pkg.buildCommand.slice(1))
      log(`✅ ${pkg.name} rebuilt successfully`, colors.green)

      // Notify about dependent packages
      if (pkg.dependents.length > 0) {
        log(`📦 Dependent packages: ${pkg.dependents.join(', ')}`, colors.cyan)
      }
    } catch (error) {
      log(`❌ Failed to rebuild ${pkg.name}: ${error.message}`, colors.red)
    }
  }, 1000) // 1 second debounce
}

function startWatching() {
  log('👀 Starting package watcher...', colors.bright)
  log('Watching for changes in shared packages', colors.cyan)

  for (const packagePath of Object.keys(packages)) {
    const pkg = packages[packagePath]
    const watchPath = path.join(process.cwd(), packagePath, 'src')

    log(`🔍 Watching ${pkg.name} at ${watchPath}`, colors.blue)

    const watcher = chokidar.watch(watchPath, {
      ignored: [
        '**/node_modules/**',
        '**/dist/**',
        '**/.next/**',
        '**/.swc/**',
        '**/coverage/**',
        '**/*.test.*',
        '**/*.spec.*',
      ],
      ignoreInitial: true,
      persistent: true,
    })

    watcher.on('change', filePath => {
      const relativePath = path.relative(process.cwd(), filePath)
      log(`📝 Changed: ${relativePath}`, colors.magenta)
      debouncedRebuilds[packagePath]()
    })

    watcher.on('add', filePath => {
      const relativePath = path.relative(process.cwd(), filePath)
      log(`➕ Added: ${relativePath}`, colors.green)
      debouncedRebuilds[packagePath]()
    })

    watcher.on('unlink', filePath => {
      const relativePath = path.relative(process.cwd(), filePath)
      log(`➖ Removed: ${relativePath}`, colors.red)
      debouncedRebuilds[packagePath]()
    })

    watcher.on('error', error => {
      log(`❌ Watcher error for ${pkg.name}: ${error.message}`, colors.red)
    })
  }

  log('✅ Package watcher started successfully!', colors.green)
  log('Press Ctrl+C to stop watching', colors.yellow)
}

// Handle process termination
process.on('SIGINT', () => {
  log('\n👋 Package watcher stopped', colors.yellow)
  process.exit(0)
})

process.on('SIGTERM', () => {
  log('\n👋 Package watcher stopped', colors.yellow)
  process.exit(0)
})

// Check if lodash.debounce is available
try {
  require.resolve('lodash.debounce')
} catch (_error) {
  log('❌ lodash.debounce is required but not installed', colors.red)
  log('Run: pnpm add -D lodash.debounce', colors.yellow)
  process.exit(1)
}

startWatching()