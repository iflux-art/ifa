#!/usr/bin/env node

/**
 * 博客应用程序环境加载脚本
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

// 验证博客应用程序所需的环境变量
function validateBlogAppEnvironment() {
  const required = ['NODE_ENV'];
  const missing = [];

  for (const key of required) {
    if (!process.env[key]) {
      missing.push(key);
    }
  }

  // 环境特定的验证
  if (NODE_ENV === 'production') {
    const productionRequired = ['JWT_SECRET', 'NEXT_PUBLIC_APP_URL'];
    for (const key of productionRequired) {
      if (!process.env[key]) {
        missing.push(key);
      }
    }
  }

  return missing;
}

// 主执行函数
function main() {
  console.log(`📝 正在为博客应用程序加载环境 (${NODE_ENV})`);
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
  const missing = validateBlogAppEnvironment();
  
  if (missing.length > 0) {
    console.log('\n❌ 缺少必需的环境变量:');
    missing.forEach(key => console.log(`   • ${key}`));
    console.log('\n💡 请检查您的环境配置文件:');
    envFiles.forEach(file => console.log(`   • ${file}`));
    process.exit(1);
  }

  console.log('\n✅ 环境验证通过');
  
  // 显示加载的配置（仅安全值）
  console.log('\n📋 已加载的配置:');
  console.log(`   NODE_ENV: ${process.env.NODE_ENV}`);
  console.log(`   PORT: ${process.env.PORT || '3001'}`);
  console.log(`   APP_NAME: ${process.env.NEXT_PUBLIC_APP_NAME || 'Blog App'}`);
  console.log(`   APP_URL: ${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'}`);
  
  // 博客特定配置
  console.log('\n📖 博客配置:');
  console.log(`   评论: ${process.env.NEXT_PUBLIC_ENABLE_COMMENTS || 'true'}`);
  console.log(`   搜索: ${process.env.NEXT_PUBLIC_ENABLE_SEARCH || 'true'}`);
  console.log(`   标签: ${process.env.NEXT_PUBLIC_ENABLE_TAGS || 'true'}`);
  console.log(`   分类: ${process.env.NEXT_PUBLIC_ENABLE_CATEGORIES || 'true'}`);
  console.log(`   每页文章数: ${process.env.NEXT_PUBLIC_POSTS_PER_PAGE || '10'}`);
  
  
  // 功能标志
  console.log('\n🚩 功能标志:');
  console.log(`   React Compiler: ${process.env.NEXT_PUBLIC_ENABLE_REACT_COMPILER || 'true'}`);
  console.log(`   PPR: ${process.env.NEXT_PUBLIC_ENABLE_PPR || 'true'}`);
  console.log(`   ISR: ${process.env.ENABLE_ISR || 'true'}`);
  
  console.log('\n🎉 博客应用程序环境加载成功!');
}

// 如果直接调用则运行
const currentFile = fileURLToPath(import.meta.url);
const scriptFile = process.argv[1];

if (currentFile === scriptFile) {
  main();
}

export { loadEnvironmentFiles, validateBlogAppEnvironment };