# 部署到 Vercel

## 概述

本项目是一个 Monorepo 结构的 Next.js 应用集合，包含四个独立的子应用：
- Website (官网)
- Blog (博客)
- Docs (文档)
- Hub (书签管理器)

每个子应用都可以独立部署到 Vercel。

## 部署配置

我们已经为每个子应用进行了以下配置以确保与 Vercel 环境兼容：

1. 在每个子应用的 [package.json](file://c:\project\ifa\apps\blog\package.json) 中，将 pnpm 的要求从 `>=9.11.0` 调整为 `>=8.0.0`，以兼容 Vercel 环境
2. 保留了 `packageManager` 字段为 `pnpm@9.11.0`，这样在本地开发时仍会使用高版本
3. 为每个子应用添加了 [vercel.json](file://c:\project\ifa\apps\blog\vercel.json) 配置文件，确保部署时的正确配置
4. 更新了根目录的 [package.json](file://c:\project\ifa\package.json) 以保持一致性

## 部署步骤

### 1. 单独部署每个应用

#### Website (官网)
1. 登录 Vercel 控制台
2. 点击 "Add New Project"
3. 选择你的 GitHub 仓库
4. 在项目设置中：
   - Framework Preset: Next.js
   - Root Directory: apps/website
   - Build Command: `next build`
   - Output Directory: `.next`
5. 点击 "Deploy"

#### Blog (博客)
1. 登录 Vercel 控制台
2. 点击 "Add New Project"
3. 选择你的 GitHub 仓库
4. 在项目设置中：
   - Framework Preset: Next.js
   - Root Directory: apps/blog
   - Build Command: `next build`
   - Output Directory: `.next`
5. 点击 "Deploy"

#### Docs (文档)
1. 登录 Vercel 控制台
2. 点击 "Add New Project"
3. 选择你的 GitHub 仓库
4. 在项目设置中：
   - Framework Preset: Next.js
   - Root Directory: apps/docs
   - Build Command: `next build`
   - Output Directory: `.next`
5. 点击 "Deploy"

#### Hub (书签管理器)
1. 登录 Vercel 控制台
2. 点击 "Add New Project"
3. 选择你的 GitHub 仓库
4. 在项目设置中：
   - Framework Preset: Next.js
   - Root Directory: apps/hub
   - Build Command: `next build`
   - Output Directory: `.next`
5. 点击 "Deploy"

## 本地开发与部署的版本差异

- **本地开发**：使用 pnpm 9.11.0 和 Node.js 22.x
- **Vercel 部署**：使用 pnpm 8.15.0 和 Node.js 18.x

这种配置确保了：
1. 本地开发时可以使用最新的工具特性
2. 部署时与 Vercel 环境兼容
3. 代码功能在两种环境中保持一致

## 独立域名配置

建议为每个子应用配置独立的域名：

- 官网：[yourcompany.com](http://yourcompany.com)
- 博客：[blog.yourcompany.com](http://blog.yourcompany.com)
- 文档：[docs.yourcompany.com](http://docs.yourcompany.com)
- 书签：[hub.yourcompany.com](http://hub.yourcompany.com)

在 Vercel 控制台中，你可以为每个项目设置自定义域名：
1. 进入项目设置
2. 选择 "Domains" 选项卡
3. 添加你的自定义域名
4. 按照提示配置 DNS 记录

## 注意事项

1. 如果在部署时遇到其他问题，请检查相应子应用目录下的 [vercel.json](file://c:\project\ifa\apps\blog\vercel.json) 配置是否正确
2. 确保所有子应用都已更新了相应的配置
3. 如果需要在 Vercel 上使用特定的环境变量，请在 Vercel 控制台中进行设置
4. 每个子应用都有独立的 [DEPLOYMENT.md](file://c:\project\ifa\apps\blog\DEPLOYMENT.md) 文件，包含更详细的部署说明