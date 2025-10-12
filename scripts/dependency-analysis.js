#!/usr/bin/env node

/**
 * 依赖分析和管理脚本
 * 
 * 此脚本分析单体仓库中的依赖关系并提供
 * 优化、版本统一和清理的建议。
 */

import { readFileSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';
import { glob } from 'glob';
import path from 'path';

class DependencyAnalyzer {
  constructor() {
    this.packageFiles = [];
    this.dependencies = new Map();
    this.devDependencies = new Map();
    this.unusedDeps = new Map();
    this.versionConflicts = new Map();
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
      const files = await glob(pattern);
      this.packageFiles.push(...files);
    }

    console.log(`Found ${this.packageFiles.length} package.json files`);
  }

  /**
   * 分析依赖关系及其版本
   */
  analyzeDependencies() {
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
            this.dependencies.get(dep).set(packageName, version);
          }
        }

        // 分析开发依赖
        if (content.devDependencies) {
          for (const [dep, version] of Object.entries(content.devDependencies)) {
            if (!this.devDependencies.has(dep)) {
              this.devDependencies.set(dep, new Map());
            }
            this.devDependencies.get(dep).set(packageName, version);
          }
        }
      } catch (error) {
        console.warn(`Failed to parse ${file}: ${error.message}`);
      }
    }
  }

  /**
   * 查找跨包的版本冲突
   */
  findVersionConflicts() {
    const checkConflicts = (depMap, type) => {
      for (const [dep, packages] of depMap.entries()) {
        const versions = new Set(packages.values());
        if (versions.size > 1) {
          this.versionConflicts.set(`${dep} (${type})`, {
            versions: Array.from(versions),
            packages: Object.fromEntries(packages)
          });
        }
      }
    };

    checkConflicts(this.dependencies, 'dependencies');
    checkConflicts(this.devDependencies, 'devDependencies');
  }

  /**
   * Generate dependency optimization report
   */
  generateReport() {
    const report = {
      summary: {
        totalPackages: this.packageFiles.length,
        totalDependencies: this.dependencies.size,
        totalDevDependencies: this.devDependencies.size,
        versionConflicts: this.versionConflicts.size
      },
      versionConflicts: Object.fromEntries(this.versionConflicts),
      recommendations: this.generateRecommendations()
    };

    return report;
  }

  /**
   * Generate optimization recommendations
   */
  generateRecommendations() {
    const recommendations = [];

    // 版本统一建议
    for (const [dep, conflict] of this.versionConflicts.entries()) {
      const latestVersion = this.getLatestVersion(conflict.versions);
      recommendations.push({
        type: 'version-unification',
        dependency: dep,
        action: `Unify to version ${latestVersion}`,
        packages: Object.keys(conflict.packages)
      });
    }

    // 应该移到根目录的公共依赖
    const commonDeps = this.findCommonDependencies();
    for (const dep of commonDeps) {
      recommendations.push({
        type: 'move-to-root',
        dependency: dep,
        action: 'Move to root package.json to reduce duplication'
      });
    }

    return recommendations;
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
      if (packages.size >= 3) { // More strict for devDependencies
        common.push(dep);
      }
    }

    return [...new Set(common)];
  }

  /**
   * 从版本列表中获取最新版本
   */
  getLatestVersion(versions) {
    // Simple heuristic: return the version with the highest number
    return versions.sort((a, b) => {
      const aNum = a.replace(/[^\d.]/g, '');
      const bNum = b.replace(/[^\d.]/g, '');
      return bNum.localeCompare(aNum, undefined, { numeric: true });
    })[0];
  }

  /**
   * 运行完整分析
   */
  async run() {
    console.log('🔍 Starting dependency analysis...');
    
    await this.scanPackageFiles();
    this.analyzeDependencies();
    this.findVersionConflicts();
    
    const report = this.generateReport();
    
    // Write report to file
    writeFileSync('dependency-analysis-report.json', JSON.stringify(report, null, 2));
    
    console.log('📊 Analysis complete!');
    console.log(`📋 Report saved to dependency-analysis-report.json`);
    console.log(`🔧 Found ${report.summary.versionConflicts} version conflicts`);
    console.log(`💡 Generated ${report.recommendations.length} recommendations`);
    
    return report;
  }
}

// 如果直接执行此脚本，则运行分析器
if (import.meta.url === `file://${process.argv[1]}`) {
  const analyzer = new DependencyAnalyzer();
  analyzer.run().catch(console.error);
}

export default DependencyAnalyzer;