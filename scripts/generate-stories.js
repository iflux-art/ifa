const fs = require('fs');
const path = require('path');

// 定义组件目录
const componentsDir = 'packages/ui/src/components';

// 获取所有组件文件
const files = fs.readdirSync(componentsDir);

// 过滤出tsx文件（除了stories文件）
const componentFiles = files.filter(file => 
  file.endsWith('.tsx') && !file.endsWith('.stories.tsx')
);

console.log(`Found ${componentFiles.length} components to create stories for`);

// 为每个组件生成故事文件
componentFiles.forEach(file => {
  // 获取组件名称（不含扩展名）
  const componentName = path.basename(file, '.tsx');
  
  // 跳过已经存在的故事文件
  const storiesFile = `${componentName}.stories.tsx`;
  if (files.includes(storiesFile)) {
    console.log(`  Skipping ${componentName} (stories already exist)`);
    return;
  }
  
  // 生成故事文件内容
  const storiesContent = `import type { Meta, StoryObj } from "@storybook/react";
import { ${componentName.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('')} } from "./${componentName}";

const meta = {
  title: "Components/${componentName.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('')}",
  component: ${componentName.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('')},
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ${componentName.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('')}>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Add default props here
  },
};`;

  // 写入故事文件
  const storiesPath = path.join(componentsDir, storiesFile);
  fs.writeFileSync(storiesPath, storiesContent);
  console.log(`  Created stories for ${componentName}`);
});

console.log('\nStory generation complete!');