# 统一应用结构标准 (Unified Application Structure Standards)

## 概述 (Overview)

本文档定义了 monorepo 中所有子应用的统一结构标准，基于现有最佳实践，确保代码组织的一致性、可维护性和开发效率。

## 标准目录结构 (Standard Directory Structure)

### 根级别结构 (Root Level Structure)
```
app-name/
├── src/                     # 源代码目录
├── public/                  # 静态资源
├── e2e/                     # 端到端测试
├── scripts/                 # 应用特定脚本
├── docs/                    # 应用文档 (可选)
├── package.json             # 依赖和脚本配置
├── next.config.mjs          # Next.js 配置
├── tsconfig.json            # TypeScript 配置
├── biome.json               # 代码质量配置
├── vitest.config.ts         # 单元测试配置
├── playwright.config.ts     # E2E 测试配置
├── tailwind.config.mjs      # 样式配置
├── postcss.config.mjs       # PostCSS 配置
├── vercel.json              # 部署配置
├── .env.example             # 环境变量模板
├── .env.development         # 开发环境变量
├── .env.production          # 生产环境变量
├── .env.test                # 测试环境变量
├── .gitignore               # Git 忽略文件
└── README.md                # 应用文档
```

### src 目录结构 (Source Directory Structure)
```
src/
├── app/                     # Next.js App Router 页面
│   ├── layout.tsx           # 根布局组件
│   ├── page.tsx             # 首页组件
│   ├── loading.tsx          # 加载状态组件
│   ├── not-found.tsx        # 404 页面组件
│   ├── globals.css          # 全局样式
│   ├── favicon.ico          # 网站图标
│   ├── api/                 # API 路由 (可选)
│   └── [feature]/           # 功能页面目录
├── components/              # React 组件
│   ├── ui/                  # 基础 UI 组件
│   ├── layout/              # 布局相关组件
│   ├── features/            # 功能组件
│   ├── theme/               # 主题相关组件
│   ├── shared/              # 共享组件
│   └── index.ts             # 组件统一导出
├── lib/                     # 工具库和配置
│   ├── utils/               # 工具函数
│   ├── api/                 # API 相关工具 (可选)
│   └── index.ts             # 库统一导出
├── hooks/                   # 自定义 React Hooks
│   └── index.ts             # Hooks 统一导出
├── stores/                  # 状态管理 (Zustand)
│   └── index.ts             # Store 统一导出
├── types/                   # TypeScript 类型定义
│   ├── config.ts            # 配置相关类型
│   ├── css-modules.d.ts     # CSS 模块类型 (可选)
│   └── index.ts             # 类型统一导出
├── config/                  # 应用配置
│   ├── index.ts             # 主配置文件
│   ├── env.ts               # 环境变量配置
│   ├── metadata.ts          # 元数据配置
│   └── features.ts          # 功能开关配置 (可选)
├── test/                    # 测试工具和配置
│   └── setup.ts             # 测试环境设置
├── content/                 # 内容文件 (blog 应用特有)
└── middleware.ts            # Next.js 中间件
```

## 文件命名规范 (File Naming Conventions)

### 通用规则 (General Rules)
- **目录名**: 使用 kebab-case (例: `user-profile`, `api-client`)
- **React 组件**: 使用 PascalCase (例: `UserProfile.tsx`, `ApiClient.tsx`)
- **工具函数**: 使用 camelCase (例: `formatDate.ts`, `validateEmail.ts`)
- **常量文件**: 使用 UPPER_SNAKE_CASE (例: `API_ENDPOINTS.ts`, `DEFAULT_CONFIG.ts`)
- **类型文件**: 使用 kebab-case (例: `user-types.ts`, `api-types.ts`)
- **配置文件**: 使用 kebab-case (例: `database-config.ts`, `auth-config.ts`)

### 特殊文件命名 (Special File Naming)
- **页面组件**: `page.tsx`
- **布局组件**: `layout.tsx`
- **加载组件**: `loading.tsx`
- **错误组件**: `error.tsx`
- **未找到页面**: `not-found.tsx`
- **统一导出**: `index.ts`
- **测试文件**: `*.test.ts` 或 `*.spec.ts`
- **类型声明**: `*.d.ts`

## 组件组织模式 (Component Organization Patterns)

### UI 组件结构 (UI Components Structure)
```
components/ui/
├── button/
│   ├── button.tsx           # 主组件
│   ├── button.test.ts       # 测试文件
│   └── index.ts             # 导出文件
├── card/
│   ├── card.tsx
│   ├── card.test.ts
│   └── index.ts
└── index.ts                 # 统一导出所有 UI 组件
```

### 功能组件结构 (Feature Components Structure)
```
components/features/
├── auth/
│   ├── login-form.tsx
│   ├── signup-form.tsx
│   ├── auth-provider.tsx
│   └── index.ts
├── navigation/
│   ├── main-nav.tsx
│   ├── mobile-nav.tsx
│   ├── breadcrumb.tsx
│   └── index.ts
└── index.ts                 # 统一导出所有功能组件
```

### 布局组件结构 (Layout Components Structure)
```
components/layout/
├── header.tsx
├── footer.tsx
├── sidebar.tsx
├── main-layout.tsx
└── index.ts
```

## 工具函数组织 (Utility Functions Organization)

### 工具函数分类 (Utility Categories)
```
lib/utils/
├── date/
│   ├── format-date.ts
│   ├── parse-date.ts
│   └── index.ts
├── string/
│   ├── capitalize.ts
│   ├── truncate.ts
│   └── index.ts
├── validation/
│   ├── email.ts
│   ├── password.ts
│   └── index.ts
├── api/
│   ├── client.ts
│   ├── error-handler.ts
│   └── index.ts
└── index.ts                 # 统一导出所有工具函数
```

## 导入导出规范 (Import/Export Conventions)

### 统一导出模式 (Unified Export Pattern)
每个目录都应该有一个 `index.ts` 文件用于统一导出：

```typescript
// components/index.ts
export * from './ui'
export * from './layout'
export * from './features'
export * from './theme'
```

### 导入路径别名 (Import Path Aliases)
标准化的路径别名配置：

```typescript
// tsconfig.json paths
{
  "@/*": ["./src/*"],
  "@/components": ["./src/components"],
  "@/lib": ["./src/lib"],
  "@/hooks": ["./src/hooks"],
  "@/stores": ["./src/stores"],
  "@/types": ["./src/types"],
  "@/config": ["./src/config"],
  "@/app": ["./src/app"]
}
```

### 导入顺序规范 (Import Order Convention)
```typescript
// 1. Node.js 内置模块
import { readFile } from 'fs/promises'

// 2. 第三方库
import React from 'react'
import { NextRequest } from 'next/server'

// 3. 内部模块 (按字母顺序)
import { Button } from '@/components'
import { formatDate } from '@/lib'
import { UserType } from '@/types'

// 4. 相对导入
import './styles.css'
```

## 代码风格和架构模式 (Code Style and Architecture Patterns)

### React 组件模式 (React Component Patterns)

#### 1. 函数组件标准结构
```typescript
import React from 'react'
import { cn } from '@/lib/utils'

interface ComponentProps {
  className?: string
  children?: React.ReactNode
}

export function Component({ className, children }: ComponentProps) {
  return (
    <div className={cn('default-classes', className)}>
      {children}
    </div>
  )
}
```

#### 2. 带状态的组件结构
```typescript
'use client'

import React, { useState, useEffect } from 'react'
import { useStore } from '@/stores'

interface StatefulComponentProps {
  initialValue?: string
}

export function StatefulComponent({ initialValue = '' }: StatefulComponentProps) {
  const [value, setValue] = useState(initialValue)
  const { state, actions } = useStore()

  useEffect(() => {
    // 副作用逻辑
  }, [])

  return (
    <div>
      {/* 组件内容 */}
    </div>
  )
}
```

### 状态管理模式 (State Management Patterns)

#### Zustand Store 标准结构
```typescript
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

interface StoreState {
  // 状态定义
}

interface StoreActions {
  // 动作定义
}

export const useStore = create<StoreState & StoreActions>()(
  immer((set, get) => ({
    // 初始状态
    
    // 动作实现
  }))
)
```

### API 客户端模式 (API Client Patterns)

#### 标准 API 客户端结构
```typescript
// lib/api/client.ts
class ApiClient {
  private baseURL: string
  
  constructor(baseURL: string) {
    this.baseURL = baseURL
  }
  
  async get<T>(endpoint: string): Promise<T> {
    // GET 请求实现
  }
  
  async post<T>(endpoint: string, data: unknown): Promise<T> {
    // POST 请求实现
  }
}

export const apiClient = new ApiClient(process.env.API_BASE_URL!)
```

### 错误处理模式 (Error Handling Patterns)

#### 统一错误处理
```typescript
// lib/utils/error-handler.ts
export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export function handleApiError(error: unknown): AppError {
  // 错误处理逻辑
}
```

## 配置文件标准 (Configuration File Standards)

### package.json 标准脚本 (Standard Scripts)
```json
{
  "scripts": {
    "dev": "node scripts/load-env.js && next dev --port [PORT]",
    "build": "next build",
    "start": "next start --port [PORT]",
    "clean": "rimraf .next",
    "lint": "biome lint .",
    "lint:fix": "biome lint --apply .",
    "format": "biome format --write .",
    "format:check": "biome format .",
    "check": "biome check --write .",
    "check:fix": "biome check --apply .",
    "type-check": "tsc --noEmit",
    "test": "vitest",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "npx playwright test",
    "test:e2e:ui": "npx playwright test --ui",
    "depcheck": "pnpm dlx depcheck",
    "preview": "next build && next start"
  }
}
```

### 环境变量管理 (Environment Variables Management)
```bash
# .env.example
# 应用配置
NEXT_PUBLIC_APP_NAME="App Name"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# API 配置
API_BASE_URL="http://localhost:3001/api"

# 数据库配置 (如果需要)
DATABASE_URL="postgresql://..."

# 第三方服务配置
CLERK_SECRET_KEY="sk_..."
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_..."
```

## 测试策略标准 (Testing Strategy Standards)

### 单元测试结构 (Unit Test Structure)
```typescript
// components/ui/button/button.test.ts
import { render, screen } from '@testing-library/react'
import { Button } from './button'

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })
  
  it('applies custom className', () => {
    render(<Button className="custom-class">Click me</Button>)
    expect(screen.getByRole('button')).toHaveClass('custom-class')
  })
})
```

### E2E 测试结构 (E2E Test Structure)
```typescript
// e2e/app.spec.ts
import { test, expect } from '@playwright/test'

test.describe('App', () => {
  test('should load homepage', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/App Name/)
  })
})
```

## 性能优化标准 (Performance Optimization Standards)

### 代码分割模式 (Code Splitting Patterns)
```typescript
// 懒加载组件
import { lazy, Suspense } from 'react'

const LazyComponent = lazy(() => import('./heavy-component'))

export function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LazyComponent />
    </Suspense>
  )
}
```

### 图片优化 (Image Optimization)
```typescript
import Image from 'next/image'

export function OptimizedImage() {
  return (
    <Image
      src="/image.jpg"
      alt="Description"
      width={800}
      height={600}
      priority={false}
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,..."
    />
  )
}
```

## 文档标准 (Documentation Standards)

### README.md 模板 (README Template)
```markdown
# App Name

Brief description of the application.

## Features

- Feature 1
- Feature 2

## Getting Started

### Prerequisites
- Node.js 22.x
- pnpm 9.15.9

### Installation
```bash
pnpm install
```

### Development
```bash
pnpm dev
```

### Build
```bash
pnpm build
```

## Environment Variables

Copy `.env.example` to `.env.local` and fill in the required values.

## Testing

- Unit tests: `pnpm test`
- E2E tests: `pnpm test:e2e`

## Deployment

This app can be deployed to Vercel, Netlify, or any Node.js hosting platform.
```

### 组件文档标准 (Component Documentation Standards)
```typescript
/**
 * Button component with multiple variants and sizes
 * 
 * @example
 * ```tsx
 * <Button variant="primary" size="lg">
 *   Click me
 * </Button>
 * ```
 */
export interface ButtonProps {
  /** Button content */
  children: React.ReactNode
  /** Button variant */
  variant?: 'primary' | 'secondary' | 'outline'
  /** Button size */
  size?: 'sm' | 'md' | 'lg'
  /** Additional CSS classes */
  className?: string
  /** Click handler */
  onClick?: () => void
}
```

## 迁移检查清单 (Migration Checklist)

当标准化现有应用时，请按以下清单执行：

### 目录结构检查 (Directory Structure Check)
- [ ] 确认 src 目录结构符合标准
- [ ] 检查组件目录组织是否正确
- [ ] 验证工具函数分类是否合理
- [ ] 确认配置文件位置正确

### 文件命名检查 (File Naming Check)
- [ ] 组件文件使用 PascalCase
- [ ] 工具函数使用 camelCase
- [ ] 目录名使用 kebab-case
- [ ] 类型文件命名规范

### 代码风格检查 (Code Style Check)
- [ ] 导入顺序符合规范
- [ ] 组件结构标准化
- [ ] 错误处理统一
- [ ] 状态管理模式一致

### 配置文件检查 (Configuration Check)
- [ ] package.json 脚本标准化
- [ ] TypeScript 配置统一
- [ ] 测试配置完整
- [ ] 环境变量规范

### 测试覆盖检查 (Test Coverage Check)
- [ ] 关键组件有单元测试
- [ ] E2E 测试覆盖主要流程
- [ ] 测试配置正确
- [ ] 测试命名规范

### 文档完整性检查 (Documentation Check)
- [ ] README.md 完整
- [ ] 组件文档齐全
- [ ] API 文档清晰
- [ ] 部署说明详细

## 持续改进 (Continuous Improvement)

### 定期审查 (Regular Reviews)
- 每月审查目录结构是否需要调整
- 季度评估命名规范的执行情况
- 半年度检查架构模式的适用性

### 工具支持 (Tool Support)
- 使用 ESLint/Biome 强制执行代码风格
- 配置 Prettier 自动格式化
- 设置 pre-commit hooks 检查规范

### 团队培训 (Team Training)
- 新成员入职培训标准规范
- 定期分享最佳实践
- 建立代码审查标准

---

本标准文档将随着项目发展持续更新和完善。如有建议或问题，请提交 Issue 或 PR。