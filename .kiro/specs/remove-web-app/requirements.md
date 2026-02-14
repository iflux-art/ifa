# Requirements Document

## Introduction

本文档定义了从 monorepo 项目中移除 web 子应用的需求。该操作需要安全地删除 web 应用及其所有相关配置，同时确保不影响其他应用（blog 和 hub）的正常运行。

## Glossary

- **Monorepo System**: 使用 pnpm workspace 和 Turborepo 管理的多包代码仓库系统
- **Web Application**: 位于 apps/web 目录下的 Next.js 应用，包名为 @repo/web
- **Root Package Configuration**: 位于项目根目录的 package.json 文件，包含工作区级别的脚本和配置
- **Workspace**: pnpm 工作区，定义在 pnpm-workspace.yaml 中
- **Build Cache**: Turborepo 构建缓存，存储在 .turbo 目录中

## Requirements

### Requirement 1

**User Story:** 作为开发者，我希望从项目中完全移除 web 应用目录，以便清理不再需要的代码

#### Acceptance Criteria

1. THE Monorepo System SHALL 删除 apps/web 目录及其所有子目录和文件
2. THE Monorepo System SHALL 保留 apps/blog 和 apps/hub 目录完整无损
3. THE Monorepo System SHALL 在删除操作完成后不存在任何 apps/web 相关的文件或目录

### Requirement 2

**User Story:** 作为开发者，我希望从根配置中移除所有 web 应用相关的脚本，以便避免执行不存在应用的命令

#### Acceptance Criteria

1. THE Monorepo System SHALL 从 Root Package Configuration 中移除所有包含 "web" 关键字的 npm 脚本
2. THE Monorepo System SHALL 保留不包含 "web" 关键字的通用脚本（如 dev、build、test 等）
3. THE Monorepo System SHALL 保留所有 blog 和 hub 相关的脚本
4. WHEN 开发者查看 package.json 的 scripts 部分时，THE Monorepo System SHALL 不显示任何 web 应用相关的命令

### Requirement 3

**User Story:** 作为开发者，我希望清理构建缓存中的 web 应用数据，以便释放磁盘空间并避免缓存污染

#### Acceptance Criteria

1. THE Monorepo System SHALL 删除 .turbo 目录中与 web 应用相关的缓存文件
2. THE Monorepo System SHALL 保留 blog 和 hub 应用的缓存文件
3. WHEN 缓存清理完成后，THE Monorepo System SHALL 不包含任何 @repo/web 相关的缓存条目

### Requirement 4

**User Story:** 作为开发者，我希望验证移除操作后项目仍然可以正常工作，以便确保没有破坏其他应用

#### Acceptance Criteria

1. WHEN 移除操作完成后，THE Monorepo System SHALL 能够成功执行 pnpm install 命令
2. WHEN 执行 dev:blog 或 dev:hub 脚本时，THE Monorepo System SHALL 能够正常启动对应的应用
3. WHEN 执行 build:blog 或 build:hub 脚本时，THE Monorepo System SHALL 能够成功构建对应的应用
4. THE Monorepo System SHALL 不产生任何与缺失 web 应用相关的错误或警告
