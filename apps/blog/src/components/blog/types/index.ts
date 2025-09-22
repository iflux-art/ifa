/**
 * 博客功能模块类型定义
 */

// 博客搜索结果类型
export interface BlogSearchResult {
  slug: string;
  title: string;
  description: string;
  date: string;
  category?: string;
  tags?: string[];
  excerpt: string;
  readingTime?: number;
}

// 博客文章类型 (从 blog-list-content.tsx 导入)
export type { BlogPost } from "../components/blog-list-content";

// 博客前言数据类型
export interface BlogFrontmatter {
  title?: string;
  description?: string;
  date?: string;
  tags?: string[];
  category?: string;
  author?: string;
  image?: string;
  published?: boolean;
  [key: string]: unknown;
}

// 博客搜索参数类型
export interface BlogSearchParams {
  query: string;
  page?: number;
  limit?: number;
  category?: string;
  tag?: string;
}

// 分类带计数类型
export interface CategoryWithCount {
  name: string;
  count: number;
}

// 内容页面状态类型
export interface ContentPageState {
  page: number;
  limit: number;
  category?: string;
  tag?: string;
  query?: string;
}

// 内容搜索参数类型
export interface ContentSearchParams {
  query: string;
  limit: number;
  type: string;
}

// 标签计数类型
export interface TagCount {
  tag: string;
  count: number;
}

// 目录标题类型
export interface TocHeading {
  id: string;
  text: string;
  level: number;
}
