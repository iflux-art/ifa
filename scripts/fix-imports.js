const fs = require('fs');
const path = require('path');

// 定义组件目录
const componentsDir = 'packages/ui/src/components';

// 获取所有组件文件
const files = fs.readdirSync(componentsDir);

// 过滤出tsx文件
const componentFiles = files.filter(file => 
  file.endsWith('.tsx')
);

console.log(`Found ${componentFiles.length} components to fix imports for`);

// 为每个组件文件修复导入路径
componentFiles.forEach(file => {
  const filePath = path.join(componentsDir, file);
  
  // 读取文件内容
  let content = fs.readFileSync(filePath, 'utf8');
  
  // 修复导入路径
  content = content.replace(/from "@\/utils"/g, 'from "@/utils/core"');
  content = content.replace(/from "@\/components\/ui\/button"/g, 'from "./button"');
  content = content.replace(/from "@\/components\/ui\/card"/g, 'from "./card"');
  
  // 写入修复后的内容
  fs.writeFileSync(filePath, content);
  console.log(`  Fixed imports in ${file}`);
});

console.log('\nImport fixing complete!');