#!/usr/bin/env node

/**
 * 增强的依赖分析器
 * 
 * 此脚本提供全面的依赖分析功能，包括：
 * - 未使用依赖检测
 * - 重复依赖识别
 * - 版本冲突分析
 * - 优化建议生成
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { execSync } from 'child_process';
import fastGlob from 'fast-glob';
import path from 'path';

class EnhancedDependencyAnalyzer {
  constructor() {
    this.packageFiles = [];
    this.dependencies = new Map();
    this.devDependencies = new Map();
    this.unusedDeps = new Map();
    this.versionConflicts = new Map();
    this.duplicateDeps = new Map();
    this.optimizationSuggestions = [];
  }

  /**
   * 扫描单体仓库中的所有 package.json 文件
   */
  async scanPackageFiles() {
    const patterns = [
      'package.json',
      'apps/*/package.json',
      'packages/*/package.json'
    ];

    for (const pattern of patterns) {
      const files = await fastGlob(pattern);
      this.packageFiles.push(...files);
    }

    console.log(`📦 Found ${this.packageFiles.length} package.json files`);
    return this.packageFiles;
  }

  /**
   * 分析依赖关系及其版本
   */
  analyzeDependencies() {
    console.log('🔍 Analyzing dependencies...');
    
    for (const file of this.packageFiles) {
      try {
        const content = JSON.parse(readFileSync(file, 'utf8'));
        const packageName = content.name || path.dirname(file);

        // 分析常规依赖
        if (content.dependencies) {
          for (const [dep, version] of Object.entries(content.dependencies)) {
            if (!this.dependencies.has(dep)) {
              this.dependencies.set(dep, new Map());
            }
            this.dependencies.get(dep).set(packageName, { version, file });
          }
        }

        // 分析开发依赖
        if (content.devDependencies) {
          for (const [dep, version] of Object.entries(content.devDependencies)) {
            if (!this.devDependencies.has(dep)) {
              this.devDependencies.set(dep, new Map());
            }
            this.devDependencies.get(dep).set(packageName, { version, file });
          }
        }
      } catch (error) {
        console.warn(`⚠️  Failed to parse ${file}: ${error.message}`);
      }
    }
  }

  /**
   * 检测未使用的依赖
   */
  async detectUnusedDependencies() {
    console.log('🔍 Detecting unused dependencies...');
    
    for (const file of this.packageFiles) {
      const packageDir = path.dirname(file);
      const packageName = this.getPackageName(file);
      
      try {
        // 跳过根目录的 package.json，因为它主要用于工具配置
        if (file === 'package.json') {
          continue;
        }

        console.log(`  Checking ${packageName}...`);
        
        // 运行 depcheck 来检测未使用的依赖
        const result = execSync('pnpm dlx depcheck --json', {
          cwd: packageDir,
          encoding: 'utf8',
          stdio: 'pipe'
        });
        
        const depcheckResult = JSON.parse(result);
        
        if (depcheckResult.dependencies?.length > 0 || depcheckResult.devDependencies?.length > 0) {
          this.unusedDeps.set(packageName, {
            file,
            unused: depcheckResult.dependencies || [],
            unusedDev: depcheckResult.devDependencies || [],
            missing: depcheckResult.missing || {}
          });
        }
        
      } catch (error) {
        console.warn(`⚠️  Failed to check unused dependencies for ${packageName}: ${error.message}`);
      }
    }
  }

  /**
   * 查找重复依赖
   */
  findDuplicateDependencies() {
    console.log('🔍 Finding duplicate dependencies...');
    
    // 检查常规依赖中的重复
    for (const [dep, packages] of this.dependencies.entries()) {
      if (packages.size > 1) {
        const versions = new Set();
        const packageList = [];
        
        for (const [pkg, info] of packages.entries()) {
          versions.add(info.version);
          packageList.push({ package: pkg, version: info.version, file: info.file });
        }
        
        this.duplicateDeps.set(dep, {
          type: 'dependencies',
          packages: packageList,
          versions: Array.from(versions),
          hasVersionConflict: versions.size > 1
        });
      }
    }

    // 检查开发依赖中的重复
    for (const [dep, packages] of this.devDependencies.entries()) {
      if (packages.size > 1) {
        const versions = new Set();
        const packageList = [];
        
        for (const [pkg, info] of packages.entries()) {
          versions.add(info.version);
          packageList.push({ package: pkg, version: info.version, file: info.file });
        }
        
        // 如果已经在常规依赖中，则合并信息
        if (this.duplicateDeps.has(dep)) {
          const existing = this.duplicateDeps.get(dep);
          existing.packages.push(...packageList);
          existing.versions = [...new Set([...existing.versions, ...Array.from(versions)])];
          existing.hasVersionConflict = existing.versions.length > 1;
          existing.type = 'both';
        } else {
          this.duplicateDeps.set(dep, {
            type: 'devDependencies',
            packages: packageList,
            versions: Array.from(versions),
            hasVersionConflict: versions.size > 1
          });
        }
      }
    }
  }

  /**
   * 查找版本冲突
   */
  findVersionConflicts() {
    console.log('🔍 Finding version conflicts...');
    
    for (const [dep, info] of this.duplicateDeps.entries()) {
      if (info.hasVersionConflict) {
        this.versionConflicts.set(dep, {
          versions: info.versions,
          packages: info.packages,
          type: info.type
        });
      }
    }
  }

  /**
   * 生成优化建议
   */
  generateOptimizationSuggestions() {
    console.log('💡 Generating optimization suggestions...');
    
    this.optimizationSuggestions = [];

    // 1. 未使用依赖清理建议
    for (const [packageName, unusedInfo] of this.unusedDeps.entries()) {
      if (unusedInfo.unused.length > 0) {
        this.optimizationSuggestions.push({
          type: 'remove-unused-dependencies',
          priority: 'high',
          package: packageName,
          file: unusedInfo.file,
          dependencies: unusedInfo.unused,
          action: `Remove ${unusedInfo.unused.length} unused dependencies`,
          impact: 'Reduces bundle size and installation time'
        });
      }
      
      if (unusedInfo.unusedDev.length > 0) {
        this.optimizationSuggestions.push({
          type: 'remove-unused-dev-dependencies',
          priority: 'medium',
          package: packageName,
          file: unusedInfo.file,
          dependencies: unusedInfo.unusedDev,
          action: `Remove ${unusedInfo.unusedDev.length} unused dev dependencies`,
          impact: 'Reduces development environment setup time'
        });
      }
    }

    // 2. 版本统一建议
    for (const [dep, conflict] of this.versionConflicts.entries()) {
      const latestVersion = this.getLatestVersion(conflict.versions);
      this.optimizationSuggestions.push({
        type: 'unify-versions',
        priority: 'high',
        dependency: dep,
        currentVersions: conflict.versions,
        recommendedVersion: latestVersion,
        affectedPackages: conflict.packages.map(p => p.package),
        action: `Unify ${dep} to version ${latestVersion}`,
        impact: 'Prevents version conflicts and reduces bundle duplication'
      });
    }

    // 3. 依赖提升建议（移动到根目录）
    const commonDeps = this.findCommonDependencies();
    for (const dep of commonDeps) {
      const depInfo = this.duplicateDeps.get(dep);
      if (depInfo && !depInfo.hasVersionConflict && depInfo.packages.length >= 2) {
        this.optimizationSuggestions.push({
          type: 'move-to-root',
          priority: 'medium',
          dependency: dep,
          currentPackages: depInfo.packages.map(p => p.package),
          action: `Move ${dep} to root package.json`,
          impact: 'Reduces duplication and ensures version consistency'
        });
      }
    }

    // 4. 缺失依赖建议
    for (const [packageName, unusedInfo] of this.unusedDeps.entries()) {
      const missingDeps = Object.keys(unusedInfo.missing || {});
      if (missingDeps.length > 0) {
        this.optimizationSuggestions.push({
          type: 'add-missing-dependencies',
          priority: 'high',
          package: packageName,
          file: unusedInfo.file,
          dependencies: missingDeps,
          action: `Add ${missingDeps.length} missing dependencies`,
          impact: 'Fixes potential runtime errors'
        });
      }
    }

    // 按优先级排序
    this.optimizationSuggestions.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  /**
   * 查找被多个包使用的依赖
   */
  findCommonDependencies() {
    const common = [];
    
    for (const [dep, packages] of this.dependencies.entries()) {
      if (packages.size >= 2) {
        common.push(dep);
      }
    }

    for (const [dep, packages] of this.devDependencies.entries()) {
      if (packages.size >= 3) { // 对开发依赖更严格
        common.push(dep);
      }
    }

    return [...new Set(common)];
  }

  /**
   * 从版本列表中获取最新版本
   */
  getLatestVersion(versions) {
    return versions.sort((a, b) => {
      // 移除版本前缀符号进行比较
      const aClean = a.replace(/^[\^~]/, '');
      const bClean = b.replace(/^[\^~]/, '');
      
      const aParts = aClean.split('.').map(Number);
      const bParts = bClean.split('.').map(Number);
      
      for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
        const aPart = aParts[i] || 0;
        const bPart = bParts[i] || 0;
        
        if (aPart !== bPart) {
          return bPart - aPart;
        }
      }
      
      return 0;
    })[0];
  }

  /**
   * 获取包名称
   */
  getPackageName(file) {
    try {
      const content = JSON.parse(readFileSync(file, 'utf8'));
      return content.name || path.dirname(file);
    } catch {
      return path.dirname(file);
    }
  }

  /**
   * 生成详细报告
   */
  generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalPackages: this.packageFiles.length,
        totalDependencies: this.dependencies.size,
        totalDevDependencies: this.devDependencies.size,
        duplicateDependencies: this.duplicateDeps.size,
        versionConflicts: this.versionConflicts.size,
        packagesWithUnusedDeps: this.unusedDeps.size,
        totalOptimizationSuggestions: this.optimizationSuggestions.length
      },
      unusedDependencies: Object.fromEntries(this.unusedDeps),
      duplicateDependencies: Object.fromEntries(this.duplicateDeps),
      versionConflicts: Object.fromEntries(this.versionConflicts),
      optimizationSuggestions: this.optimizationSuggestions,
      packageFiles: this.packageFiles
    };

    return report;
  }

  /**
   * 打印摘要报告
   */
  printSummary(report) {
    console.log('\n📊 Dependency Analysis Summary');
    console.log('================================');
    console.log(`📦 Total packages: ${report.summary.totalPackages}`);
    console.log(`📋 Total dependencies: ${report.summary.totalDependencies}`);
    console.log(`🛠️  Total dev dependencies: ${report.summary.totalDevDependencies}`);
    console.log(`🔄 Duplicate dependencies: ${report.summary.duplicateDependencies}`);
    console.log(`⚠️  Version conflicts: ${report.summary.versionConflicts}`);
    console.log(`🗑️  Packages with unused deps: ${report.summary.packagesWithUnusedDeps}`);
    console.log(`💡 Optimization suggestions: ${report.summary.totalOptimizationSuggestions}`);

    if (report.optimizationSuggestions.length > 0) {
      console.log('\n🎯 Top Optimization Suggestions:');
      console.log('================================');
      
      const topSuggestions = report.optimizationSuggestions.slice(0, 5);
      topSuggestions.forEach((suggestion, index) => {
        const priority = suggestion.priority === 'high' ? '🔴' : 
                        suggestion.priority === 'medium' ? '🟡' : '🟢';
        console.log(`${index + 1}. ${priority} ${suggestion.action}`);
        console.log(`   Impact: ${suggestion.impact}`);
      });
      
      if (report.optimizationSuggestions.length > 5) {
        console.log(`   ... and ${report.optimizationSuggestions.length - 5} more suggestions`);
      }
    }
  }

  /**
   * 运行完整分析
   */
  async run() {
    console.log('🚀 Starting enhanced dependency analysis...');
    
    try {
      await this.scanPackageFiles();
      this.analyzeDependencies();
      await this.detectUnusedDependencies();
      this.findDuplicateDependencies();
      this.findVersionConflicts();
      this.generateOptimizationSuggestions();
      
      const report = this.generateReport();
      
      // 保存详细报告
      const reportFile = 'dependency-analysis-report.json';
      writeFileSync(reportFile, JSON.stringify(report, null, 2));
      
      // 打印摘要
      this.printSummary(report);
      
      console.log(`\n📄 Detailed report saved to ${reportFile}`);
      console.log('✅ Analysis complete!');
      
      return report;
      
    } catch (error) {
      console.error('❌ Analysis failed:', error.message);
      throw error;
    }
  }
}

// 如果直接执行此脚本，则运行分析器
if (import.meta.url === `file://${process.argv[1]}`) {
  const analyzer = new EnhancedDependencyAnalyzer();
  analyzer.run().catch(console.error);
}

export default EnhancedDependencyAnalyzer;