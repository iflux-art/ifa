# Design Document

## Overview

本设计文档详细描述了 hub 子应用代码精简和重构的技术方案。基于对现有代码的分析，我们将采用渐进式重构策略，特别关注 Clerk 认证集成和链接管理功能的优化。

### 当前状态分析

**技术栈现状：**
- Next.js 15 with App Router
- React 19 
- TypeScript 5.9
- Clerk 6.32 (认证服务)
- Tailwind CSS 4.1
- Zustand (状态管理)
- Cheerio (HTML 解析)
- Biome (代码质量工具)

**发现的问题：**
1. 未使用的依赖包（fast-glob、@testing-library/react、@testing-library/user-event）
2. 所有 Radix UI 组件包都存在但可能未全部使用
3. 配置文件可能包含不必要的复杂性
4. 链接数据处理可能需要性能优化
5. Clerk 集成可能需要类型定义完善

## Architecture

### 重构架构原则

1. **认证优先** - 优化 Clerk 认证集成和用户体验
2. **数据驱动** - 优化链接数据的管理和展示
3. **类型安全** - 完善 Clerk 和链接相关的 TypeScript 类型定义
4. **性能优化** - 重点关注数据加载和渲染性能
5. **用户体验** - 优化链接管理的交互体验

### 目录结构优化

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # 认证相关路由组
│   │   ├── sign-in/       # 登录页面
│   │   └── sign-up/       # 注册页面
│   ├── (dashboard)/       # 仪表板路由组
│   │   ├── links/         # 链接管理
│   │   ├── categories/    # 分类管理
│   │   └── profile/       # 用户资料
│   ├── api/               # API 路由
│   │   ├── links/         # 链接 API
│   │   └── webhooks/      # Clerk Webhooks
│   ├── globals.css        # 全局样式
│   ├── layout.tsx         # 根布局
│   └── page.tsx           # 首页
├── components/            # 组件库
│   ├── ui/               # 基础 UI 组件
│   ├── auth/             # 认证组件
│   ├── links/            # 链接管理组件
│   ├── layout/           # 布局组件
│   └── index.ts          # 统一导出
├── lib/                  # 工具库
│   ├── auth/            # 认证相关工具
│   ├── links/           # 链接处理工具
│   ├── utils/           # 通用工具
│   └── types/           # 类型定义
├── config/              # 配置文件
│   ├── env.ts          # 环境变量
│   ├── auth.ts         # 认证配置
│   └── links.ts        # 链接配置
└── stores/             # 状态管理
    ├── auth.ts         # 认证状态
    ├── links.ts        # 链接状态
    └── ui.ts           # UI 状态
```

## Components and Interfaces

### 认证系统组件

#### 1. Clerk 集成接口
```typescript
// 用户类型扩展
interface ExtendedUser extends User {
  publicMetadata: {
    role?: 'admin' | 'user';
    preferences?: UserPreferences;
  };
  privateMetadata: {
    subscription?: SubscriptionInfo;
  };
}

// 认证状态接口
interface AuthState {
  user: ExtendedUser | null;
  isLoaded: boolean;
  isSignedIn: boolean;
  signOut: () => Promise<void>;
}
```

#### 2. 链接管理接口
```typescript
// 链接数据类型
interface Link {
  id: string;
  title: string;
  url: string;
  description?: string;
  category: string;
  tags: string[];
  favicon?: string;
  screenshot?: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  isPublic: boolean;
  clickCount: number;
}

// 链接分类
interface Category {
  id: string;
  name: string;
  description?: string;
  color: string;
  icon?: string;
  userId: string;
  linkCount: number;
}

// 链接操作接口
interface LinkActions {
  createLink: (data: CreateLinkData) => Promise<Link>;
  updateLink: (id: string, data: UpdateLinkData) => Promise<Link>;
  deleteLink: (id: string) => Promise<void>;
  togglePublic: (id: string) => Promise<Link>;
  incrementClick: (id: string) => Promise<void>;
}
```

### 数据处理组件

#### 1. 链接元数据提取
```typescript
// 链接元数据提取器
interface LinkMetadataExtractor {
  extractMetadata(url: string): Promise<LinkMetadata>;
  generateFavicon(url: string): string;
  generateScreenshot(url: string): Promise<string>;
}

// 链接元数据
interface LinkMetadata {
  title: string;
  description: string;
  image?: string;
  favicon: string;
  siteName?: string;
}
```#
# Data Models

### 链接数据管理

#### 1. 数据存储策略
```typescript
// 链接存储接口
interface LinkStorage {
  getLinks(userId: string, filters?: LinkFilters): Promise<Link[]>;
  getLinkById(id: string): Promise<Link | null>;
  createLink(data: CreateLinkData): Promise<Link>;
  updateLink(id: string, data: UpdateLinkData): Promise<Link>;
  deleteLink(id: string): Promise<void>;
}

// 链接过滤器
interface LinkFilters {
  category?: string;
  tags?: string[];
  search?: string;
  isPublic?: boolean;
  sortBy?: 'createdAt' | 'updatedAt' | 'title' | 'clickCount';
  sortOrder?: 'asc' | 'desc';
}
```

#### 2. 缓存策略
```typescript
// 链接缓存管理
interface LinkCache {
  getCachedLinks(key: string): Link[] | null;
  setCachedLinks(key: string, links: Link[]): void;
  invalidateCache(pattern?: string): void;
  getCacheKey(userId: string, filters?: LinkFilters): string;
}
```

## Error Handling

### 认证错误处理

#### 1. Clerk 错误处理
```typescript
// Clerk 错误类型
type ClerkError = {
  code: string;
  message: string;
  longMessage?: string;
  meta?: Record<string, unknown>;
};

// 认证错误处理器
interface AuthErrorHandler {
  handleSignInError(error: ClerkError): void;
  handleSignUpError(error: ClerkError): void;
  handleSessionError(error: ClerkError): void;
}
```

#### 2. 链接操作错误处理
```typescript
// 链接操作错误
type LinkOperationError = {
  type: 'validation' | 'network' | 'permission' | 'not_found';
  message: string;
  field?: string;
  code?: string;
};

// 错误恢复策略
interface LinkErrorRecovery {
  retryOperation: () => Promise<void>;
  showErrorMessage: (error: LinkOperationError) => void;
  fallbackToCache: () => Link[] | null;
}
```

## Testing Strategy

### 认证测试策略

#### 1. Clerk 集成测试
- 测试登录/注册流程
- 测试用户会话管理
- 测试权限控制

#### 2. 链接管理测试
- 测试 CRUD 操作
- 测试数据验证
- 测试缓存机制

#### 3. 性能测试
- 测试大量链接的渲染性能
- 测试搜索和过滤性能
- 测试图片加载优化

## 配置优化设计

### Clerk 配置优化

#### 1. 认证配置
```typescript
// Clerk 配置优化
const clerkConfig = {
  publishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  signInUrl: '/sign-in',
  signUpUrl: '/sign-up',
  afterSignInUrl: '/dashboard',
  afterSignUpUrl: '/dashboard',
  appearance: {
    theme: 'modern',
    variables: {
      colorPrimary: '#3b82f6',
    },
  },
};
```

#### 2. 依赖优化
**需要保留的依赖：**
- `@clerk/nextjs` - Clerk 认证服务
- `cheerio` - HTML 解析（链接元数据提取）
- `zustand` - 状态管理

**需要移除的依赖：**
- `fast-glob` - 未使用
- `@testing-library/react` - 未使用的测试依赖
- `@testing-library/user-event` - 未使用的测试依赖

**需要检查的依赖：**
- 所有 `@radix-ui/*` 包 - 验证实际使用情况
- `@vitejs/plugin-react` - 可能不需要

### 性能优化策略

#### 1. 数据获取优化
```typescript
// 链接数据获取优化
export async function getServerSideProps(context) {
  const { userId } = getAuth(context.req);
  
  if (!userId) {
    return { redirect: { destination: '/sign-in' } };
  }

  const links = await getLinks(userId);
  
  return {
    props: { links },
    // 启用 ISR
    revalidate: 300, // 5 minutes
  };
}
```

#### 2. 组件懒加载
```typescript
// 懒加载链接组件
const LazyLinkCard = dynamic(() => import('./LinkCard'), {
  loading: () => <LinkCardSkeleton />,
  ssr: false,
});

const LazyLinkEditor = dynamic(() => import('./LinkEditor'), {
  loading: () => <div>Loading editor...</div>,
  ssr: false,
});
```

## 实施计划

### 阶段 1：依赖清理和配置优化
1. 移除未使用的依赖包
2. 检查并优化 Radix UI 组件使用
3. 简化配置文件

### 阶段 2：认证系统重构
1. 优化 Clerk 集成
2. 完善用户类型定义
3. 重构认证相关组件

### 阶段 3：链接管理系统优化
1. 重构链接 CRUD 操作
2. 优化数据获取和缓存
3. 完善链接类型定义

### 阶段 4：性能优化
1. 实施组件懒加载
2. 优化图片和资源加载
3. 实施数据缓存策略

### 阶段 5：测试和验证
1. 添加认证相关测试
2. 添加链接管理测试
3. 性能基准测试

## 预期收益

### 性能提升
- 页面加载时间优化 15-20%
- Bundle 大小减少 10-15%
- 数据获取性能提升 20-25%

### 开发体验改善
- 更好的 Clerk 集成体验
- 完善的类型安全
- 简化的状态管理

### 用户体验优化
- 更快的认证流程
- 更流畅的链接管理
- 更好的响应式设计