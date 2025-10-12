#!/usr/bin/env node

/**
 * Hub应用程序环境加载脚本
 * 此脚本根据NODE_ENV加载相应的环境文件
 */

import fs from 'fs';
import path from 'path';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 获取当前环境
const NODE_ENV = process.env.NODE_ENV || 'development';

// 按优先级定义环境文件路径
const envFiles = [
  `.env.${NODE_ENV}.local`,
  `.env.local`,
  `.env.${NODE_ENV}`,
  '.env',
];

// 加载环境文件
function loadEnvironmentFiles() {
  const loadedFiles = [];
  const errors = [];

  for (const envFile of envFiles) {
    const envPath = path.resolve(process.cwd(), envFile);
    
    if (fs.existsSync(envPath)) {
      try {
        const result = config({ path: envPath });
        if (result.error) {
          errors.push(`加载 ${envFile} 时出错: ${result.error.message}`);
        } else {
          loadedFiles.push(envFile);
          console.log(`✅ 已加载环境文件: ${envFile}`);
        }
      } catch (error) {
        errors.push(`加载 ${envFile} 时出错: ${error.message}`);
      }
    }
  }

  return { loadedFiles, errors };
}

// 验证Hub应用程序所需的环境变量
function validateHubAppEnvironment() {
  const required = ['NODE_ENV'];
  const missing = [];

  for (const key of required) {
    if (!process.env[key]) {
      missing.push(key);
    }
  }

  // 环境特定的验证
  if (NODE_ENV === 'production') {
    const productionRequired = [
      'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
      'CLERK_SECRET_KEY',
      'NEXT_PUBLIC_APP_URL'
    ];
    for (const key of productionRequired) {
      if (!process.env[key]) {
        missing.push(key);
      }
    }
  } else if (NODE_ENV === 'development') {
    // 开发环境需要Clerk密钥进行身份验证
    const devRequired = ['NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY', 'CLERK_SECRET_KEY'];
    for (const key of devRequired) {
      if (!process.env[key]) {
        missing.push(key);
      }
    }
  }

  return missing;
}

// 主执行函数
function main() {
  console.log(`🏢 正在为Hub应用程序加载环境 (${NODE_ENV})`);
  console.log('='.repeat(50));

  // 加载环境文件
  const { loadedFiles, errors } = loadEnvironmentFiles();

  if (loadedFiles.length === 0) {
    console.log('⚠️  未找到环境文件，仅使用系统环境变量');
  }

  if (errors.length > 0) {
    console.log('\n❌ 加载环境文件时出错:');
    errors.forEach(error => console.log(`   • ${error}`));
  }

  // 验证环境
  const missing = validateHubAppEnvironment();
  
  if (missing.length > 0) {
    console.log('\n❌ 缺少必需的环境变量:');
    missing.forEach(key => console.log(`   • ${key}`));
    console.log('\n💡 请检查您的环境配置文件:');
    envFiles.forEach(file => console.log(`   • ${file}`));
    
    if (missing.includes('NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY') || missing.includes('CLERK_SECRET_KEY')) {
      console.log('\n🔐 Clerk身份验证设置要求:');
      console.log('   1. 在 https://clerk.com 注册');
      console.log('   2. 创建一个新应用程序');
      console.log('   3. 复制您的发布密钥和秘密密钥');
      console.log('   4. 将它们添加到您的环境文件中');
    }
    
    process.exit(1);
  }

  console.log('\n✅ 环境验证通过');
  
  // 显示加载的配置（仅安全值）
  console.log('\n📋 已加载的配置:');
  console.log(`   NODE_ENV: ${process.env.NODE_ENV}`);
  console.log(`   PORT: ${process.env.PORT || '3002'}`);
  console.log(`   APP_NAME: ${process.env.NEXT_PUBLIC_APP_NAME || 'Hub App'}`);
  console.log(`   APP_URL: ${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3002'}`);
  
  // 身份验证配置
  console.log('\n🔐 身份验证配置:');
  const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  console.log(`   Clerk密钥: ${clerkKey ? clerkKey.substring(0, 20) + '...' : '未设置'}`);
  console.log(`   登录URL: ${process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL || '/sign-in'}`);
  console.log(`   注册URL: ${process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL || '/sign-up'}`);
  
  // Hub特定配置
  console.log('\n🏢 Hub配置:');
  console.log(`   管理面板: ${process.env.NEXT_PUBLIC_ENABLE_ADMIN_PANEL || 'true'}`);
  console.log(`   用户管理: ${process.env.NEXT_PUBLIC_ENABLE_USER_MANAGEMENT || 'true'}`);
  console.log(`   分析仪表板: ${process.env.NEXT_PUBLIC_ENABLE_ANALYTICS_DASHBOARD || 'true'}`);
  console.log(`   通知: ${process.env.NEXT_PUBLIC_ENABLE_NOTIFICATIONS || 'true'}`);
  
  // 文件上传配置
  console.log('\n📁 文件上传配置:');
  console.log(`   存储提供者: ${process.env.STORAGE_PROVIDER || 'local'}`);
  console.log(`   最大文件大小: ${process.env.MAX_FILE_SIZE || '10485760'} 字节`);
  
  // 功能标志
  console.log('\n🚩 功能标志:');
  console.log(`   React Compiler: ${process.env.NEXT_PUBLIC_ENABLE_REACT_COMPILER || 'true'}`);
  console.log(`   PPR: ${process.env.NEXT_PUBLIC_ENABLE_PPR || 'true'}`);
  console.log(`   Turbopack: ${process.env.NEXT_PUBLIC_ENABLE_TURBOPACK || 'true'}`);
  
  console.log('\n🎉 Hub应用程序环境加载成功!');
}

// 如果直接调用则运行
const currentFile = fileURLToPath(import.meta.url);
const scriptFile = process.argv[1];

if (currentFile === scriptFile) {
  main();
}

export { loadEnvironmentFiles, validateHubAppEnvironment };