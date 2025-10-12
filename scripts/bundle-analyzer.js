#!/usr/bin/env node

/**
 * Bundle 分析工具
 * 用于分析各个应用的 bundle 大小和组成
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const APPS = ['web', 'blog', 'hub'];

/**
 * 运行 bundle 分析
 * @param {string} appName 应用名称
 */
function analyzeBundleForApp(appName) {
  const appPath = path.join(process.cwd(), 'apps', appName);
  
  if (!fs.existsSync(appPath)) {
    console.log(`❌ 应用 ${appName} 不存在`);
    return;
  }

  console.log(`🔍 分析 ${appName} 应用的 bundle...`);
  
  try {
    // 构建应用
    execSync(`cd ${appPath} && pnpm build`, { stdio: 'inherit' });
    
    // 分析 bundle
    const nextBuildDir = path.join(appPath, '.next');
    if (fs.existsSync(nextBuildDir)) {
      console.log(`📊 ${appName} 构建完成，分析结果：`);
      
      // 读取构建清单
      const buildManifestPath = path.join(nextBuildDir, 'build-manifest.json');
      if (fs.existsSync(buildManifestPath)) {
        const buildManifest = JSON.parse(fs.readFileSync(buildManifestPath, 'utf8'));
        
        console.log(`\n📦 ${appName} Bundle 信息:`);
        console.log('Pages:', Object.keys(buildManifest.pages).length);
        
        // 分析静态文件大小
        const staticDir = path.join(nextBuildDir, 'static');
        if (fs.existsSync(staticDir)) {
          const chunks = fs.readdirSync(path.join(staticDir, 'chunks'), { withFileTypes: true })
            .filter(dirent => dirent.isFile() && dirent.name.endsWith('.js'))
            .map(dirent => {
              const filePath = path.join(staticDir, 'chunks', dirent.name);
              const stats = fs.statSync(filePath);
              return {
                name: dirent.name,
                size: stats.size,
                sizeKB: Math.round(stats.size / 1024 * 100) / 100
              };
            })
            .sort((a, b) => b.size - a.size);
          
          console.log('\n🎯 主要 Chunks:');
          chunks.slice(0, 10).forEach(chunk => {
            console.log(`  ${chunk.name}: ${chunk.sizeKB} KB`);
          });
          
          const totalSize = chunks.reduce((sum, chunk) => sum + chunk.size, 0);
          console.log(`\n📏 总 JS 大小: ${Math.round(totalSize / 1024 * 100) / 100} KB`);
        }
      }
    }
    
    console.log(`✅ ${appName} 分析完成\n`);
  } catch (error) {
    console.error(`❌ 分析 ${appName} 时出错:`, error.message);
  }
}

/**
 * 生成性能报告
 */
function generatePerformanceReport() {
  const reportPath = path.join(process.cwd(), 'bundle-analysis-report.md');
  const timestamp = new Date().toISOString();
  
  let report = `# Bundle 分析报告\n\n生成时间: ${timestamp}\n\n`;
  
  APPS.forEach(appName => {
    const appPath = path.join(process.cwd(), 'apps', appName);
    const nextBuildDir = path.join(appPath, '.next');
    
    if (fs.existsSync(nextBuildDir)) {
      report += `## ${appName.toUpperCase()} 应用\n\n`;
      
      const buildManifestPath = path.join(nextBuildDir, 'build-manifest.json');
      if (fs.existsSync(buildManifestPath)) {
        const buildManifest = JSON.parse(fs.readFileSync(buildManifestPath, 'utf8'));
        
        report += `- 页面数量: ${Object.keys(buildManifest.pages).length}\n`;
        
        const staticDir = path.join(nextBuildDir, 'static');
        if (fs.existsSync(staticDir)) {
          const chunksDir = path.join(staticDir, 'chunks');
          if (fs.existsSync(chunksDir)) {
            const chunks = fs.readdirSync(chunksDir, { withFileTypes: true })
              .filter(dirent => dirent.isFile() && dirent.name.endsWith('.js'))
              .map(dirent => {
                const filePath = path.join(chunksDir, dirent.name);
                const stats = fs.statSync(filePath);
                return {
                  name: dirent.name,
                  size: stats.size,
                  sizeKB: Math.round(stats.size / 1024 * 100) / 100
                };
              });
            
            const totalSize = chunks.reduce((sum, chunk) => sum + chunk.size, 0);
            report += `- 总 JS 大小: ${Math.round(totalSize / 1024 * 100) / 100} KB\n`;
            report += `- Chunk 数量: ${chunks.length}\n`;
            
            const largestChunks = chunks.sort((a, b) => b.size - a.size).slice(0, 5);
            report += `- 最大的 5 个 Chunks:\n`;
            largestChunks.forEach(chunk => {
              report += `  - ${chunk.name}: ${chunk.sizeKB} KB\n`;
            });
          }
        }
      }
      
      report += '\n';
    }
  });
  
  // 添加优化建议
  report += `## 优化建议\n\n`;
  report += `1. **代码分割**: 确保路由级和组件级代码分割正常工作\n`;
  report += `2. **Tree Shaking**: 检查未使用的代码是否被正确移除\n`;
  report += `3. **Bundle 大小**: 监控 bundle 大小变化，避免意外增长\n`;
  report += `4. **缓存策略**: 确保静态资源缓存策略配置正确\n`;
  report += `5. **第三方库**: 考虑使用更轻量的替代方案\n\n`;
  
  fs.writeFileSync(reportPath, report);
  console.log(`📋 性能报告已生成: ${reportPath}`);
}

// 主函数
function main() {
  const args = process.argv.slice(2);
  const appName = args[0];
  
  if (appName && APPS.includes(appName)) {
    analyzeBundleForApp(appName);
  } else if (appName === 'all' || !appName) {
    console.log('🚀 开始分析所有应用的 bundle...\n');
    APPS.forEach(analyzeBundleForApp);
    generatePerformanceReport();
  } else {
    console.log('❌ 无效的应用名称');
    console.log('用法: node scripts/bundle-analyzer.js [app-name|all]');
    console.log('可用的应用:', APPS.join(', '));
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  analyzeBundleForApp,
  generatePerformanceReport
};