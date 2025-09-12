# Turborepo 构建流水线配置

本文档详细说明了项目中 Turborepo 构建流水线的配置和使用方法。

## 概述

Turborepo 是一个高性能的构建系统，专为 JavaScript 和 TypeScript monorepo 设计。它提供了以下核心功能：

- **增量构建**: 只重新构建发生变化的包
- **并行执行**: 同时运行多个独立的任务
- **智能缓存**: 缓存构建结果以加速后续构建
- **任务依赖管理**: 确保任务按正确顺序执行

## 配置文件

### turbo.json

主要配置文件位于项目根目录的 `turbo.json`，包含以下关键配置：

#### 全局依赖
```json
{
  "globalDependencies": [
    "**/.env.*local",
    ".env",
    "tsconfig.json",
    "tailwind.config.*",
    "postcss.config.*"
  ]
}
```

这些文件的变化会影响所有包的缓存。

#### 全局环境变量
```json
{
  "globalEnv": [
    "NODE_ENV",
    "NEXT_PUBLIC_*"
  ]
}
```

这些环境变量的变化会使所有任务的缓存失效。

#### 任务流水线

每个任务都有详细的配置，包括：

- **dependsOn**: 任务依赖关系
- **inputs**: 影响任务输出的输入文件
- **outputs**: 任务生成的输出文件
- **env**: 任务特定的环境变量
- **cache**: 是否启用缓存

## 任务类型

### 构建任务 (build)

```json
{
  "build": {
    "dependsOn": ["^build", "type-check"],
    "inputs": [
      "src/**/*.{ts,tsx,js,jsx,json,md,mdx}",
      "public/**",
      "next.config.*",
      "package.json",
      "tsconfig.json",
      "tailwind.config.*",
      "postcss.config.*"
    ],
    "outputs": [
      ".next/**",
      "!.next/cache/**",
      "dist/**",
      "storybook-static/**"
    ]
  }
}
```

- 依赖于上游包的构建和本包的类型检查
- 监听源代码、配置文件的变化
- 输出构建产物到 `.next`、`dist` 等目录

### 开发任务 (dev)

```json
{
  "dev": {
    "dependsOn": ["^build"],
    "cache": false,
    "persistent": true
  }
}
```

- 依赖于上游包的构建
- 不启用缓存（因为是持续运行的进程）
- 标记为持久任务

### 代码质量任务

#### 类型检查 (type-check)
- 使用 TypeScript 编译器检查类型
- 依赖于上游包的构建

#### 代码检查 (lint)
- 使用 Biome 进行代码质量检查
- 依赖于上游包的构建

#### 代码格式化 (format)
- 使用 Biome 格式化代码
- 不启用缓存（因为会修改文件）

### 测试任务 (test)

```json
{
  "test": {
    "dependsOn": ["^build"],
    "inputs": [
      "src/**/*.{ts,tsx,js,jsx}",
      "**/*.test.{ts,tsx,js,jsx}",
      "**/*.spec.{ts,tsx,js,jsx}",
      "jest.config.*",
      "package.json",
      "tsconfig.json"
    ],
    "outputs": [
      "coverage/**",
      "test-results/**"
    ]
  }
}
```

## 可用脚本

### 根级脚本

在项目根目录可以使用以下脚本：

```bash
# 开发模式 - 并行启动所有应用
pnpm dev

# 构建所有包和应用
pnpm build

# 运行所有测试
pnpm test

# 代码检查
pnpm lint

# 代码格式化
pnpm format

# 类型检查
pnpm type-check

# 清理构建产物
pnpm clean

# CI 流水线 - 运行所有质量检查和构建
pnpm ci

# 仅构建应用（不包括 UI 组件库）
pnpm ci:build

# 运行测试并生成覆盖率报告
pnpm ci:test

# 完全重置项目
pnpm reset
```

### 特定包脚本

也可以针对特定包运行任务：

```bash
# 仅构建 UI 组件库
pnpm turbo run build --filter=@repo/ui

# 仅运行博客应用的测试
pnpm turbo run test --filter=@repo/blog

# 构建所有应用但不包括包
pnpm turbo run build --filter="./apps/*"

# 运行所有包的类型检查
pnpm turbo run type-check --filter="./packages/*"
```

## 缓存策略

### 本地缓存

Turborepo 会在 `.turbo` 目录中缓存任务结果：

- 任务输出文件
- 日志文件
- 哈希值和元数据

### 远程缓存

配置了远程缓存支持（需要 Vercel 账户）：

```json
{
  "remoteCache": {
    "signature": true
  }
}
```

### 缓存失效

以下情况会导致缓存失效：

1. 输入文件发生变化
2. 依赖的任务输出发生变化
3. 环境变量发生变化
4. 全局依赖文件发生变化

## 性能优化

### 并行执行

Turborepo 会自动分析任务依赖关系，并行执行独立的任务：

```
┌─ @repo/utils#build
├─ @repo/typescript-config#build
├─ @repo/tailwind-config#build
└─ @repo/biome-config#build
    ↓
┌─ @repo/ui#build
└─ @repo/ui#type-check
    ↓
┌─ @repo/website#build
├─ @repo/blog#build
└─ @repo/docs#build
```

### 增量构建

只有当输入文件发生变化时，任务才会重新执行：

- 修改 `@repo/ui` 的代码 → 重新构建 `@repo/ui` 和依赖它的应用
- 修改 `@repo/blog` 的代码 → 只重新构建 `@repo/blog`
- 修改根级配置文件 → 重新构建所有包

### 缓存命中率

通过以下方式提高缓存命中率：

1. **精确的输入定义**: 只包含真正影响输出的文件
2. **合理的任务拆分**: 避免单个任务包含过多逻辑
3. **稳定的环境**: 避免不必要的环境变量变化

## 调试和监控

### 查看任务执行计划

```bash
# 查看构建任务的执行计划
pnpm turbo run build --dry-run

# 查看详细的任务信息
pnpm turbo run build --dry-run --verbose
```

### 查看缓存状态

```bash
# 强制跳过缓存
pnpm turbo run build --force

# 查看缓存统计
pnpm turbo run build --summarize
```

### 日志文件

每个任务的日志都保存在对应包的 `.turbo` 目录中：

```
packages/ui/.turbo/turbo-build.log
apps/website/.turbo/turbo-build.log
```

## 最佳实践

### 1. 任务依赖设计

- 确保构建任务依赖于上游包的构建
- 类型检查和代码检查依赖于构建完成
- 测试任务依赖于构建完成

### 2. 输入文件配置

- 只包含真正影响输出的文件
- 使用 glob 模式精确匹配
- 排除不相关的文件（如测试文件对构建任务）

### 3. 输出文件配置

- 明确指定所有输出目录
- 排除缓存目录（如 `.next/cache`）
- 包含所有可能的输出格式

### 4. 环境变量管理

- 只在必要时声明环境变量依赖
- 区分构建时和运行时环境变量
- 使用 `NEXT_PUBLIC_*` 模式匹配公共环境变量

### 5. 缓存优化

- 定期清理本地缓存：`pnpm turbo run clean`
- 监控缓存命中率
- 合理设置远程缓存

## 故障排除

### 常见问题

1. **缓存问题**: 使用 `--force` 跳过缓存
2. **依赖问题**: 检查 `dependsOn` 配置
3. **输入文件问题**: 使用 `--dry-run` 查看输入文件列表
4. **环境变量问题**: 检查 `env` 和 `globalEnv` 配置

### 重置方法

```bash
# 清理所有构建产物
pnpm clean

# 清理 Turborepo 缓存
rm -rf .turbo

# 完全重置项目
pnpm reset
```

## 扩展配置

### 添加新任务

在 `turbo.json` 中添加新任务配置：

```json
{
  "pipeline": {
    "my-task": {
      "dependsOn": ["^build"],
      "inputs": ["src/**/*.ts"],
      "outputs": ["dist/**"]
    }
  }
}
```

### 添加新包

新包会自动继承 `turbo.json` 中的任务配置，只需确保：

1. 在 `package.json` 中定义相应的脚本
2. 配置正确的依赖关系
3. 更新 `pnpm-workspace.yaml`（如果需要）

这个配置确保了整个 monorepo 的高效构建和开发体验。