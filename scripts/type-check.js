#!/usr/bin/env node

const { spawn } = require('node:child_process')
const path = require('node:path')
const fs = require('node:fs')

/**
 * TypeScript type checking script for monorepo
 * Runs type checking across all packages and apps
 */

const workspaces = [
  'packages/ui',
  'packages/utils',
  'packages/typescript-config',
  'packages/biome-config',
  'packages/tailwind-config',
  'apps/website',
  'apps/blog',
  'apps/docs',
]

async function runTypeCheck() {
  console.log('🔍 Running TypeScript type checking across monorepo...\n')

  let hasErrors = false

  for (const workspace of workspaces) {
    const workspacePath = path.join(process.cwd(), workspace)
    const tsconfigPath = path.join(workspacePath, 'tsconfig.json')

    // Skip if no tsconfig.json exists
    if (!fs.existsSync(tsconfigPath)) {
      console.log(`⏭️  Skipping ${workspace} (no tsconfig.json)`)
      continue
    }

    console.log(`🔍 Type checking ${workspace}...`)

    try {
      await new Promise((resolve, _reject) => {
        const tsc = spawn('npx', ['tsc', '--noEmit'], {
          cwd: workspacePath,
          stdio: 'pipe',
        })

        let output = ''
        let errorOutput = ''

        tsc.stdout.on('data', data => {
          output += data.toString()
        })

        tsc.stderr.on('data', data => {
          errorOutput += data.toString()
        })

        tsc.on('close', code => {
          if (code === 0) {
            console.log(`✅ ${workspace} - Type checking passed`)
            resolve()
          } else {
            console.log(`❌ ${workspace} - Type checking failed`)
            if (output) console.log(output)
            if (errorOutput) console.log(errorOutput)
            hasErrors = true
            resolve() // Continue with other workspaces
          }
        })

        tsc.on('error', error => {
          console.log(
            `❌ ${workspace} - Failed to run type check: ${error.message}`
          )
          hasErrors = true
          resolve()
        })
      })
    } catch (error) {
      console.log(`❌ ${workspace} - Error: ${error.message}`)
      hasErrors = true
    }

    console.log('')
  }

  if (hasErrors) {
    console.log('❌ Type checking completed with errors')
    process.exit(1)
  } else {
    console.log('✅ All type checks passed!')
    process.exit(0)
  }
}

runTypeCheck().catch(error => {
  console.error('Failed to run type checking:', error)
  process.exit(1)
})
