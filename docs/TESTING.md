# 测试指南

本项目使用现代化的测试工具链，包括 Vitest 用于单元测试和 Playwright 用于端到端测试。

## 测试工具

### Vitest
- **单元测试**: 替代 Jest，提供更快的测试执行速度
- **覆盖率报告**: 使用 v8 引擎提供准确的代码覆盖率
- **UI 界面**: 提供可视化的测试运行界面

### Playwright
- **E2E 测试**: 跨浏览器的端到端测试
- **多浏览器支持**: Chrome、Firefox、Safari、移动端
- **并行执行**: 提高测试执行效率

### Biome
- **代码检查**: 快速的 linting 和格式化
- **TypeScript 支持**: 原生 TypeScript 支持
- **统一配置**: 整个 monorepo 的统一代码风格

## 测试命令

### 单元测试
```bash
# 运行所有单元测试
pnpm test

# 监听模式运行测试
pnpm test:watch

# 运行测试 UI 界面
pnpm test:ui

# 生成覆盖率报告
pnpm test:coverage
```

### E2E 测试
```bash
# 运行 E2E 测试
pnpm test:e2e

# 运行 E2E 测试 UI 界面
pnpm test:e2e:ui
```

### 代码质量检查
```bash
# 运行所有质量检查
pnpm quality-check

# 运行质量检查并自动修复
pnpm quality-check:fix

# 单独运行类型检查
pnpm type-check

# 单独运行 Biome 检查
pnpm check
```

## 测试结构

### 单元测试
- 测试文件位置: `src/**/*.{test,spec}.{ts,tsx}`
- 配置文件: `vitest.config.ts`
- 测试设置: `src/test-setup.ts`

### E2E 测试
- 测试文件位置: `e2e/**/*.spec.ts`
- 配置文件: `playwright.config.ts`

## 包级别测试配置

### packages/utils
- 纯函数测试
- Node.js 环境
- 高覆盖率要求

### packages/ui
- React 组件测试
- JSDOM 环境
- 用户交互测试

### apps/*
- 应用级别测试
- Next.js 环境模拟
- 路由和导航测试

## 最佳实践

### 单元测试
1. **测试命名**: 使用描述性的测试名称
2. **测试结构**: 遵循 AAA 模式 (Arrange, Act, Assert)
3. **Mock 使用**: 合理使用 mock 隔离依赖
4. **覆盖率**: 保持高覆盖率，但不追求 100%

### E2E 测试
1. **用户场景**: 测试真实的用户使用场景
2. **页面对象**: 使用页面对象模式组织测试代码
3. **等待策略**: 使用显式等待而非固定延时
4. **数据隔离**: 每个测试使用独立的测试数据

### 代码质量
1. **自动化**: 在 CI/CD 中集成所有检查
2. **预提交**: 使用 git hooks 在提交前运行检查
3. **增量检查**: 只检查变更的文件以提高效率
4. **统一标准**: 整个团队使用相同的代码标准

## CI/CD 集成

项目配置了 GitHub Actions 工作流，包括：

1. **质量检查**: Biome linting、TypeScript 类型检查
2. **单元测试**: 所有包和应用的单元测试
3. **E2E 测试**: 跨浏览器的端到端测试
4. **构建验证**: 确保所有应用可以正常构建

## 故障排除

### 常见问题

1. **测试超时**: 增加测试超时时间或优化测试逻辑
2. **Mock 问题**: 检查 mock 配置和清理
3. **环境问题**: 确保测试环境配置正确
4. **依赖问题**: 检查测试依赖是否正确安装

### 调试技巧

1. **使用 test.only**: 只运行特定测试
2. **添加日志**: 在测试中添加 console.log
3. **使用调试器**: 在 VS Code 中调试测试
4. **查看覆盖率**: 使用覆盖率报告找到未测试的代码

## 性能优化

1. **并行执行**: 利用 Vitest 和 Playwright 的并行能力
2. **缓存策略**: 使用 Turbo 缓存测试结果
3. **选择性运行**: 只运行相关的测试
4. **资源清理**: 及时清理测试资源和 mock