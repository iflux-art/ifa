# Design Document

## Overview

本设计文档详细描述了 blog 子应用代码精简和重构的技术方案。基于对现有代码的分析，我们将采用渐进式重构策略，特别关注 MDX 内容处理和博客性能优化。

### 当前状态分析

**技术栈现状：**
- Next.js 15 with App Router
- React 19 
- TypeScript 5.9
- MDX 3.1 (@mdx-js/mdx, @mdx-js/react, @next/mdx)
- Tailwind CSS 4.1 with Typography plugin
- Zustand (状态管理)
- Prism.js (代码高亮)
- Gray Matter (Front Matter 解析)
- Biome (代码质量工具)

**发现的问题：**
1. 未使用的依赖包（lint-staged）
2. 所有 Radix UI 组件包都存在但可能未全部使用
3. 配置文件可能包含不必要的复杂性
4. MDX 内容处理可能需要性能优化
5. 博客文章类型定义可能不够完善

## Architecture

### 重构架构原则

1. **MDX 优先** - 优化 MDX 内容的处理和渲染性能
2. **静态优先** - 最大化使用 Next.js 静态生成能力
3. **类型安全** - 完善博客相关的 TypeScript 类型定义
4. **性能优化** - 重点关注首屏加载和 MDX 渲染性能
5. **内容管理** - 优化博客内容的组织和管理方式

### 目录结构优化

```
src/
├── app/                    # Next.js App Router
│   ├── blog/              # 博客路由
│   │   ├── [slug]/        # 动态博客文章路由
│   │   └── page.tsx       # 博客列表页
│   ├── api/               # API 路由
│   ├── globals.css        # 全局样式
│   ├── layout.tsx         # 根布局
│   └── page.tsx           # 首页
├── components/            # 组件库
│   ├── ui/               # 基础 UI 组件
│   ├── blog/             # 博客专用组件
│   ├── mdx/              # MDX 组件
│   ├── layout/           # 布局组件
│   └── index.ts          # 统一导出
├── content/              # 博客内容
│   ├── posts/           # 博客文章 (.mdx 文件)
│   └── authors/         # 作者信息
├── lib/                  # 工具库
│   ├── mdx/             # MDX 处理工具
│   ├── blog/            # 博客相关工具
│   ├── utils/           # 通用工具
│   └── types/           # 类型定义
├── config/              # 配置文件
│   ├── env.ts          # 环境变量
│   ├── blog.ts         # 博客配置
│   └── mdx.ts          # MDX 配置
└── styles/             # 样式文件
    ├── globals.css     # 全局样式
    └── mdx.css         # MDX 专用样式
```

## Components and Interfaces

### MDX 组件系统

#### 1. MDX 组件接口
```typescript
// MDX 组件基础接口
interface MDXComponentProps {
  children?: React.ReactNode;
  className?: string;
}

// 自定义 MDX 组件
interface CodeBlockProps extends MDXComponentProps {
  language?: string;
  title?: string;
  showLineNumbers?: boolean;
}

interface CalloutProps extends MDXComponentProps {
  type: 'info' | 'warning' | 'error' | 'success';
  title?: string;
}
```

#### 2. 博客数据类型
```typescript
// 博客文章元数据
interface BlogPostMeta {
  title: string;
  description: string;
  publishedAt: string;
  updatedAt?: string;
  author: string;
  tags: string[];
  category: string;
  featured?: boolean;
  draft?: boolean;
  readingTime?: number;
}

// 完整博客文章
interface BlogPost {
  slug: string;
  meta: BlogPostMeta;
  content: string;
  excerpt?: string;
}

// 博客列表项
interface BlogListItem {
  slug: string;
  meta: BlogPostMeta;
  excerpt: string;
}
```

### 性能优化组件

#### 1. 懒加载 MDX 组件
```typescript
// 动态导入 MDX 组件
const LazyCodeBlock = dynamic(() => import('./CodeBlock'), {
  loading: () => <CodeBlockSkeleton />,
  ssr: true,
});

// MDX 内容懒加载
const LazyMDXContent = dynamic(() => import('./MDXContent'), {
  loading: () => <ArticleSkeleton />,
  ssr: true,
});
```## Data Mod
els

### 博客内容管理

#### 1. 内容处理流程
```typescript
// 博客内容处理器
interface BlogContentProcessor {
  parseFrontMatter(content: string): { meta: BlogPostMeta; content: string };
  generateExcerpt(content: string, length?: number): string;
  calculateReadingTime(content: string): number;
  processImages(content: string): string;
}

// 博客索引生成器
interface BlogIndexGenerator {
  generateIndex(): Promise<BlogListItem[]>;
  generateSitemap(): Promise<string>;
  generateRSSFeed(): Promise<string>;
}
```

#### 2. 搜索和过滤
```typescript
// 博客搜索接口
interface BlogSearchParams {
  query?: string;
  tags?: string[];
  category?: string;
  author?: string;
  featured?: boolean;
}

// 分页接口
interface PaginationParams {
  page: number;
  limit: number;
  total: number;
}
```

## Error Handling

### MDX 错误处理

#### 1. MDX 编译错误处理
```typescript
// MDX 错误类型
type MDXError = {
  type: 'compilation' | 'runtime' | 'missing';
  message: string;
  file?: string;
  line?: number;
  column?: number;
};

// MDX 错误边界
interface MDXErrorBoundaryProps {
  fallback?: React.ComponentType<{ error: MDXError }>;
  onError?: (error: MDXError) => void;
}
```

#### 2. 内容加载错误处理
```typescript
// 内容加载状态
type ContentLoadingState = 'loading' | 'success' | 'error' | 'not-found';

// 错误恢复策略
interface ErrorRecoveryStrategy {
  retry: () => void;
  fallbackContent?: React.ReactNode;
  reportError: (error: Error) => void;
}
```

## Testing Strategy

### MDX 测试策略

#### 1. MDX 组件测试
- 测试自定义 MDX 组件的渲染
- 测试代码高亮功能
- 测试响应式图片处理

#### 2. 内容处理测试
- 测试 Front Matter 解析
- 测试摘要生成
- 测试阅读时间计算

#### 3. 性能测试
- MDX 编译性能测试
- 页面加载性能测试
- 图片优化效果测试

## 配置优化设计

### MDX 配置优化

#### 1. Next.js MDX 配置
```typescript
// 优化的 MDX 配置
const mdxConfig = {
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      [rehypePrism, { showLineNumbers: true }],
      [rehypeSlug],
      [rehypeAutolinkHeadings],
    ],
    providerImportSource: '@mdx-js/react',
  },
};
```

#### 2. 依赖优化
**需要保留的依赖：**
- `@mdx-js/mdx` - MDX 核心
- `@mdx-js/react` - React MDX 支持
- `@next/mdx` - Next.js MDX 集成
- `gray-matter` - Front Matter 解析
- `prismjs` - 代码高亮
- `remark-gfm` - GitHub Flavored Markdown
- `zustand` - 状态管理

**需要移除的依赖：**
- `lint-staged` - 未使用的开发依赖

**需要检查的依赖：**
- 所有 `@radix-ui/*` 包 - 验证实际使用情况

### 性能优化策略

#### 1. 静态生成优化
```typescript
// 博客页面静态生成
export async function generateStaticParams() {
  const posts = await getAllBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

// 增量静态再生成
export const revalidate = 3600; // 1 hour
```

#### 2. 图片优化
```typescript
// MDX 图片组件优化
const OptimizedImage = ({ src, alt, ...props }) => (
  <Image
    src={src}
    alt={alt}
    width={800}
    height={400}
    placeholder="blur"
    blurDataURL="data:image/jpeg;base64,..."
    {...props}
  />
);
```

## 实施计划

### 阶段 1：依赖清理和配置优化
1. 移除未使用的依赖包
2. 检查并优化 Radix UI 组件使用
3. 简化配置文件

### 阶段 2：MDX 系统重构
1. 重构 MDX 组件系统
2. 优化内容处理流程
3. 完善类型定义

### 阶段 3：性能优化
1. 实施静态生成优化
2. 优化图片和资源加载
3. 实施 MDX 编译缓存

### 阶段 4：测试和验证
1. 添加 MDX 相关测试
2. 性能基准测试
3. 内容完整性验证

## 预期收益

### 性能提升
- MDX 编译时间减少 20-30%
- 首屏加载时间优化 15-20%
- Bundle 大小减少 10-15%

### 开发体验改善
- 更好的 MDX 开发体验
- 完善的类型安全
- 简化的内容管理流程

### 内容管理优化
- 更快的内容构建速度
- 更好的 SEO 优化
- 更灵活的内容组织方式