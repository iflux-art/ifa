#!/usr/bin/env node

/**
 * 根级环境验证脚本
 * 此脚本验证所有子应用程序的环境配置
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 定义要验证的应用程序
const apps = [
  { name: 'web', port: 3000, path: 'apps/web' },
  { name: 'blog', port: 3001, path: 'apps/blog' },
  { name: 'hub', port: 3002, path: 'apps/hub' },
];

// 获取当前环境
const NODE_ENV = process.env.NODE_ENV || 'development';

/**
 * 检查应用程序目录是否存在
 */
function appExists(appPath) {
  return fs.existsSync(path.resolve(process.cwd(), appPath));
}

/**
 * 检查应用程序的环境文件是否存在
 */
function checkEnvironmentFiles(appPath) {
  const envFiles = [
    '.env.example',
    `.env.${NODE_ENV}`,
    '.env.development',
    '.env.test',
    '.env.production',
  ];

  const results = {};
  
  for (const envFile of envFiles) {
    const filePath = path.resolve(process.cwd(), appPath, envFile);
    results[envFile] = fs.existsSync(filePath);
  }
  
  return results;
}

/**
 * Run environment validation for a specific app
 */
function validateAppEnvironment(app) {
  try {
    const appPath = path.resolve(process.cwd(), app.path);
    process.chdir(appPath);
    
    // Run the app's environment validation script
    execSync('node scripts/load-env.js', { 
      stdio: 'pipe',
      env: { ...process.env, NODE_ENV }
    });
    
    return { success: true, error: null };
  } catch (error) {
    return { 
      success: false, 
      error: error.stdout ? error.stdout.toString() : error.message 
    };
  } finally {
    // 返回根目录
    process.chdir(path.resolve(__dirname, '..'));
  }
}

/**
 * 主验证函数
 */
function main() {
  console.log(`🔍 Validating environments for all apps (${NODE_ENV})`);
  console.log('='.repeat(60));

  let allValid = true;
  const results = [];

  for (const app of apps) {
    console.log(`\n📱 Checking ${app.name} app...`);
    
    // 检查应用程序是否存在
    if (!appExists(app.path)) {
      console.log(`❌ App directory not found: ${app.path}`);
      allValid = false;
      continue;
    }

    // 检查环境文件
    const envFiles = checkEnvironmentFiles(app.path);
    console.log(`   Environment files:`);
    
    for (const [file, exists] of Object.entries(envFiles)) {
      const status = exists ? '✅' : '❌';
      console.log(`     ${status} ${file}`);
    }

    // 验证环境配置
    console.log(`   Validating configuration...`);
    const validation = validateAppEnvironment(app);
    
    if (validation.success) {
      console.log(`   ✅ ${app.name} environment is valid`);
    } else {
      console.log(`   ❌ ${app.name} environment validation failed`);
      if (validation.error) {
        console.log(`   Error: ${validation.error}`);
      }
      allValid = false;
    }

    results.push({
      app: app.name,
      path: app.path,
      port: app.port,
      envFiles,
      validation,
    });
  }

  // 摘要
  console.log('\n' + '='.repeat(60));
  console.log('📊 Validation Summary');
  console.log('='.repeat(60));

  for (const result of results) {
    const status = result.validation.success ? '✅' : '❌';
    console.log(`${status} ${result.app} (port ${result.port})`);
  }

  if (allValid) {
    console.log('\n🎉 All applications have valid environment configurations!');
    console.log('\n💡 Next steps:');
    console.log('   • Run individual apps: pnpm --filter <app-name> dev');
    console.log('   • Run all apps: pnpm dev');
    console.log('   • Build all apps: pnpm build');
  } else {
    console.log('\n❌ Some applications have environment configuration issues.');
    console.log('\n💡 To fix issues:');
    console.log('   1. Check the error messages above');
    console.log('   2. Copy .env.example to .env.development (or appropriate environment)');
    console.log('   3. Fill in the required environment variables');
    console.log('   4. Run this script again to validate');
    
    process.exit(1);
  }
}

/**
 * 生成环境设置指南
 */
function generateSetupGuide() {
  console.log('\n📚 Environment Setup Guide');
  console.log('='.repeat(40));
  
  for (const app of apps) {
    console.log(`\n${app.name.toUpperCase()} APP (${app.path})`);
    console.log('-'.repeat(20));
    console.log(`1. Copy .env.example to .env.${NODE_ENV}`);
    console.log(`2. Edit .env.${NODE_ENV} and fill in required values`);
    console.log(`3. Run: cd ${app.path} && pnpm env:validate`);
    
    if (app.name === 'hub') {
      console.log('4. Set up Clerk authentication:');
      console.log('   - Sign up at https://clerk.com');
      console.log('   - Create a new application');
      console.log('   - Copy publishable key and secret key');
      console.log('   - Add to NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY and CLERK_SECRET_KEY');
    }
  }
}

// 处理命令行参数
const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
  console.log('环境验证脚本');
  console.log('用法: node scripts/validate-environments.js [选项]');
  console.log('');
  console.log('选项:');
  console.log('  --help, -h     显示此帮助信息');
  console.log('  --guide, -g    显示环境设置指南');
  console.log('');
  console.log('环境变量:');
  console.log('  NODE_ENV       要验证的环境 (development, test, production)');
  process.exit(0);
}

if (args.includes('--guide') || args.includes('-g')) {
  generateSetupGuide();
  process.exit(0);
}

// 运行主验证
const currentFile = fileURLToPath(import.meta.url);
const scriptFile = process.argv[1];

if (currentFile === scriptFile) {
  main();
}