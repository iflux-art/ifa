const fs = require('fs');
const path = require('path');

// 定义源目录和目标目录
const sourceApps = [
  'apps/blog/src/components/ui',
  'apps/docs/src/components/ui',
  'apps/hub/src/components/ui',
  'apps/website/src/components/ui'
];
const targetDir = 'packages/ui/src/components';

// 确保目标目录存在
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// 用于跟踪已复制的文件，避免重复
const copiedFiles = new Set();

// 遍历每个应用的 UI 组件目录
sourceApps.forEach(sourceApp => {
  console.log(`Processing ${sourceApp}...`);
  
  if (!fs.existsSync(sourceApp)) {
    console.log(`  Source directory does not exist, skipping...`);
    return;
  }
  
  const files = fs.readdirSync(sourceApp);
  
  files.forEach(file => {
    // 跳过 index.ts 文件
    if (file === 'index.ts') {
      return;
    }
    
    const sourcePath = path.join(sourceApp, file);
    const targetPath = path.join(targetDir, file);
    
    // 如果文件已经复制过，跳过
    if (copiedFiles.has(file)) {
      console.log(`  Skipping ${file} (already copied)`);
      return;
    }
    
    // 复制文件
    try {
      fs.copyFileSync(sourcePath, targetPath);
      copiedFiles.add(file);
      console.log(`  Copied ${file}`);
    } catch (error) {
      console.error(`  Failed to copy ${file}:`, error.message);
    }
  });
});

console.log(`\nCopied ${copiedFiles.size} unique files to ${targetDir}`);