#!/usr/bin/env node

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import fastGlob from 'fast-glob';

const COLORS = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = COLORS.reset) {
  console.log(`${color}${message}${COLORS.reset}`);
}

function validatePackageJson(appPath, appName) {
  const packageJsonPath = join(appPath, 'package.json');
  
  if (!existsSync(packageJsonPath)) {
    log(`❌ ${appName}: package.json not found`, COLORS.red);
    return false;
  }
  
  try {
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
    const requiredScripts = [
      'dev', 'build', 'start', 'lint', 'lint:fix', 'format', 'format:check',
      'check', 'check:fix', 'type-check', 'test', 'test:run', 'test:coverage',
      'test:e2e', 'test:e2e:ui', 'clean', 'deps:check', 'env:validate'
    ];
    
    const missingScripts = requiredScripts.filter(script => !packageJson.scripts?.[script]);
    
    if (missingScripts.length > 0) {
      log(`⚠️  ${appName}: Missing scripts: ${missingScripts.join(', ')}`, COLORS.yellow);
      return false;
    }
    
    // Check for consistent dependencies
    const requiredDeps = ['next', 'react', 'react-dom'];
    const requiredDevDeps = ['@biomejs/biome', 'typescript', 'vitest', '@playwright/test'];
    
    const missingDeps = requiredDeps.filter(dep => !packageJson.dependencies?.[dep]);
    const missingDevDeps = requiredDevDeps.filter(dep => !packageJson.devDependencies?.[dep]);
    
    if (missingDeps.length > 0) {
      log(`⚠️  ${appName}: Missing dependencies: ${missingDeps.join(', ')}`, COLORS.yellow);
    }
    
    if (missingDevDeps.length > 0) {
      log(`⚠️  ${appName}: Missing dev dependencies: ${missingDevDeps.join(', ')}`, COLORS.yellow);
    }
    
    log(`✅ ${appName}: package.json validation passed`, COLORS.green);
    return true;
  } catch (error) {
    log(`❌ ${appName}: Invalid package.json - ${error.message}`, COLORS.red);
    return false;
  }
}

function validateConfigFiles(appPath, appName) {
  const requiredConfigs = [
    'tsconfig.json',
    'biome.json',
    'tailwind.config.mjs',
    'next.config.mjs',
    'vitest.config.ts',
    'playwright.config.ts'
  ];
  
  let allValid = true;
  
  for (const config of requiredConfigs) {
    const configPath = join(appPath, config);
    if (!existsSync(configPath)) {
      log(`⚠️  ${appName}: Missing config file: ${config}`, COLORS.yellow);
      allValid = false;
    }
  }
  
  if (allValid) {
    log(`✅ ${appName}: Configuration files validation passed`, COLORS.green);
  }
  
  return allValid;
}

function validateDirectoryStructure(appPath, appName) {
  const requiredDirs = [
    'src',
    'public',
    'scripts'
  ];
  
  const optionalDirs = [
    'app',
    'components',
    'lib',
    'styles',
    '__tests__',
    'e2e'
  ];
  
  let allValid = true;
  
  for (const dir of requiredDirs) {
    const dirPath = join(appPath, dir);
    if (!existsSync(dirPath)) {
      log(`❌ ${appName}: Missing required directory: ${dir}`, COLORS.red);
      allValid = false;
    }
  }
  
  for (const dir of optionalDirs) {
    const dirPath = join(appPath, dir);
    if (existsSync(dirPath)) {
      log(`✅ ${appName}: Found optional directory: ${dir}`, COLORS.green);
    }
  }
  
  if (allValid) {
    log(`✅ ${appName}: Directory structure validation passed`, COLORS.green);
  }
  
  return allValid;
}

function validateTurboConfig() {
  const turboConfigPath = 'turbo.json';
  
  if (!existsSync(turboConfigPath)) {
    log('❌ turbo.json not found', COLORS.red);
    return false;
  }
  
  try {
    const turboConfig = JSON.parse(readFileSync(turboConfigPath, 'utf8'));
    
    const requiredTasks = [
      'build', 'dev', 'start', 'lint', 'format', 'check', 'type-check',
      'test', 'test:coverage', 'test:e2e', 'clean', 'depcheck'
    ];
    
    const missingTasks = requiredTasks.filter(task => !turboConfig.pipeline?.[task]);
    
    if (missingTasks.length > 0) {
      log(`⚠️  Turbo: Missing pipeline tasks: ${missingTasks.join(', ')}`, COLORS.yellow);
      return false;
    }
    
    log('✅ Turbo configuration validation passed', COLORS.green);
    return true;
  } catch (error) {
    log(`❌ Invalid turbo.json - ${error.message}`, COLORS.red);
    return false;
  }
}

function validateWorkspaceConfig() {
  const workspaceConfigPath = 'pnpm-workspace.yaml';
  
  if (!existsSync(workspaceConfigPath)) {
    log('❌ pnpm-workspace.yaml not found', COLORS.red);
    return false;
  }
  
  log('✅ Workspace configuration found', COLORS.green);
  return true;
}

async function validateApps() {
  const appPaths = await fastGlob('apps/*', { onlyDirectories: true });
  const appDirs = appPaths.filter(path => !path.includes('.template'));

  let allAppsValid = true;
  
  for (const appPath of appDirs) {
    const appName = appPath.split('/').pop();
    log(`\n🔍 Validating app: ${appName}`, COLORS.cyan);
    
    const packageValid = validatePackageJson(appPath, appName);
    const configValid = validateConfigFiles(appPath, appName);
    const structureValid = validateDirectoryStructure(appPath, appName);
    
    if (!packageValid || !configValid || !structureValid) {
      allAppsValid = false;
    }
  }
  
  return allAppsValid;
}

async function main() {
  log('🔍 Validating workspace configuration...', COLORS.cyan);
  
  const workspaceValid = validateWorkspaceConfig();
  const turboValid = validateTurboConfig();
  const appsValid = await validateApps();
  
  log('\n📊 Validation Summary:', COLORS.bright);
  
  if (workspaceValid && turboValid && appsValid) {
    log('✅ All validations passed! Workspace is properly configured.', COLORS.green);
    process.exit(0);
  } else {
    log('❌ Some validations failed. Please review the issues above.', COLORS.red);
    log('\n💡 Run `pnpm workspace:sync` to fix configuration issues.', COLORS.yellow);
    process.exit(1);
  }
}

main().catch(error => {
  log(`❌ Validation failed: ${error.message}`, COLORS.red);
  process.exit(1);
});