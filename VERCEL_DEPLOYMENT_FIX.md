# Vercel 部署 workspace 依赖问题解决方案

## 问题描述

在将子应用单独部署到 Vercel 时，出现以下错误：

```
npm error code EUNSUPPORTEDPROTOCOL
npm error Unsupported URL Type "workspace:": workspace:*
```

这是因为 Vercel 在构建时使用 npm 而不是 pnpm，npm 不支持 `workspace:*` 协议。

## 解决方案

我们已经更新了所有子应用的 `setup-standalone.js` 脚本，使其能够自动处理 `workspace:*` 依赖。

### 自动化处理流程

1. 当用户下载独立应用时，运行 `node setup-standalone.js` 脚本
2. 脚本会自动将 `package.json` 中的 `workspace:*` 依赖转换为实际的版本号
3. 同时将 `@repo/*` 包名转换为 `@iflux-art/*` 包名

### 转换规则

- `@repo/ui` workspace 依赖 → `@iflux-art/ui@^1.0.0`
- `@repo/utils` workspace 依赖 → `@iflux-art/utils@^1.0.0`
- 其他 workspace 依赖 → 依赖名@^1.0.0

## 部署步骤

1. 运行独立部署设置脚本：
   ```bash
   node setup-standalone.js
   ```

2. 安装依赖：
   ```bash
   pnpm install
   # 或者
   npm install
   ```

3. 构建应用：
   ```bash
   pnpm build
   # 或者
   npm run build
   ```

4. 部署到 Vercel

## 注意事项

1. 确保 `@iflux-art/*` 包已经发布到 npm
2. 如果需要特定版本，可以手动修改 `package.json` 中的版本号
3. 部署前建议在本地测试构建过程

## 版本管理

默认使用 `^1.0.0` 作为版本号，实际使用时应根据已发布的版本进行调整。