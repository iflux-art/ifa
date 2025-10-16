#!/usr/bin/env node

import { spawn } from 'child_process';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const COLORS = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

const APP_CONFIGS = {
  web: { name: '@repo/web', port: 3000 },
  blog: { name: 'blog', port: 3001 },
  hub: { name: 'hub', port: 3002 },
};

function log(message, color = COLORS.reset) {
  console.log(`${color}${message}${COLORS.reset}`);
}

function runCommand(command, args = [], options = {}) {
  return new Promise((resolve, reject) => {
    log(`🔧 Running: ${command} ${args.join(' ')}`, COLORS.yellow);
    
    const process = spawn(command, args, {
      stdio: 'inherit',
      shell: true,
      ...options,
    });
    
    process.on('close', (code) => {
      if (code === 0) {
        resolve(code);
      } else {
        reject(new Error(`Command failed with exit code ${code}`));
      }
    });
  });
}

async function validateEnvironment() {
  log('🔍 Validating build environment...', COLORS.cyan);
  
  try {
    await runCommand('node', ['scripts/validate-workspace.js']);
    log('✅ Environment validation passed', COLORS.green);
  } catch (error) {
    log('❌ Environment validation failed', COLORS.red);
    throw error;
  }
}

async function runPreBuildChecks() {
  log('🔍 Running pre-build checks...', COLORS.cyan);
  
  try {
    // Type checking
    log('📝 Type checking...', COLORS.blue);
    await runCommand('turbo', ['run', 'type-check']);
    
    // Linting
    log('🔍 Linting...', COLORS.blue);
    await runCommand('turbo', ['run', 'lint']);
    
    // Testing
    log('🧪 Running tests...', COLORS.blue);
    await runCommand('turbo', ['run', 'test:run']);
    
    log('✅ Pre-build checks passed', COLORS.green);
  } catch (error) {
    log('❌ Pre-build checks failed', COLORS.red);
    throw error;
  }
}

async function buildApps(apps = ['web', 'blog', 'hub'], options = {}) {
  log('🏗️  Building applications...', COLORS.cyan);
  
  const { skipChecks = false, production = true } = options;
  
  if (!skipChecks) {
    await runPreBuildChecks();
  }
  
  try {
    if (apps.length === 3) {
      // Build all apps
      await runCommand('turbo', ['run', 'build']);
    } else {
      // Build specific apps
      for (const app of apps) {
        const appConfig = APP_CONFIGS[app];
        if (!appConfig) {
          throw new Error(`Unknown app: ${app}`);
        }
        
        log(`🏗️  Building ${appConfig.name}...`, COLORS.blue);
        await runCommand('turbo', ['run', 'build', '--filter', appConfig.name]);
      }
    }
    
    log('✅ Build completed successfully', COLORS.green);
  } catch (error) {
    log('❌ Build failed', COLORS.red);
    throw error;
  }
}

async function generateBuildReport(apps) {
  log('📊 Generating build report...', COLORS.cyan);
  
  const report = {
    timestamp: new Date().toISOString(),
    apps: {},
    summary: {
      totalApps: apps.length,
      successful: 0,
      failed: 0,
    },
  };
  
  for (const app of apps) {
    const appPath = `apps/${app}`;
    const nextBuildPath = join(appPath, '.next');
    
    if (existsSync(nextBuildPath)) {
      try {
        // Try to read build manifest
        const buildManifestPath = join(nextBuildPath, 'build-manifest.json');
        let buildInfo = { status: 'success' };
        
        if (existsSync(buildManifestPath)) {
          const manifest = JSON.parse(readFileSync(buildManifestPath, 'utf8'));
          buildInfo.pages = Object.keys(manifest.pages || {}).length;
        }
        
        report.apps[app] = buildInfo;
        report.summary.successful++;
      } catch (error) {
        report.apps[app] = { status: 'error', error: error.message };
        report.summary.failed++;
      }
    } else {
      report.apps[app] = { status: 'not_built' };
      report.summary.failed++;
    }
  }
  
  // Write report
  const reportPath = 'build-report.json';
  writeFileSync(reportPath, JSON.stringify(report, null, 2));
  
  log(`📊 Build report saved to ${reportPath}`, COLORS.green);
  
  // Display summary
  log('\n📈 Build Summary:', COLORS.bright);
  log(`✅ Successful: ${report.summary.successful}`, COLORS.green);
  log(`❌ Failed: ${report.summary.failed}`, COLORS.red);
  
  return report;
}

async function deploymentPrep(apps, environment = 'production') {
  log(`🚀 Preparing for ${environment} deployment...`, COLORS.cyan);
  
  for (const app of apps) {
    const appPath = `apps/${app}`;
    const packageJsonPath = join(appPath, 'package.json');
    
    if (existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
      
      // Create deployment info
      const deploymentInfo = {
        app: packageJson.name,
        version: packageJson.version,
        environment,
        buildTime: new Date().toISOString(),
        nodeVersion: process.version,
      };
      
      const deploymentInfoPath = join(appPath, 'deployment-info.json');
      writeFileSync(deploymentInfoPath, JSON.stringify(deploymentInfo, null, 2));
      
      log(`✅ Deployment info created for ${app}`, COLORS.green);
    }
  }
}

function showHelp() {
  console.log(`
${COLORS.bright}Build and Deployment Manager${COLORS.reset}

${COLORS.cyan}Usage:${COLORS.reset}
  node scripts/build-deployment.js [command] [apps...] [options]

${COLORS.cyan}Commands:${COLORS.reset}
  build [apps...]     Build applications (default: all apps)
  validate           Validate build environment
  report             Generate build report
  prep [env]         Prepare for deployment
  help              Show this help message

${COLORS.cyan}Apps:${COLORS.reset}
  web               Main web application
  blog              Blog application  
  hub               Hub application

${COLORS.cyan}Options:${COLORS.reset}
  --skip-checks     Skip pre-build checks (type-check, lint, test)
  --dev             Development build
  --production      Production build (default)

${COLORS.cyan}Examples:${COLORS.reset}
  node scripts/build-deployment.js build
  node scripts/build-deployment.js build web blog
  node scripts/build-deployment.js build --skip-checks
  node scripts/build-deployment.js prep staging
  node scripts/build-deployment.js validate
`);
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'build';
  
  // Parse options
  const options = {
    skipChecks: args.includes('--skip-checks'),
    production: !args.includes('--dev'),
  };
  
  // Parse apps
  const availableApps = Object.keys(APP_CONFIGS);
  const specifiedApps = args.filter(arg => 
    availableApps.includes(arg) && !arg.startsWith('--')
  );
  const apps = specifiedApps.length > 0 ? specifiedApps : availableApps;
  
  try {
    switch (command) {
      case 'build':
        await validateEnvironment();
        await buildApps(apps, options);
        await generateBuildReport(apps);
        break;
        
      case 'validate':
        await validateEnvironment();
        break;
        
      case 'report':
        await generateBuildReport(apps);
        break;
        
      case 'prep':
        const environment = args[1] || 'production';
        await deploymentPrep(apps, environment);
        break;
        
      case 'help':
      case '--help':
      case '-h':
        showHelp();
        break;
        
      default:
        log(`❌ Unknown command: ${command}`, COLORS.red);
        showHelp();
        process.exit(1);
    }
    
    log('\n🎉 Operation completed successfully!', COLORS.green);
  } catch (error) {
    log(`\n❌ Operation failed: ${error.message}`, COLORS.red);
    process.exit(1);
  }
}

main();