# UI 组件展示应用

这是斐流艺创（iFluxArt）项目中的 UI 组件展示应用，基于 Next.js 15.4 + React 19 + TypeScript 5.9 构建，采用 App Router 架构。该应用主要用于展示和测试 @iflux-art/ui 组件库中的组件。

## 🚀 快速开始

### 前置要求

- Node.js 18+
- pnpm 8+

### 安装依赖

```bash
pnpm install
```

### 开发模式

```bash
pnpm dev
```

### 构建项目

```bash
pnpm build
```

### 启动生产服务器

```bash
pnpm start
```

## 📁 项目结构

```
.
├── src/                  # 源代码
│   ├── app/              # Next.js 应用路由
│   ├── components/       # 共享组件
│   ├── features/         # 功能模块
│   ├── middleware.ts     # 中间件
│   └── styles/           # 全局样式
├── public/               # 静态资源
├── next.config.mjs       # Next.js 配置
└── tailwind.config.mjs   # Tailwind 配置
```

## 🛠️ 开发工具

### 代码检查和格式化

```bash
pnpm check
```

### 运行测试

```bash
pnpm test
```

### 类型检查

```bash
pnpm type-check
```

## 🚀 独立部署

此应用可以独立部署，无需下载整个项目。

### 使用 npm 包（推荐）

1. 克隆或下载 `apps/ui` 目录
2. 运行独立部署脚本：`node setup-standalone.js`
3. 运行 `pnpm install` 安装依赖
4. 运行 `pnpm build` 构建应用
5. 运行 `pnpm start` 启动应用

## 📄 许可证

MIT License - 详见根目录 LICENSE 文件