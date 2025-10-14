# Design Document

## Overview

本设计文档详细描述了 web 子应用代码精简和重构的技术方案。基于对现有代码的分析，我们将采用渐进式重构策略，确保在优化代码质量的同时保持应用功能的完整性。

### 当前状态分析

**技术栈现状：**
- Next.js 15 with App Router
- React 19 
- TypeScript 5.9
- Tailwind CSS 4.1
- Biome (代码质量工具)
- Vitest (测试框架)

**发现的问题：**
1. 未使用的依赖包（9个 Radix UI 组件包 + critters）
2. 配置文件过于复杂，包含一些不必要的优化
3. 组件导出结构可以进一步优化
4. 缺少一致的代码组织模式
5. 部分配置可能与 Next.js 15 最佳实践不符

## Architecture

### 重构架构原则

1. **渐进式重构** - 分阶段进行，确保每个阶段都可以独立验证
2. **最小化变更** - 优先进行低风险的优化
3. **性能优先** - 重点关注 bundle 大小和运行时性能
4. **可维护性** - 提升代码的可读性和可维护性
5. **类型安全** - 加强 TypeScript 类型定义

### 目录结构优化

```
src/
├── app/                    # Next.js App Router
│   ├── (routes)/          # 路由组织
│   ├── api/               # API 路由
│   ├── globals.css        # 全局样式
│   ├── layout.tsx         # 根布局
│   └── page.tsx           # 首页
├── components/            # 组件库
│   ├── ui/               # 基础 UI 组件
│   ├── layout/           # 布局组件
│   ├── features/         # 功能组件
│   └── index.ts          # 统一导出
├── lib/                  # 工具库
│   ├── utils/           # 通用工具
│   ├── hooks/           # 自定义 Hooks
│   ├── constants/       # 常量定义
│   └── types/           # 类型定义
├── config/              # 配置文件
│   ├── env.ts          # 环境变量
│   ├── metadata.ts     # SEO 元数据
│   └── features.ts     # 功能开关
└── styles/             # 样式文件
    └── globals.css     # 全局样式
```## Co
mponents and Interfaces

### 组件重构策略

#### 1. UI 组件层次结构
```typescript
// 基础 UI 组件接口
interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
  'data-testid'?: string;
}

// 扩展组件接口
interface ExtendedComponentProps<T = {}> extends BaseComponentProps {
  variant?: string;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
} & T
```

#### 2. 组件导出优化
- 统一使用 barrel exports (index.ts)
- 按功能模块分组导出
- 提供类型安全的组件接口

#### 3. 布局组件重构
```typescript
// 优化后的布局组件结构
interface LayoutProps {
  children: React.ReactNode;
  className?: string;
  showNavbar?: boolean;
  showFooter?: boolean;
}

// 响应式布局组件
interface ResponsiveLayoutProps extends LayoutProps {
  breakpoint?: 'sm' | 'md' | 'lg' | 'xl';
  sidebar?: React.ReactNode;
}
```

### 配置系统重构

#### 1. 环境配置优化
```typescript
// 简化的环境配置接口
interface WebEnvConfig {
  NODE_ENV: 'development' | 'production' | 'test';
  NEXT_PUBLIC_APP_NAME: string;
  NEXT_PUBLIC_APP_URL: string;
  // 移除不必要的配置项
}

// 客户端安全配置
interface ClientConfig {
  appName: string;
  appUrl: string;
  features: FeatureFlags;
}
```

#### 2. 功能开关系统
```typescript
interface FeatureFlags {
  darkMode: boolean;
  animations: boolean;
  accessibility: boolean;
  // 移除实验性功能标志
}
```

## Data Models

### 类型定义重构

#### 1. 核心数据类型
```typescript
// 用户界面相关类型
interface UIState {
  theme: 'light' | 'dark' | 'system';
  sidebarOpen: boolean;
  loading: boolean;
}

// 导航相关类型
interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon?: React.ComponentType;
  external?: boolean;
}

// 页面元数据类型
interface PageMetadata {
  title: string;
  description: string;
  keywords: string[];
  image?: string;
}
```

#### 2. API 响应类型
```typescript
// 标准 API 响应格式
interface ApiResponse<T = unknown> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

// 分页响应类型
interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
```## Error 
Handling

### 错误处理策略

#### 1. 全局错误边界
```typescript
// React 错误边界组件
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

// 错误类型定义
type AppError = {
  code: string;
  message: string;
  details?: unknown;
  timestamp: Date;
};
```

#### 2. API 错误处理
```typescript
// API 错误处理工具
class ApiErrorHandler {
  static handle(error: unknown): AppError;
  static isNetworkError(error: unknown): boolean;
  static isValidationError(error: unknown): boolean;
}
```

#### 3. 用户友好的错误显示
- 使用 toast 通知显示非关键错误
- 使用错误页面显示关键错误
- 提供错误恢复机制

### 性能监控

#### 1. 性能指标收集
```typescript
// 性能指标接口
interface PerformanceMetrics {
  fcp: number; // First Contentful Paint
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  ttfb: number; // Time to First Byte
}
```

#### 2. 错误日志记录
```typescript
// 错误日志接口
interface ErrorLog {
  id: string;
  timestamp: Date;
  level: 'error' | 'warn' | 'info';
  message: string;
  stack?: string;
  userAgent: string;
  url: string;
}
```

## Testing Strategy

### 测试架构

#### 1. 单元测试策略
- 使用 Vitest 进行单元测试
- 重点测试工具函数和 Hooks
- 组件测试使用 React Testing Library
- 目标覆盖率：80%+

#### 2. 集成测试策略
- 使用 Playwright 进行 E2E 测试
- 测试关键用户流程
- 跨浏览器兼容性测试

#### 3. 性能测试
- Bundle 大小监控
- 页面加载性能测试
- 运行时性能监控

### 测试工具配置

#### 1. Vitest 配置优化
```typescript
// vitest.config.ts 优化
export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
      ],
    },
  },
});
```

#### 2. 测试辅助工具
```typescript
// 测试工具函数
export const testUtils = {
  renderWithProviders: (ui: React.ReactElement) => ReactElement,
  createMockRouter: () => NextRouter,
  waitForLoadingToFinish: () => Promise<void>,
};
```#
# 配置文件优化设计

### Next.js 配置简化

#### 1. next.config.mjs 优化原则
- 移除过度优化的配置
- 保留 Next.js 15 推荐的配置
- 简化 webpack 配置
- 使用 Turbopack 默认优化

```typescript
// 简化后的 Next.js 配置结构
interface OptimizedNextConfig {
  reactStrictMode: boolean;
  experimental: {
    optimizePackageImports: string[];
    turbo: TurboConfig;
  };
  images: ImageConfig;
  env: Record<string, string>;
}
```

#### 2. TypeScript 配置优化
- 移除不必要的严格检查
- 优化编译性能
- 简化路径映射

#### 3. Tailwind 配置精简
- 移除未使用的插件
- 简化主题配置
- 优化 purge 设置

### 依赖管理优化

#### 1. 依赖清理策略
**需要移除的依赖：**
- `@radix-ui/react-alert-dialog` - 未使用
- `@radix-ui/react-avatar` - 未使用  
- `@radix-ui/react-collapsible` - 未使用
- `@radix-ui/react-dialog` - 未使用
- `@radix-ui/react-dropdown-menu` - 未使用
- `@radix-ui/react-label` - 未使用
- `@radix-ui/react-select` - 未使用
- `@radix-ui/react-separator` - 未使用
- `@radix-ui/react-switch` - 未使用
- `critters` - Next.js 15 内置优化

#### 2. 依赖版本对齐
- 确保所有依赖使用最新稳定版本
- 检查依赖兼容性
- 优化 peer dependencies

### 代码分割和懒加载优化

#### 1. 组件懒加载策略
```typescript
// 动态导入组件
const LazyComponent = dynamic(() => import('./Component'), {
  loading: () => <ComponentSkeleton />,
  ssr: false, // 根据需要配置
});
```

#### 2. 路由级别代码分割
```typescript
// 页面级别懒加载
const HomePage = dynamic(() => import('./pages/HomePage'));
const AboutPage = dynamic(() => import('./pages/AboutPage'));
```

#### 3. 第三方库优化
- 使用 tree-shaking 友好的导入方式
- 按需导入 Radix UI 组件
- 优化 Lucide React 图标导入

## 实施计划

### 阶段 1：依赖清理和配置优化
1. 移除未使用的依赖包
2. 简化配置文件
3. 更新 package.json 脚本

### 阶段 2：代码结构重构
1. 重组组件目录结构
2. 优化导出方式
3. 统一命名约定

### 阶段 3：类型定义完善
1. 完善 TypeScript 类型定义
2. 移除 any 类型使用
3. 添加严格的类型检查

### 阶段 4：性能优化
1. 实施代码分割
2. 优化图片和资源加载
3. 实施缓存策略

### 阶段 5：测试和验证
1. 添加单元测试
2. 性能测试
3. 功能回归测试

## 预期收益

### 性能提升
- Bundle 大小减少 15-20%
- 首屏加载时间优化 10-15%
- 构建时间减少 20-25%

### 开发体验改善
- 更清晰的代码结构
- 更好的类型安全
- 更快的开发服务器启动

### 维护性提升
- 减少技术债务
- 提高代码可读性
- 简化配置管理