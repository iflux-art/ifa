#!/usr/bin/env node

import { execSync, spawn } from 'child_process';
import { writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

/**
 * 测量构建性能基准数据
 */
class BuildPerformanceMeasurer {
  constructor() {
    this.apps = ['web', 'blog', 'hub'];
    this.results = {
      timestamp: new Date().toISOString(),
      measurements: {}
    };
  }

  /**
   * 执行命令并测量时间
   */
  measureCommand(command, cwd = rootDir) {
    const startTime = Date.now();
    try {
      const output = execSync(command, { 
        cwd, 
        stdio: 'pipe',
        encoding: 'utf8',
        timeout: 300000 // 5 分钟超时
      });
      const endTime = Date.now();
      return {
        success: true,
        duration: endTime - startTime,
        output: output.toString()
      };
    } catch (error) {
      const endTime = Date.now();
      return {
        success: false,
        duration: endTime - startTime,
        error: error.message
      };
    }
  }

  /**
   * 清理构建缓存
   */
  cleanBuildCache() {
    console.log('🧹 清理构建缓存...');
    
    // 清理 Turbo 缓存
    this.measureCommand('pnpm turbo clean');
    
    // 清理各应用的构建产物
    for (const app of this.apps) {
      const appPath = join(rootDir, 'apps', app);
      if (existsSync(appPath)) {
        this.measureCommand('pnpm clean', appPath);
      }
    }
  }

  /**
   * 测量依赖安装时间
   */
  measureDependencyInstall() {
    console.log('📦 测量依赖安装时间...');
    
    // 删除 node_modules
    try {
      execSync('rmdir /s /q node_modules', { cwd: rootDir, stdio: 'ignore' });
    } catch (e) {
      // 忽略错误，可能目录不存在
    }

    // 测量根级别依赖安装
    const rootInstall = this.measureCommand('pnpm install --frozen-lockfile');
    
    this.results.measurements.dependencyInstall = {
      root: rootInstall
    };
  }

  /**
   * 测量各应用构建时间
   */
  measureAppBuilds() {
    console.log('🏗️ 测量各应用构建时间...');
    
    for (const app of this.apps) {
      console.log(`  构建 ${app} 应用...`);
      
      // 冷启动构建 (清理后的首次构建)
      this.cleanBuildCache();
      const coldBuild = this.measureCommand(`pnpm turbo build --filter=${app}`);
      
      // 热启动构建 (缓存后的重复构建)
      const hotBuild = this.measureCommand(`pnpm turbo build --filter=${app}`);
      
      // 增量构建 (修改文件后的构建)
      // 创建一个小的修改来触发增量构建
      const testFile = join(rootDir, 'apps', app, 'test-build.tmp');
      writeFileSync(testFile, '// Test file for incremental build');
      const incrementalBuild = this.measureCommand(`pnpm turbo build --filter=${app}`);
      
      // 清理测试文件
      try {
        execSync(`del "${testFile}"`, { stdio: 'ignore' });
      } catch (e) {
        // 忽略错误
      }

      this.results.measurements[app] = {
        coldBuild,
        hotBuild,
        incrementalBuild
      };
    }
  }

  /**
   * 测量并行构建性能
   */
  measureParallelBuild() {
    console.log('⚡ 测量并行构建性能...');
    
    this.cleanBuildCache();
    
    // 串行构建
    const serialBuild = this.measureCommand('pnpm turbo build --concurrency=1');
    
    this.cleanBuildCache();
    
    // 并行构建
    const parallelBuild = this.measureCommand('pnpm turbo build');
    
    this.results.measurements.parallelComparison = {
      serial: serialBuild,
      parallel: parallelBuild
    };
  }

  /**
   * 测量开发服务器启动时间
   */
  async measureDevServerStartup() {
    console.log('🚀 测量开发服务器启动时间...');
    
    for (const app of this.apps) {
      console.log(`  启动 ${app} 开发服务器...`);
      
      const startTime = Date.now();
      let serverProcess;
      
      try {
        // 启动开发服务器
        serverProcess = spawn('pnpm', ['dev'], {
          cwd: join(rootDir, 'apps', app),
          stdio: 'pipe'
        });

        // 等待服务器启动完成的信号
        const startupPromise = new Promise((resolve, reject) => {
          const timeout = setTimeout(() => {
            reject(new Error('Startup timeout'));
          }, 60000); // 60秒超时

          serverProcess.stdout.on('data', (data) => {
            const output = data.toString();
            // 检查 Next.js 启动完成的标志
            if (output.includes('Ready in') || output.includes('Local:') || output.includes('ready')) {
              clearTimeout(timeout);
              resolve(Date.now() - startTime);
            }
          });

          serverProcess.stderr.on('data', (data) => {
            const output = data.toString();
            if (output.includes('Error') || output.includes('error')) {
              clearTimeout(timeout);
              reject(new Error(output));
            }
          });
        });

        const duration = await startupPromise;
        
        this.results.measurements[`${app}DevStartup`] = {
          success: true,
          duration
        };

      } catch (error) {
        this.results.measurements[`${app}DevStartup`] = {
          success: false,
          error: error.message,
          duration: Date.now() - startTime
        };
      } finally {
        // 关闭服务器进程
        if (serverProcess) {
          serverProcess.kill();
        }
      }
    }
  }

  /**
   * 分析构建产物大小
   */
  analyzeBuildSizes() {
    console.log('📊 分析构建产物大小...');
    
    // 确保所有应用都已构建
    this.measureCommand('pnpm turbo build');
    
    for (const app of this.apps) {
      const buildDir = join(rootDir, 'apps', app, '.next');
      if (existsSync(buildDir)) {
        try {
          // 使用 PowerShell 获取目录大小
          const sizeOutput = execSync(
            `powershell -Command "(Get-ChildItem -Path '${buildDir}' -Recurse | Measure-Object -Property Length -Sum).Sum"`,
            { encoding: 'utf8' }
          );
          
          const buildSize = parseInt(sizeOutput.trim());
          
          this.results.measurements[`${app}BuildSize`] = {
            bytes: buildSize,
            mb: (buildSize / 1024 / 1024).toFixed(2)
          };
        } catch (error) {
          this.results.measurements[`${app}BuildSize`] = {
            error: error.message
          };
        }
      }
    }
  }

  /**
   * 生成性能报告
   */
  generateReport() {
    console.log('📋 生成性能报告...');
    
    const report = {
      ...this.results,
      summary: {
        totalMeasurements: Object.keys(this.results.measurements).length,
        avgColdBuildTime: this.calculateAverageBuildTime('coldBuild'),
        avgHotBuildTime: this.calculateAverageBuildTime('hotBuild'),
        parallelSpeedup: this.calculateParallelSpeedup(),
        totalBuildSize: this.calculateTotalBuildSize()
      }
    };

    return report;
  }

  /**
   * 计算平均构建时间
   */
  calculateAverageBuildTime(buildType) {
    const times = this.apps
      .map(app => this.results.measurements[app]?.[buildType]?.duration)
      .filter(time => time && typeof time === 'number');
    
    if (times.length === 0) return null;
    
    return Math.round(times.reduce((sum, time) => sum + time, 0) / times.length);
  }

  /**
   * 计算并行构建加速比
   */
  calculateParallelSpeedup() {
    const parallel = this.results.measurements.parallelComparison;
    if (!parallel?.serial?.duration || !parallel?.parallel?.duration) {
      return null;
    }
    
    return (parallel.serial.duration / parallel.parallel.duration).toFixed(2);
  }

  /**
   * 计算总构建大小
   */
  calculateTotalBuildSize() {
    const sizes = this.apps
      .map(app => this.results.measurements[`${app}BuildSize`]?.bytes)
      .filter(size => size && typeof size === 'number');
    
    if (sizes.length === 0) return null;
    
    const totalBytes = sizes.reduce((sum, size) => sum + size, 0);
    return {
      bytes: totalBytes,
      mb: (totalBytes / 1024 / 1024).toFixed(2)
    };
  }

  /**
   * 运行完整的性能测量
   */
  async run() {
    console.log('🚀 开始构建性能基准测量...\n');

    try {
      // 注意: 开发服务器测量可能不稳定，暂时跳过
      // await this.measureDevServerStartup();
      
      this.measureDependencyInstall();
      this.measureAppBuilds();
      this.measureParallelBuild();
      this.analyzeBuildSizes();

      const report = this.generateReport();
      
      // 保存报告
      const reportPath = join(rootDir, '.kiro/specs/monorepo-code-optimization/build-performance-baseline.json');
      writeFileSync(reportPath, JSON.stringify(report, null, 2));

      console.log('\n✅ 性能测量完成！');
      console.log(`📄 报告已保存到: ${reportPath}`);
      
      return report;
    } catch (error) {
      console.error('❌ 性能测量失败:', error.message);
      throw error;
    }
  }
}

// 运行性能测量
const measurer = new BuildPerformanceMeasurer();
measurer.run().then(report => {
  console.log('\n📊 性能摘要:');
  if (report.summary.avgColdBuildTime) {
    console.log(`- 平均冷启动构建时间: ${(report.summary.avgColdBuildTime / 1000).toFixed(1)}s`);
  }
  if (report.summary.avgHotBuildTime) {
    console.log(`- 平均热启动构建时间: ${(report.summary.avgHotBuildTime / 1000).toFixed(1)}s`);
  }
  if (report.summary.parallelSpeedup) {
    console.log(`- 并行构建加速比: ${report.summary.parallelSpeedup}x`);
  }
  if (report.summary.totalBuildSize) {
    console.log(`- 总构建大小: ${report.summary.totalBuildSize.mb} MB`);
  }
}).catch(console.error);