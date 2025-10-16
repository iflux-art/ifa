#!/usr/bin/env node

import { config } from 'dotenv'
import { resolve } from 'node:path'
import { existsSync } from 'node:fs'

/**
 * Load environment variables in the correct order:
 * 1. .env.local (highest priority)
 * 2. .env.{NODE_ENV}
 * 3. .env (lowest priority)
 */
function loadEnvironmentVariables() {
  const nodeEnv = process.env.NODE_ENV || 'development'
  
  const envFiles = [
    '.env',
    `.env.${nodeEnv}`,
    '.env.local'
  ]

  let loadedFiles = 0
  
  for (const envFile of envFiles) {
    const envPath = resolve(process.cwd(), envFile)
    
    if (existsSync(envPath)) {
      const result = config({ path: envPath })
      
      if (result.error) {
        console.warn(`⚠️  Warning: Could not load ${envFile}:`, result.error.message)
      } else {
        console.log(`✅ Loaded environment variables from ${envFile}`)
        loadedFiles++
      }
    }
  }
  
  if (loadedFiles === 0) {
    console.log('ℹ️  No environment files found, using system environment variables only')
  }
  
  // Validate required environment variables
  validateEnvironmentVariables()
}

/**
 * Validate that required environment variables are set
 */
function validateEnvironmentVariables() {
  const required = [
    'NEXT_PUBLIC_APP_NAME',
    'NEXT_PUBLIC_APP_URL'
  ]
  
  const missing = required.filter(key => !process.env[key])
  
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:')
    missing.forEach(key => console.error(`   - ${key}`))
    console.error('\nPlease check your .env files or set these variables in your environment.')
    process.exit(1)
  }
  
  console.log('✅ All required environment variables are set')
}

/**
 * Display current environment configuration
 */
function displayEnvironmentInfo() {
  console.log('\n📋 Environment Configuration:')
  console.log(`   NODE_ENV: ${process.env.NODE_ENV || 'development'}`)
  console.log(`   App Name: ${process.env.NEXT_PUBLIC_APP_NAME || 'Unknown'}`)
  console.log(`   App URL: ${process.env.NEXT_PUBLIC_APP_URL || 'Unknown'}`)
  console.log(`   Turbopack: ${process.env.TURBOPACK === 'true' ? 'Enabled' : 'Disabled'}`)
  console.log(`   Debug Mode: ${process.env.NEXT_PUBLIC_ENABLE_DEBUG === 'true' ? 'Enabled' : 'Disabled'}`)
  console.log('')
}

// Main execution
if (import.meta.url === `file://${process.argv[1]}`) {
  loadEnvironmentVariables()
  displayEnvironmentInfo()
}

export { loadEnvironmentVariables, validateEnvironmentVariables }