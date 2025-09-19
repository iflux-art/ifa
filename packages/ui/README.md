# @iflux-art/ui

一个基于 shadcn/ui 设计系统、Radix UI 原语和 Tailwind CSS 构建的现代化 React UI 组件库。

## 特性

- 🎨 基于 shadcn/ui 设计系统构建
- ⚡ 由 Radix UI 原语驱动
- 🎯 完整的 TypeScript 支持和类型安全
- 🎪 集成 Storybook 用于组件开发
- 🧪 使用 Jest 和 Testing Library 进行全面测试
- 📦 支持 Tree-shaking 的 ESM 构建
- 🎨 使用 Tailwind CSS 和 CSS 变量进行主题定制

## 安装

```bash
npm install @iflux-art/ui
# 或者
yarn add @iflux-art/ui
# 或者
pnpm add @iflux-art/ui
```

## 使用方法

```tsx
import { Button } from '@iflux-art/ui'

// 基本用法
<Button>点击我</Button>

// 使用变体
<Button variant="destructive">删除</Button>
<Button variant="outline">取消</Button>
<Button variant="ghost">幽灵</Button>

// 使用尺寸
<Button size="sm">小</Button>
<Button size="lg">大</Button>
<Button size="icon">🚀</Button>

// 作为子组件
<Button asChild>
  <a href="/link">链接按钮</a>
</Button>
```

## 样式配置

该包使用 Tailwind CSS 和 CSS 变量进行主题定制。要正确使用组件，您需要：

1. 在您的项目中安装 Tailwind CSS
2. 配置 Tailwind 以包含包内容：

```js
// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@iflux-art/ui/**/*.{js,jsx,ts,tsx}"
  ],
  // ... 其余配置
}
```

3. 在您的全局 CSS 文件中导入 CSS 变量：

```css
@import "@iflux-art/ui/styles.css";
```

## 组件

### Button（按钮）

一个多功能的按钮组件，具有多种变体和尺寸。

### Card（卡片）

一个灵活的卡片组件，用于显示内容。

### Input（输入框）

一个样式化的输入框组件。

### Label（标签）

一个样式化的标签组件。

### ThemeToggle（主题切换）

一个用于在浅色和深色主题之间切换的组件。使用 next-themes 库实现主题管理，并带有平滑的动画过渡效果。

## 在 Monorepo 中开发

该包在 iflux-art Monorepo 项目中内部使用。通过 pnpm workspace 设置，组件可自动供 Monorepo 中的所有应用程序使用。

## Storybook

该包包含 Storybook 用于组件开发和文档。启动 Storybook：

```bash
pnpm storybook
```

Storybook 将在 http://localhost:6006/ 可用

## TypeScript

所有组件都使用 TypeScript 进行了完整的类型化。包导出了所有必要的属性和组件引用类型。

```tsx
import type { ButtonProps } from '@iflux-art/ui'

const MyButton: React.FC<ButtonProps> = (props) => {
  return <Button {...props} />
}
```

## 许可证

MIT