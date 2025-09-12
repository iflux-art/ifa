# 开发环境配置指南

本文档详细说明了如何配置和使用 NextJS Monorepo 项目的开发环境。

## 🚀 快速开始

### 1. 安装依赖
```bash
pnpm install
```

### 2. 构建共享包
```bash
pnpm run build:packages
```

### 3. 启动开发环境
```bash
# 标准启动（推荐）
pnpm run dev:setup

# 快速启动（跳过包构建）
pnpm run dev:setup:fast

# 传统启动
pnpm run dev
```

## 📦 开发脚本说明

### 根级脚本

| 脚本 | 描述 | 使用场景 |
|------|------|----------|
| `dev` | 并行启动所有应用 | 基础开发 |
| `dev:setup` | 智能启动（先构建包再启动） | 推荐的开发启动方式 |
| `dev:setup:fast` | 快速启动（跳过包构建） | 包已构建时的快速启动 |
| `dev:watch` | 启动并监听包变化 | 跨包开发 |
| `dev:watch-packages` | 监听包变化并自动重建 | 包开发时的自动化 |
| `dev:website` | 仅启动官网应用 | 单应用开发 |
| `dev:blog` | 仅启动博客应用 | 单应用开发 |
| `dev:docs` | 仅启动文档应用 | 单应用开发 |
| `dev:ui` | 启动 UI 组件库开发 | 组件开发 |

### 应用级脚本

每个应用都支持以下开发脚本：

| 脚本 | 描述 | 端口 |
|------|------|------|
| `dev` | 启动开发服务器（Turbopack） | 见下表 |
| `dev:debug` | 启动调试模式 | 见下表 |
| `dev:fast` | 快速启动（实验性 HTTPS） | 见下表 |

### 端口分配

| 应用 | 开发端口 | 生产端口 |
|------|----------|----------|
| Website | 3000 | 3000 |
| Blog | 3001 | 3001 |
| Docs | 3002 | 3002 |
| Bookmarks | 3003 | 3003 |
| Storybook | 6006 | - |

## 🔥 热重载配置

### Next.js 应用热重载特性

1. **Turbopack 支持**: 所有应用默认启用 Turbopack 以获得更快的热重载
2. **Fast Refresh**: 自动启用 React Fast Refresh
3. **源码映射**: 开发模式下启用源码映射便于调试
4. **文件监听优化**: 配置了文件监听轮询以确保跨平台兼容性

### 包级热重载

1. **UI 组件库**: 使用 `tsup --watch` 实现增量构建
2. **工具函数库**: 自动监听变化并重建
3. **配置包**: 变化时自动更新依赖应用

## 🛠 开发环境优化

### 1. 依赖监听和自动重建

项目配置了智能的依赖监听系统：

```bash
# 启动包监听器
pnpm run dev:watch-packages
```

监听器会：
- 监听 `packages/*/src` 目录的变化
- 自动重建变更的包
- 通知依赖该包的其他应用
- 防抖处理避免频繁重建

### 2. 快速启动策略

```bash
# 首次启动或包有重大变更时
pnpm run dev:setup

# 日常开发（包已构建）
pnpm run dev:setup:fast

# 仅启动特定应用
pnpm run dev:website
```

### 3. 开发环境变量

项目使用 `.env.development` 文件配置开发环境：

```env
# 启用 Turbopack
TURBOPACK=1

# 启用快速刷新
FAST_REFRESH=true

# 文件监听配置
WATCHPACK_POLLING=true
CHOKIDAR_USEPOLLING=true
```

## 🔧 故障排除

### 常见问题

1. **热重载不工作**
   ```bash
   # 清理缓存并重启
   pnpm run clean
   pnpm run dev:setup
   ```

2. **包变更未生效**
   ```bash
   # 手动重建包
   pnpm run build:packages
   ```

3. **端口冲突**
   ```bash
   # 检查端口占用
   netstat -ano | findstr :3000
   
   # 或使用不同端口
   next dev --port 3010
   ```

4. **TypeScript 类型错误**
   ```bash
   # 重新生成类型定义
   pnpm run type-check
   ```

### 性能优化建议

1. **使用 SSD**: 确保项目在 SSD 上以获得更好的文件 I/O 性能
2. **增加内存**: 建议至少 8GB RAM 用于并行开发
3. **关闭不必要的应用**: 只启动正在开发的应用
4. **使用 WSL2**: Windows 用户推荐使用 WSL2 以获得更好的性能

## 📊 开发工作流

### 典型的开发流程

1. **启动开发环境**
   ```bash
   pnpm run dev:setup
   ```

2. **开发 UI 组件**
   ```bash
   # 在新终端中启动 Storybook
   cd packages/ui
   pnpm run storybook
   ```

3. **开发应用功能**
   - 在浏览器中访问对应应用
   - 修改代码，观察热重载效果
   - 使用浏览器开发工具调试

4. **跨包开发**
   ```bash
   # 启动包监听器（可选）
   pnpm run dev:watch-packages
   ```

5. **测试和构建**
   ```bash
   # 运行测试
   pnpm run test
   
   # 构建检查
   pnpm run build
   ```

## 🎯 最佳实践

1. **使用推荐的启动脚本**: `pnpm run dev:setup`
2. **定期清理缓存**: 遇到问题时先尝试清理缓存
3. **监控包变化**: 开发跨包功能时启用包监听器
4. **合理使用端口**: 避免端口冲突，使用预定义端口
5. **利用 TypeScript**: 充分利用类型检查和 IDE 支持
6. **使用 Storybook**: 开发 UI 组件时使用 Storybook 进行隔离开发

## 🔗 相关链接

- [Turborepo 文档](https://turbo.build/repo/docs)
- [Next.js 开发文档](https://nextjs.org/docs)
- [pnpm Workspace 文档](https://pnpm.io/workspaces)
- [Turbopack 文档](https://turbo.build/pack/docs)