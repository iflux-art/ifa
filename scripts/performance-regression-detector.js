#!/usr/bin/env node

/**
 * 性能回归检测工具
 * 分析构建产物并检测性能回归
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * 性能阈值配置
 */
const PERFORMANCE_THRESHOLDS = {
  // Bundle 大小阈值 (KB)
  bundleSize: {
    warning: 500,
    error: 1000,
  },
  
  // Chunk 数量阈值
  chunkCount: {
    warning: 20,
    error: 50,
  },
  
  // 单个 Chunk 大小阈值 (KB)
  chunkSize: {
    warning: 200,
    error: 500,
  },
  
  // 构建时间阈值 (秒)
  buildTime: {
    warning: 60,
    error: 120,
  },
  
  // 回归检测阈值 (百分比增长)
  regression: {
    bundleSize: 10,    // 10% 增长
    chunkCount: 20,    // 20% 增长
    buildTime: 15,     // 15% 增长
  },
};

/**
 * 性能数据收集器
 */
class PerformanceCollector {
  constructor(appName) {
    this.appName = appName;
    this.appPath = path.join(process.cwd(), 'apps', appName);
    this.buildPath = path.join(this.appPath, '.next');
    this.dataPath = path.join(process.cwd(), '.performance-data');
    
    // 确保数据目录存在
    if (!fs.existsSync(this.dataPath)) {
      fs.mkdirSync(this.dataPath, { recursive: true });
    }
  }
  
  /**
   * 收集构建性能数据
   */
  async collectBuildMetrics() {
    console.log(`📊 收集 ${this.appName} 的构建性能数据...`);
    
    const startTime = Date.now();
    
    try {
      // 执行构建
      execSync(`cd ${this.appPath} && pnpm build`, { stdio: 'pipe' });
      
      const buildTime = (Date.now() - startTime) / 1000;
      
      // 分析构建产物
      const bundleMetrics = this.analyzeBundleSize();
      const chunkMetrics = this.analyzeChunks();
      
      const metrics = {
        timestamp: Date.now(),
        appName: this.appName,
        buildTime,
        bundleSize: bundleMetrics.totalSize,
        bundleGzipSize: bundleMetrics.gzipSize,
        chunkCount: chunkMetrics.count,
        chunks: chunkMetrics.chunks,
        largestChunk: chunkMetrics.largest,
        git: this.getGitInfo(),
      };
      
      // 保存数据
      this.saveMetrics(metrics);
      
      return metrics;
    } catch (error) {
      console.error(`❌ 构建 ${this.appName} 失败:`, error.message);
      throw error;
    }
  }
  
  /**
   * 分析 Bundle 大小
   */
  analyzeBundleSize() {
    const staticPath = path.join(this.buildPath, 'static');
    
    if (!fs.existsSync(staticPath)) {
      return { totalSize: 0, gzipSize: 0 };
    }
    
    let totalSize = 0;
    let gzipSize = 0;
    
    const walkDir = (dir) => {
      const files = fs.readdirSync(dir);
      
      files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
          walkDir(filePath);
        } else if (file.endsWith('.js') || file.endsWith('.css')) {
          totalSize += stat.size;
          
          // 估算 Gzip 大小 (通常是原始大小的 30-40%)
          gzipSize += Math.round(stat.size * 0.35);
        }
      });
    };
    
    walkDir(staticPath);
    
    return {
      totalSize: Math.round(totalSize / 1024), // KB
      gzipSize: Math.round(gzipSize / 1024),   // KB
    };
  }
  
  /**
   * 分析 Chunks
   */
  analyzeChunks() {
    const chunksPath = path.join(this.buildPath, 'static', 'chunks');
    
    if (!fs.existsSync(chunksPath)) {
      return { count: 0, chunks: [], largest: null };
    }
    
    const chunks = [];
    const files = fs.readdirSync(chunksPath);
    
    files.forEach(file => {
      if (file.endsWith('.js')) {
        const filePath = path.join(chunksPath, file);
        const stat = fs.statSync(filePath);
        
        chunks.push({
          name: file,
          size: Math.round(stat.size / 1024), // KB
          path: filePath,
        });
      }
    });
    
    // 按大小排序
    chunks.sort((a, b) => b.size - a.size);
    
    return {
      count: chunks.length,
      chunks,
      largest: chunks[0] || null,
    };
  }
  
  /**
   * 获取 Git 信息
   */
  getGitInfo() {
    try {
      const commit = execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();
      const branch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
      const message = execSync('git log -1 --pretty=%B', { encoding: 'utf8' }).trim();
      
      return { commit, branch, message };
    } catch (error) {
      return { commit: 'unknown', branch: 'unknown', message: 'unknown' };
    }
  }
  
  /**
   * 保存性能数据
   */
  saveMetrics(metrics) {
    const filename = `${this.appName}-${Date.now()}.json`;
    const filepath = path.join(this.dataPath, filename);
    
    fs.writeFileSync(filepath, JSON.stringify(metrics, null, 2));
    
    // 保存最新数据的引用
    const latestPath = path.join(this.dataPath, `${this.appName}-latest.json`);
    fs.writeFileSync(latestPath, JSON.stringify(metrics, null, 2));
    
    console.log(`💾 性能数据已保存: ${filepath}`);
  }
  
  /**
   * 获取历史数据
   */
  getHistoricalData(limit = 10) {
    const files = fs.readdirSync(this.dataPath)
      .filter(file => file.startsWith(`${this.appName}-`) && file.endsWith('.json') && !file.includes('latest'))
      .sort()
      .slice(-limit);
    
    return files.map(file => {
      const filepath = path.join(this.dataPath, file);
      return JSON.parse(fs.readFileSync(filepath, 'utf8'));
    });
  }
}

/**
 * 性能回归检测器
 */
class RegressionDetector {
  constructor() {
    this.dataPath = path.join(process.cwd(), '.performance-data');
  }
  
  /**
   * 检测性能回归
   */
  detectRegressions(appName) {
    console.log(`🔍 检测 ${appName} 的性能回归...`);
    
    const collector = new PerformanceCollector(appName);
    const history = collector.getHistoricalData(5); // 获取最近5次数据
    
    if (history.length < 2) {
      console.log('📊 历史数据不足，无法进行回归检测');
      return { hasRegression: false, issues: [] };
    }
    
    const latest = history[history.length - 1];
    const previous = history[history.length - 2];
    
    const issues = [];
    
    // 检测 Bundle 大小回归
    const bundleSizeIncrease = ((latest.bundleSize - previous.bundleSize) / previous.bundleSize) * 100;
    if (bundleSizeIncrease > PERFORMANCE_THRESHOLDS.regression.bundleSize) {
      issues.push({
        type: 'bundle-size-regression',
        severity: 'warning',
        message: `Bundle 大小增长 ${bundleSizeIncrease.toFixed(1)}% (${previous.bundleSize}KB → ${latest.bundleSize}KB)`,
        current: latest.bundleSize,
        previous: previous.bundleSize,
        increase: bundleSizeIncrease,
      });
    }
    
    // 检测 Chunk 数量回归
    const chunkCountIncrease = ((latest.chunkCount - previous.chunkCount) / previous.chunkCount) * 100;
    if (chunkCountIncrease > PERFORMANCE_THRESHOLDS.regression.chunkCount) {
      issues.push({
        type: 'chunk-count-regression',
        severity: 'warning',
        message: `Chunk 数量增长 ${chunkCountIncrease.toFixed(1)}% (${previous.chunkCount} → ${latest.chunkCount})`,
        current: latest.chunkCount,
        previous: previous.chunkCount,
        increase: chunkCountIncrease,
      });
    }
    
    // 检测构建时间回归
    const buildTimeIncrease = ((latest.buildTime - previous.buildTime) / previous.buildTime) * 100;
    if (buildTimeIncrease > PERFORMANCE_THRESHOLDS.regression.buildTime) {
      issues.push({
        type: 'build-time-regression',
        severity: 'warning',
        message: `构建时间增长 ${buildTimeIncrease.toFixed(1)}% (${previous.buildTime.toFixed(1)}s → ${latest.buildTime.toFixed(1)}s)`,
        current: latest.buildTime,
        previous: previous.buildTime,
        increase: buildTimeIncrease,
      });
    }
    
    // 检测绝对阈值
    if (latest.bundleSize > PERFORMANCE_THRESHOLDS.bundleSize.error) {
      issues.push({
        type: 'bundle-size-threshold',
        severity: 'error',
        message: `Bundle 大小超过错误阈值 (${latest.bundleSize}KB > ${PERFORMANCE_THRESHOLDS.bundleSize.error}KB)`,
        current: latest.bundleSize,
        threshold: PERFORMANCE_THRESHOLDS.bundleSize.error,
      });
    } else if (latest.bundleSize > PERFORMANCE_THRESHOLDS.bundleSize.warning) {
      issues.push({
        type: 'bundle-size-threshold',
        severity: 'warning',
        message: `Bundle 大小超过警告阈值 (${latest.bundleSize}KB > ${PERFORMANCE_THRESHOLDS.bundleSize.warning}KB)`,
        current: latest.bundleSize,
        threshold: PERFORMANCE_THRESHOLDS.bundleSize.warning,
      });
    }
    
    return {
      hasRegression: issues.length > 0,
      issues,
      latest,
      previous,
    };
  }
  
  /**
   * 生成回归报告
   */
  generateRegressionReport(appName) {
    const result = this.detectRegressions(appName);
    
    let report = `# ${appName.toUpperCase()} 性能回归检测报告\\n\\n`;
    report += `生成时间: ${new Date().toISOString()}\\n\\n`;
    
    if (!result.hasRegression) {
      report += `✅ 未检测到性能回归\\n\\n`;
    } else {
      report += `⚠️  检测到 ${result.issues.length} 个性能问题\\n\\n`;
      
      result.issues.forEach((issue, index) => {
        const emoji = issue.severity === 'error' ? '❌' : '⚠️';
        report += `${emoji} **问题 ${index + 1}**: ${issue.message}\\n`;
        report += `   - 类型: ${issue.type}\\n`;
        report += `   - 严重程度: ${issue.severity}\\n\\n`;
      });
    }
    
    if (result.latest) {
      report += `## 当前构建指标\\n\\n`;
      report += `- Bundle 大小: ${result.latest.bundleSize} KB\\n`;
      report += `- Gzip 大小: ${result.latest.bundleGzipSize} KB\\n`;
      report += `- Chunk 数量: ${result.latest.chunkCount}\\n`;
      report += `- 构建时间: ${result.latest.buildTime.toFixed(1)}s\\n`;
      report += `- Git 提交: ${result.latest.git.commit.substring(0, 8)}\\n`;
      report += `- Git 分支: ${result.latest.git.branch}\\n\\n`;
    }
    
    report += `## 建议\\n\\n`;
    if (result.hasRegression) {
      report += `1. 检查最近的代码更改是否引入了不必要的依赖\\n`;
      report += `2. 运行 bundle 分析工具查看具体的大小增长原因\\n`;
      report += `3. 考虑使用代码分割和懒加载优化\\n`;
      report += `4. 检查是否有重复的依赖或未使用的代码\\n`;
    } else {
      report += `1. 继续保持良好的性能优化实践\\n`;
      report += `2. 定期监控性能指标\\n`;
      report += `3. 在添加新功能时注意性能影响\\n`;
    }
    
    return report;
  }
}

/**
 * 主函数
 */
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  const appName = args[1];
  
  const apps = ['web', 'blog', 'hub'];
  
  if (command === 'collect') {
    if (appName && apps.includes(appName)) {
      const collector = new PerformanceCollector(appName);
      await collector.collectBuildMetrics();
    } else if (appName === 'all' || !appName) {
      for (const app of apps) {
        try {
          const collector = new PerformanceCollector(app);
          await collector.collectBuildMetrics();
        } catch (error) {
          console.error(`收集 ${app} 性能数据失败:`, error.message);
        }
      }
    } else {
      console.error('无效的应用名称');
      process.exit(1);
    }
  } else if (command === 'detect') {
    const detector = new RegressionDetector();
    
    if (appName && apps.includes(appName)) {
      const report = detector.generateRegressionReport(appName);
      console.log(report);
      
      // 保存报告
      const reportPath = path.join(process.cwd(), `${appName}-regression-report.md`);
      fs.writeFileSync(reportPath, report);
      console.log(`\\n📋 回归报告已保存: ${reportPath}`);
    } else if (appName === 'all' || !appName) {
      for (const app of apps) {
        console.log(`\\n${'='.repeat(50)}`);
        console.log(`检测 ${app.toUpperCase()} 应用`);
        console.log('='.repeat(50));
        
        const report = detector.generateRegressionReport(app);
        console.log(report);
        
        const reportPath = path.join(process.cwd(), `${app}-regression-report.md`);
        fs.writeFileSync(reportPath, report);
      }
    }
  } else {
    console.log('用法:');
    console.log('  node scripts/performance-regression-detector.js collect [app-name|all]');
    console.log('  node scripts/performance-regression-detector.js detect [app-name|all]');
    console.log('');
    console.log('可用的应用:', apps.join(', '));
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch(error => {
    console.error('执行失败:', error);
    process.exit(1);
  });
}

module.exports = {
  PerformanceCollector,
  RegressionDetector,
  PERFORMANCE_THRESHOLDS,
};