# 应用标准化迁移检查清单 (Application Standardization Migration Checklist)

本文档提供了将现有应用迁移到统一结构标准的详细检查清单。

## 迁移前准备 (Pre-Migration Preparation)

### 1. 备份和版本控制 (Backup and Version Control)
- [ ] 确保所有更改已提交到 Git
- [ ] 创建迁移分支: `git checkout -b standardize-app-structure`
- [ ] 备份重要配置文件

### 2. 依赖检查 (Dependency Check)
- [ ] 运行 `pnpm depcheck` 检查未使用的依赖
- [ ] 记录当前的构建时间和包大小作为基准
- [ ] 确保所有测试通过

## 目录结构迁移 (Directory Structure Migration)

### 3. 创建标准目录结构 (Create Standard Directory Structure)
- [ ] `src/` - 源代码根目录
- [ ] `src/app/` - Next.js App Router 页面
- [ ] `src/components/` - React 组件
  - [ ] `src/components/ui/` - 基础 UI 组件
  - [ ] `src/components/layout/` - 布局组件
  - [ ] `src/components/features/` - 功能组件
  - [ ] `src/components/theme/` - 主题组件
- [ ] `src/lib/` - 工具库
  - [ ] `src/lib/utils/` - 工具函数
  - [ ] `src/lib/api/` - API 相关工具 (可选)
- [ ] `src/hooks/` - 自定义 React Hooks
- [ ] `src/stores/` - 状态管理 (Zustand)
- [ ] `src/types/` - TypeScript 类型定义
- [ ] `src/config/` - 应用配置
- [ ] `src/test/` - 测试工具和配置
- [ ] `e2e/` - 端到端测试
- [ ] `public/` - 静态资源
- [ ] `scripts/` - 应用特定脚本

### 4. 移动现有文件 (Move Existing Files)
- [ ] 将页面组件移动到 `src/app/` 目录
- [ ] 按功能分类组织组件到相应子目录
- [ ] 将工具函数移动到 `src/lib/utils/`
- [ ] 将类型定义移动到 `src/types/`
- [ ] 将配置文件移动到 `src/config/`

## 文件标准化 (File Standardization)

### 5. 必需文件检查 (Required Files Check)
- [ ] `package.json` - 依赖和脚本配置
- [ ] `next.config.mjs` - Next.js 配置
- [ ] `tsconfig.json` - TypeScript 配置
- [ ] `biome.json` - 代码质量配置
- [ ] `vitest.config.ts` - 单元测试配置
- [ ] `playwright.config.ts` - E2E 测试配置
- [ ] `tailwind.config.mjs` - 样式配置
- [ ] `postcss.config.mjs` - PostCSS 配置
- [ ] `.env.example` - 环境变量模板
- [ ] `README.md` - 应用文档

### 6. App Router 文件 (App Router Files)
- [ ] `src/app/layout.tsx` - 根布局组件
- [ ] `src/app/page.tsx` - 首页组件
- [ ] `src/app/loading.tsx` - 加载状态组件
- [ ] `src/app/not-found.tsx` - 404 页面组件
- [ ] `src/app/globals.css` - 全局样式
- [ ] `src/app/favicon.ico` - 网站图标 (可选)

### 7. 统一导出文件 (Unified Export Files)
- [ ] `src/components/index.ts` - 组件统一导出
- [ ] `src/lib/index.ts` - 工具库统一导出
- [ ] `src/hooks/index.ts` - Hooks 统一导出
- [ ] `src/stores/index.ts` - Store 统一导出
- [ ] `src/types/index.ts` - 类型统一导出
- [ ] `src/config/index.ts` - 配置统一导出

### 8. 中间件和配置 (Middleware and Configuration)
- [ ] `src/middleware.ts` - Next.js 中间件
- [ ] `src/test/setup.ts` - 测试环境设置

## 配置文件更新 (Configuration File Updates)

### 9. package.json 标准化 (package.json Standardization)
- [ ] 设置 `"type": "module"`
- [ ] 添加 `engines` 字段指定 Node.js 和 pnpm 版本
- [ ] 标准化脚本命令:
  - [ ] `dev` - 开发服务器
  - [ ] `build` - 构建应用
  - [ ] `start` - 启动生产服务器
  - [ ] `lint` - 代码检查
  - [ ] `lint:fix` - 自动修复代码问题
  - [ ] `format` - 代码格式化
  - [ ] `format:check` - 检查代码格式
  - [ ] `check` - 综合检查
  - [ ] `check:fix` - 自动修复
  - [ ] `type-check` - 类型检查
  - [ ] `test` - 运行测试
  - [ ] `test:run` - 单次运行测试
  - [ ] `test:e2e` - E2E 测试
  - [ ] `depcheck` - 依赖检查
- [ ] 添加 `lint-staged` 配置
- [ ] 设置 `sideEffects: false`

### 10. TypeScript 配置 (TypeScript Configuration)
- [ ] 配置路径映射 (Path Mapping):
  - [ ] `"@/*": ["./src/*"]`
  - [ ] `"@/components": ["./src/components"]`
  - [ ] `"@/lib": ["./src/lib"]`
  - [ ] `"@/hooks": ["./src/hooks"]`
  - [ ] `"@/stores": ["./src/stores"]`
  - [ ] `"@/types": ["./src/types"]`
  - [ ] `"@/config": ["./src/config"]`
  - [ ] `"@/app": ["./src/app"]`
- [ ] 启用严格模式 (`"strict": true`)
- [ ] 配置 Next.js 相关设置

### 11. 代码质量工具配置 (Code Quality Tools Configuration)
- [ ] 配置 Biome 规则
- [ ] 设置 Tailwind CSS 配置
- [ ] 配置 PostCSS 处理器
- [ ] 设置测试配置 (Vitest + Playwright)

## 代码重构 (Code Refactoring)

### 12. 导入路径更新 (Import Path Updates)
- [ ] 将相对导入更新为绝对导入 (使用 @ 别名)
- [ ] 统一导入顺序:
  1. Node.js 内置模块
  2. 第三方库
  3. 内部模块 (按字母顺序)
  4. 相对导入
- [ ] 使用统一导出文件简化导入

### 13. 组件重构 (Component Refactoring)
- [ ] 确保所有组件使用 TypeScript
- [ ] 添加适当的 Props 接口定义
- [ ] 使用 `forwardRef` 支持 ref 传递 (如需要)
- [ ] 添加 `displayName` 属性
- [ ] 统一错误边界处理

### 14. 样式标准化 (Style Standardization)
- [ ] 使用 `cn` 工具函数组合类名
- [ ] 统一组件变体和尺寸系统
- [ ] 使用 CSS 变量进行主题配置
- [ ] 移除内联样式，使用 Tailwind 类

### 15. 状态管理标准化 (State Management Standardization)
- [ ] 将状态管理迁移到 Zustand (如适用)
- [ ] 使用 Immer 中间件处理复杂状态
- [ ] 添加 devtools 支持
- [ ] 创建选择器 Hooks

## 测试更新 (Testing Updates)

### 16. 测试配置 (Test Configuration)
- [ ] 配置 Vitest 单元测试
- [ ] 配置 Playwright E2E 测试
- [ ] 设置测试覆盖率阈值
- [ ] 配置测试环境变量

### 17. 测试文件迁移 (Test File Migration)
- [ ] 将测试文件移动到相应位置
- [ ] 更新测试中的导入路径
- [ ] 确保所有测试通过
- [ ] 添加缺失的测试用例

## 环境和部署 (Environment and Deployment)

### 18. 环境变量管理 (Environment Variables Management)
- [ ] 创建 `.env.example` 模板
- [ ] 分离开发、生产、测试环境配置
- [ ] 使用 Zod 验证环境变量
- [ ] 更新部署配置

### 19. 构建优化 (Build Optimization)
- [ ] 配置 Next.js 优化选项
- [ ] 设置代码分割策略
- [ ] 优化图片和静态资源
- [ ] 配置缓存策略

## 验证和测试 (Validation and Testing)

### 20. 自动化验证 (Automated Validation)
- [ ] 运行结构验证脚本: `node apps/.template/validate-app-structure.js`
- [ ] 检查所有 lint 规则通过: `pnpm check`
- [ ] 验证类型检查通过: `pnpm type-check`
- [ ] 确保所有测试通过: `pnpm test:run`

### 21. 功能测试 (Functional Testing)
- [ ] 验证开发服务器正常启动: `pnpm dev`
- [ ] 验证生产构建成功: `pnpm build`
- [ ] 测试所有页面和功能正常工作
- [ ] 验证 E2E 测试通过: `pnpm test:e2e`

### 22. 性能验证 (Performance Validation)
- [ ] 对比迁移前后的构建时间
- [ ] 检查包大小变化
- [ ] 验证运行时性能无回退
- [ ] 测试热重载功能

## 文档更新 (Documentation Updates)

### 23. 项目文档 (Project Documentation)
- [ ] 更新 README.md 文件
- [ ] 添加开发指南
- [ ] 更新部署说明
- [ ] 记录环境变量配置

### 24. 代码文档 (Code Documentation)
- [ ] 添加组件 JSDoc 注释
- [ ] 更新 API 文档
- [ ] 添加使用示例
- [ ] 更新故障排除指南

## 清理和优化 (Cleanup and Optimization)

### 25. 依赖清理 (Dependency Cleanup)
- [ ] 移除未使用的依赖: `pnpm depcheck`
- [ ] 更新过时的依赖
- [ ] 统一依赖版本
- [ ] 优化 bundle 大小

### 26. 代码清理 (Code Cleanup)
- [ ] 移除未使用的文件和代码
- [ ] 清理注释和调试代码
- [ ] 统一代码格式: `pnpm format`
- [ ] 修复所有 lint 警告

## 最终检查 (Final Verification)

### 27. 完整性检查 (Completeness Check)
- [ ] 所有必需文件存在
- [ ] 所有配置正确
- [ ] 所有测试通过
- [ ] 文档完整

### 28. 团队审查 (Team Review)
- [ ] 代码审查通过
- [ ] 功能验证完成
- [ ] 性能测试通过
- [ ] 部署测试成功

### 29. 提交更改 (Commit Changes)
- [ ] 提交所有更改到 Git
- [ ] 创建 Pull Request
- [ ] 更新 CHANGELOG
- [ ] 标记版本 (如适用)

## 迁移后维护 (Post-Migration Maintenance)

### 30. 持续监控 (Continuous Monitoring)
- [ ] 设置代码质量监控
- [ ] 配置性能监控
- [ ] 建立定期检查流程
- [ ] 更新团队培训材料

---

## 自动化工具 (Automation Tools)

### 使用标准化脚本
```bash
# 预览迁移效果
node apps/.template/standardize-app.js --dry-run apps/your-app

# 执行自动迁移
node apps/.template/standardize-app.js apps/your-app

# 验证迁移结果
node apps/.template/validate-app-structure.js apps/your-app
```

### 批量处理多个应用
```bash
# 同时处理多个应用
node apps/.template/standardize-app.js apps/web apps/blog apps/hub

# 验证所有应用
for app in web blog hub; do
  echo "验证 $app..."
  node apps/.template/validate-app-structure.js apps/$app
done
```

---

**注意**: 这个检查清单应该根据具体应用的需求进行调整。某些步骤可能不适用于所有应用类型。