# 应用模板和标准化工具 (Application Template and Standardization Tools)

本目录包含 monorepo 中所有子应用的统一模板、标准和工具，确保代码结构的一致性和可维护性。

## 📁 目录内容 (Directory Contents)

### 📋 标准文档 (Standard Documents)
- **[APPLICATION_STRUCTURE_STANDARDS.md](./APPLICATION_STRUCTURE_STANDARDS.md)** - 完整的应用结构标准
- **[CODE_STYLE_GUIDE.md](./CODE_STYLE_GUIDE.md)** - 代码风格和架构模式指南
- **[STANDARDIZATION.md](./STANDARDIZATION.md)** - 标准化概览和快速指南
- **[MIGRATION_CHECKLIST.md](./MIGRATION_CHECKLIST.md)** - 详细的迁移检查清单

### 🛠️ 自动化工具 (Automation Tools)
- **[validate-app-structure.js](./validate-app-structure.js)** - 应用结构验证脚本
- **[standardize-app.js](./standardize-app.js)** - 应用标准化脚本

### 📄 配置模板 (Configuration Templates)
- **package.json.template** - 标准 package.json 配置
- **tsconfig.json** - TypeScript 配置模板
- **biome.json** - 代码质量工具配置
- **next.config.mjs** - Next.js 配置模板
- **vitest.config.ts** - 测试配置模板
- **playwright.config.ts** - E2E 测试配置
- **tailwind.config.mjs** - 样式配置模板
- **postcss.config.mjs** - PostCSS 配置

### 📂 标准目录结构 (Standard Directory Structure)
```
src/
├── app/          # Next.js App Router 页面
├── components/   # React 组件
├── lib/          # 工具库和配置
├── hooks/        # 自定义 React Hooks
├── stores/       # 状态管理 (Zustand)
├── types/        # TypeScript 类型定义
├── config/       # 应用配置
├── test/         # 测试工具和配置
└── middleware.ts # Next.js 中间件
```

## 🚀 快速开始 (Quick Start)

### 验证现有应用 (Validate Existing Application)
```bash
# 验证单个应用
node apps/.template/validate-app-structure.js apps/web

# 验证多个应用
node apps/.template/validate-app-structure.js apps/web
node apps/.template/validate-app-structure.js apps/blog
node apps/.template/validate-app-structure.js apps/hub
```

### 标准化现有应用 (Standardize Existing Application)
```bash
# 预览模式 - 查看将要进行的更改
node apps/.template/standardize-app.js --dry-run apps/web

# 执行标准化
node apps/.template/standardize-app.js apps/web

# 批量处理多个应用
node apps/.template/standardize-app.js apps/web apps/blog apps/hub
```

### 创建新应用 (Create New Application)
```bash
# 1. 复制模板目录
cp -r apps/.template apps/new-app

# 2. 更新应用特定配置
cd apps/new-app
# 编辑 package.json, README.md 等文件

# 3. 验证结构
node apps/.template/validate-app-structure.js apps/new-app
```

## 📖 详细指南 (Detailed Guides)

### 🏗️ 应用结构标准 (Application Structure Standards)
查看 [APPLICATION_STRUCTURE_STANDARDS.md](./APPLICATION_STRUCTURE_STANDARDS.md) 了解：
- 标准目录结构
- 文件命名规范
- 组件组织模式
- 导入导出规范
- 配置文件标准

### 💻 代码风格指南 (Code Style Guide)
查看 [CODE_STYLE_GUIDE.md](./CODE_STYLE_GUIDE.md) 了解：
- TypeScript 编码规范
- React 组件模式
- 状态管理模式
- API 设计模式
- 测试规范
- 性能优化模式

### 📋 迁移检查清单 (Migration Checklist)
查看 [MIGRATION_CHECKLIST.md](./MIGRATION_CHECKLIST.md) 获取：
- 详细的迁移步骤
- 验证检查点
- 自动化工具使用
- 最佳实践建议

## 🔧 工具使用说明 (Tool Usage Instructions)

### 验证脚本 (Validation Script)
```bash
# 基本用法
node apps/.template/validate-app-structure.js <app-path>

# 示例
node apps/.template/validate-app-structure.js apps/web
```

**输出说明**:
- ✅ 绿色 - 通过的检查
- ⚠️ 黄色 - 警告 (建议修复)
- ❌ 红色 - 错误 (必须修复)
- ℹ️ 蓝色 - 信息提示

### 标准化脚本 (Standardization Script)
```bash
# 预览模式
node apps/.template/standardize-app.js --dry-run <app-path>

# 执行标准化
node apps/.template/standardize-app.js <app-path>

# 强制覆盖
node apps/.template/standardize-app.js --force <app-path>

# 帮助信息
node apps/.template/standardize-app.js --help
```

**选项说明**:
- `--dry-run, -n` - 预览模式，不实际修改文件
- `--force, -f` - 强制覆盖现有文件
- `--help, -h` - 显示帮助信息

## 📊 标准化效果 (Standardization Benefits)

### 一致性改进 (Consistency Improvements)
- 🎯 统一的目录结构
- 📝 一致的文件命名
- 🔧 标准化的配置文件
- 📦 统一的依赖管理

### 开发效率提升 (Development Efficiency)
- ⚡ 更快的项目导航
- 🔍 简化的代码查找
- 🛠️ 统一的开发工具
- 📚 清晰的文档结构

### 维护性增强 (Maintainability Enhancement)
- 🔄 简化的重构过程
- 🧪 一致的测试策略
- 🚀 标准化的部署流程
- 👥 降低团队学习成本

## 🎯 最佳实践 (Best Practices)

### 新应用开发 (New Application Development)
1. 从模板开始创建新应用
2. 遵循标准的目录结构
3. 使用统一的命名规范
4. 定期运行验证脚本

### 现有应用维护 (Existing Application Maintenance)
1. 定期运行验证脚本检查合规性
2. 使用标准化脚本自动修复问题
3. 遵循迁移检查清单进行更新
4. 保持文档和配置同步

### 团队协作 (Team Collaboration)
1. 在 PR 中包含结构验证
2. 定期审查和更新标准
3. 分享最佳实践和经验
4. 培训新团队成员

## 🔄 持续改进 (Continuous Improvement)

### 定期审查 (Regular Reviews)
- 每月检查标准的执行情况
- 季度评估工具的有效性
- 半年度更新标准和最佳实践

### 反馈收集 (Feedback Collection)
- 收集团队使用反馈
- 识别常见问题和痛点
- 持续优化工具和流程

### 版本管理 (Version Management)
- 跟踪标准的版本变化
- 记录重要的更新和改进
- 提供迁移指南和支持

## 🆘 故障排除 (Troubleshooting)

### 常见问题 (Common Issues)

**验证脚本报错**
```bash
# 确保 Node.js 版本 >= 18
node --version

# 确保在正确的目录运行
pwd
```

**标准化脚本失败**
```bash
# 检查文件权限
ls -la apps/your-app

# 确保目录存在
mkdir -p apps/your-app/src
```

**配置文件冲突**
```bash
# 备份现有配置
cp package.json package.json.backup

# 手动合并配置
# 编辑 package.json
```

### 获取帮助 (Getting Help)
1. 查看相关文档和指南
2. 运行工具的 `--help` 选项
3. 检查 Git 提交历史中的示例
4. 向团队寻求支持

---

## 📞 联系和支持 (Contact and Support)

如有问题或建议，请：
1. 创建 Issue 描述问题
2. 提交 PR 改进工具和文档
3. 在团队会议中讨论

---

**注意**: 本工具和标准会随着项目发展持续更新。请定期检查最新版本的文档和工具。