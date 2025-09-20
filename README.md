# Next.js 单体仓库项目

一个基于 Next.js App Router、pnpm workspace 和 Turborepo 构建的现代化单体仓库项目。本项目包含四个可以一起开发或独立部署的独立应用程序。

## 🚀 应用程序

- **Web** - 公司官方网站 (端口: 3000)
- **Blog** - 基于 Markdown 的博客系统 (端口: 3000)
- **Docs** - 带搜索功能的技术文档 (端口: 3000)
- **Hub** - 书签管理系统 (端口: 3000)
- **UI** - UI 组件库开发和测试应用 (端口: 3000)

## 🏗️ 架构

本项目使用单体仓库架构，采用以下技术：

- **Next.js 14+** 配合 App Router 进行服务端渲染和路由管理
- **pnpm workspace** 实现高效的包管理
- **Turborepo** 用于缓存构建和并行任务执行
- **TypeScript** 确保类型安全
- **Biome** 用于快速代码格式化和检查
- **Vitest** 用于单元测试
- **Playwright** 用于端到端测试

### 共享包

- `@repo/ui` - 共享 UI 组件
- `@repo/utils` - 工具函数
- `@repo/tailwind-config` - Tailwind CSS 配置
- `@repo/typescript-config` - TypeScript 配置

### 一键独立部署

要独立部署应用程序：

1. 下载或克隆特定的应用程序目录（例如 `apps/docs`）
2. 安装依赖并构建应用程序：
   ```bash
   pnpm install
   pnpm build
   ```

本单体仓库中的每个应用程序都可以独立部署，无需下载整个项目。

## 🔧 开发

### 添加新应用

```bash
cd apps
npx create-next-app@latest new-app --typescript --tailwind --eslint --app --src-dir
```

### 添加新包

```bash
mkdir packages/new-package
cd packages/new-package
pnpm init
```

### 运行单个应用

```bash
# 运行特定应用
pnpm --filter web dev
pnpm --filter blog build
```

## 🧪 测试

```bash
# 运行所有测试
pnpm test

# 运行特定包的测试
pnpm --filter @repo/ui test
```

## 📝 贡献

1. Fork 本仓库
2. 创建功能分支
3. 进行修改
4. 运行测试和代码检查
5. 提交 Pull Request

## 📄 许可证

MIT 许可证 - 详见 LICENSE 文件了解详情。