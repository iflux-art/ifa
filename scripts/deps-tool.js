#!/usr/bin/env node

/**
 * 依赖工具统一接口
 * 
 * 提供依赖分析和优化的统一命令行接口
 */

import EnhancedDependencyAnalyzer from './dependency-analyzer.js';
import DependencyOptimizer from './dependency-optimizer.js';

const COMMANDS = {
  analyze: {
    description: '分析依赖关系和问题',
    action: async () => {
      const analyzer = new EnhancedDependencyAnalyzer();
      return await analyzer.run();
    }
  },
  
  optimize: {
    description: '自动优化依赖（实际修改文件）',
    action: async () => {
      const optimizer = new DependencyOptimizer();
      return await optimizer.optimize();
    }
  },
  
  'dry-run': {
    description: '模拟优化过程（不修改文件）',
    action: async () => {
      const optimizer = new DependencyOptimizer({ dryRun: true });
      return await optimizer.optimize();
    }
  },
  
  interactive: {
    description: '交互式优化（逐个确认）',
    action: async () => {
      const optimizer = new DependencyOptimizer({ interactive: true });
      return await optimizer.optimize();
    }
  }
};

function printUsage() {
  console.log('🔧 Dependency Management Tool');
  console.log('=============================');
  console.log('');
  console.log('Usage: node scripts/deps-tool.js <command>');
  console.log('');
  console.log('Commands:');
  
  for (const [cmd, info] of Object.entries(COMMANDS)) {
    console.log(`  ${cmd.padEnd(12)} ${info.description}`);
  }
  
  console.log('');
  console.log('Examples:');
  console.log('  node scripts/deps-tool.js analyze     # 分析依赖问题');
  console.log('  node scripts/deps-tool.js dry-run     # 预览优化建议');
  console.log('  node scripts/deps-tool.js optimize    # 执行优化');
  console.log('');
}

async function main() {
  const command = process.argv[2];
  
  if (!command || command === '--help' || command === '-h') {
    printUsage();
    return;
  }
  
  if (!COMMANDS[command]) {
    console.error(`❌ Unknown command: ${command}`);
    console.log('');
    printUsage();
    process.exit(1);
  }
  
  try {
    console.log(`🚀 Running: ${command}`);
    console.log(`📝 ${COMMANDS[command].description}`);
    console.log('');
    
    await COMMANDS[command].action();
    
  } catch (error) {
    console.error(`❌ Command failed: ${error.message}`);
    if (process.env.DEBUG) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

main();