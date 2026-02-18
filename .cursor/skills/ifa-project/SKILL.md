---
name: ifa-project
description: Provides iFluxArt Blog project context—Next.js 14+ App Router, shadcn/ui (new-york), MDX, pnpm, Biome. Use when editing or extending this blog (src/app, src/components, src/content), adding API routes, writing MDX posts, or when the user refers to ifa, iFluxArt, or this repo.
---

# iFluxArt Blog - 技术栈与最佳实践

## 项目概述

iFluxArt Blog 是一个基于 Next.js 的技术博客系统，用于分享前端开发、人工智能、广告创意等相关内容。

## 技术栈

### 核心框架

- **Next.js 14+** (App Router)
  - 使用 React Server Components (RSC)
  - 支持 Partial Prerendering (PPR)
  - App Router 路由系统

- **React 18+**
  - Server Components & Client Components
  - Concurrent Features
  - hooks API

### UI 组件库

- **shadcn/ui** - 基于 Radix UI 的可定制组件库
  - 使用 "new-york" 风格
  - 支持 React Server Components
  - 基于 Tailwind CSS
- **Radix UI** - 无障碍 UI 原始组件
- **Lucide React** - 图标库

### 样式

- **Tailwind CSS** - 原子化 CSS 框架
- **class-variance-authority** - 组件变体管理
- **clsx** - 条件类名处理
- **tailwind-merge** - Tailwind 类名合并

### 内容

- **MDX** - 支持 React 组件的 Markdown

### 开发工具

- **pnpm** - 包管理器（必须使用 pnpm，禁止 npm/yarn）
- **TypeScript** - 严格模式
- **Biome** - 代码格式化和 linting
- **Vitest** - 单元测试

### 部署

- **Vercel** - 部署平台
- **Edge Runtime** - 边缘计算

## 项目结构

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API 路由
│   │   ├── blog/         # 博客 API
│   │   ├── search/       # 搜索 API
│   │   └── mcp-tools/   # MCP 工具
│   ├── feed.xml/         # RSS 订阅
│   ├── llms.txt/        # LLMs.txt
│   ├── api-docs/        # OpenAPI 文档
│   └── posts/           # 文章页面
├── components/            # React 组件
│   ├── features/        # 功能组件
│   ├── layout/          # 布局组件
│   ├── mdx/            # MDX 组件
│   ├── theme/          # 主题组件
│   └── ui/             # UI 基础组件
├── config/              # 配置文件
│   ├── env.ts          # 环境变量
│   ├── features.ts     # 功能开关
│   └── metadata.ts     # 站点元数据
└── content/            # 博客内容 (MDX)
    ├── 前端开发/
    ├── 人工智能/
    └── 广告/
```

## API 端点

### 博客文章

- `GET /api/blog/posts` - 获取文章列表
- `GET /api/blog/tags` - 获取所有标签
- `GET /api/blog/tags/{tag}` - 按标签获取文章
- `GET /api/blog/timeline` - 获取时间线

### 搜索

- `GET /api/search` - 搜索文章

### AI Agent 工具

- `GET /api/mcp-tools` - 获取 MCP 工具列表
- `POST /api/mcp-tools` - 调用 MCP 工具
- `GET /api-docs` - OpenAPI 规范文档

### 订阅与发现

- `GET /llms.txt` - AI 发现的站点信息
- `GET /feed.xml` - RSS 订阅源
- `GET /sitemap.xml` - 站点地图
- `GET /robots.txt` - 爬虫规则

## 内容管理

### Frontmatter 格式

```yaml
---
title: 文章标题
description: 文章描述
tags: [tag1, tag2]
category: 分类名
date: 2024-01-01
---
```

### 内容目录

- `src/content/` 目录下的 MDX 文件
- 支持中文文件名
- 自动解析 frontmatter

## 开发指南

### 开发环境

```bash
pnpm install
pnpm dev
pnpm build
pnpm test
```

### 代码规范

- 使用 Biome 进行代码格式化和 linting
- 遵循 TypeScript 严格模式
- 使用 ESLint 和 Prettier

## AI Agent 交互

### 可用工具

| 工具名称 | 功能 |
|---------|------|
| get_blog_posts | 获取博客文章列表 |
| get_blog_post | 获取单篇文章 |
| get_blog_tags | 获取所有标签 |
| get_posts_by_tag | 按标签获取文章 |
| get_blog_timeline | 获取时间线 |
| search_blog | 搜索文章 |
| get_site_info | 获取站点信息 |
| get_llms_txt | 获取 LLMs.txt |
| get_rss_feed | 获取 RSS 订阅 |

### 调用示例

```json
{
  "name": "get_blog_posts",
  "arguments": {
    "page": 1,
    "limit": 10
  }
}
```

## 最佳实践

### SEO 与可发现性

1. **LLMs.txt** - 站点结构化信息，便于 AI 发现
2. **RSS 订阅** - 完整内容订阅
3. **站点地图** - 页面结构
4. **robots.txt** - 爬虫引导

### 性能优化

1. 使用 React Server Components 减少客户端 JavaScript
2. 图片使用 next/image
3. 字体使用 next/font
4. 静态资源优化

### 可访问性

1. 使用语义化 HTML
2. ARIA 属性正确使用
3. 键盘导航支持
4. 主题切换支持

### 安全

1. 环境变量管理
2. API 路由权限控制
3. 输入验证
4. XSS 防护

## shadcn/ui 最佳实践

- **style**: new-york，**rsc**: true，**tailwind.cssVariables**: true
- 组件具备 `data-slot`、CVA 变体、Radix 原语、`cn()` 合并类名
- 已安装：Button, Card, Dialog, Badge, Input, Alert

### 使用示例

```tsx
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

<Button variant="outline" size="sm">点击</Button>
<div className={cn("base-class", condition && "conditional-class")} />
```

## 相关资源

- [Next.js 文档](https://nextjs.org/docs)
- [React 文档](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [MDX](https://mdxjs.com)
- [OpenAPI 规范](https://swagger.io/specification/)
- [MCP 协议](https://modelcontextprotocol.io/)
- [shadcn/ui](https://ui.shadcn.com)
- [Radix UI](https://www.radix-ui.com)
