# Web Application

基于 Next.js 14+ App Router 构建的现代化 Web 应用程序。

## 🚀 快速开始

```bash
# 开发模式
pnpm dev

# 构建生产版本
pnpm build

# 启动生产服务器
pnpm start
```

## 🏗️ 项目结构

```
web/
├── src/
│   ├── app/           # App Router 目录
│   ├── components/    # 组件目录
│   ├── features/      # 功能模块
│   ├── lib/           # 工具函数
│   └── types/         # TypeScript 类型定义
├── public/            # 静态资源
├── styles/            # 全局样式
└── tests/             # 测试文件
```

## 🧪 测试

```bash
# 运行单元测试
pnpm test

# 运行端到端测试
pnpm test:e2e

# 运行代码检查
pnpm lint
```

## 📦 独立部署

要独立部署此应用程序：

1. 克隆或下载 [apps/web](file:///c:/project/ifa/apps/web) 目录
2. 安装依赖并构建应用程序：
   ```bash
   pnpm install
   pnpm build
   ```

## 📄 许可证

MIT 许可证 - 详见 [LICENSE](file:///c:/project/ifa/apps/web/LICENSE) 文件了解详情。