# Scripts 目录

这个目录包含了项目的核心工具脚本。

## 可用脚本

### 🔧 构建和部署
- **`build-deployment.js`** - 构建和部署管理工具
  - 支持构建验证、环境准备、报告生成
  - 使用: `pnpm build:deploy`, `pnpm build:report`

### 📦 依赖管理
- **`dependency-analyzer.js`** - 增强的依赖分析工具
  - 检测未使用依赖、版本冲突、重复依赖
  - 生成优化建议和详细报告
- **`deps-tool.js`** - 依赖工具统一接口
  - 使用: `pnpm deps:analyze`, `pnpm deps:optimize`, `pnpm deps:dry-run`

### ⚡ 性能监控
- **`measure-build-performance.js`** - 构建性能基准测量
  - 测量构建时间、产物大小、依赖安装时间
  - 使用: `pnpm perf:measure`

### ⚙️ 配置管理
- **`sync-configs.js`** - 配置同步工具
  - 从模板同步配置到各个应用
  - 支持变量替换和应用特定配置
  - 使用: `pnpm workspace:sync`

- **`validate-workspace.js`** - 工作区验证工具
  - 验证包配置、目录结构、Turbo配置
  - 使用: `pnpm workspace:validate`

### 🔄 维护工具
- **`update-dependencies.sh`** - 依赖更新脚本
  - 批量更新所有包和应用的依赖
  - 使用: `pnpm deps:update`

## 使用建议

### 日常开发
```bash
# 验证工作区配置
pnpm workspace:validate

# 分析依赖问题
pnpm deps:analyze

# 同步配置文件
pnpm workspace:sync
```

### 性能优化
```bash
# 测量构建性能
pnpm perf:measure

# 优化依赖（预览模式）
pnpm deps:dry-run

# 实际执行优化
pnpm deps:optimize
```

### 部署准备
```bash
# 构建并生成报告
pnpm build:deploy

# 准备部署环境
pnpm deploy:prep
```

## 脚本清理说明

为了简化维护和避免功能重复，我们删除了以下脚本：

- 重复的依赖分析脚本（保留了功能最全的版本）
- 重复的性能分析脚本（保留了核心功能）
- 重复的配置管理脚本（保留了必要的同步和验证功能）
- 特定平台的脚本（如CDN优化、PowerShell脚本）
- 已解决问题的文档文件

这样可以：
- 减少维护负担
- 避免功能混淆
- 提高脚本质量
- 简化使用流程