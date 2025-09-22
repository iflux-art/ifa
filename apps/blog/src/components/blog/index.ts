/**
 * 博客功能模块统一导出
 */

// 组件导出
export {
  BlogCard,
  BlogCategoryCard,
  BlogListContent,
  CodeBlock,
  ContentCard,
  ContentDisplay,
  ContentList,
  LatestPostsCard,
  RelatedPostsCard,
  TagCloudCard,
} from "./components";

// MDX组件导出
export {
  ClientMDXRenderer,
  MDXBlockquote,
  MDXCode,
  MDXComponents,
  MDXImg,
  MDXLink,
  MDXPre,
} from "@/components/mdx";

// Hooks 导出
export {
  getAllPosts,
  useBlogPage,
  useBlogPosts,
  useContentFilter,
  useContentPagination,
  useContentSearch,
  useTagCounts,
  useTimelinePosts,
} from "./hooks";

// 工具函数导出
export {
  calculateReadingTime,
  createBlogBreadcrumbs,
  debounce,
  extractHeadings,
  formatDate,
  formatNumber,
  generateBreadcrumbs,
  getAllPosts as getAllBlogPosts,
  getAllTags,
  getAllTagsWithCount,
  getBlogContent,
  getPostsByTag,
  getPostsByYear,
  groupByCategory,
  groupByTag,
  sortContent,
  throttle,
} from "./lib";

// 类型导出
export type {
  BlogFrontmatter,
  BlogSearchParams,
  BlogSearchResult,
  CategoryWithCount,
  // 内容相关类型
  ContentPageState,
  ContentSearchParams,
  TagCount as BlogTagCount,
  // Hooks相关类型
  TagCount as HookTagCount,
  // 工具函数相关类型
  TocHeading,
} from "./types";

// 从组件文件导出的类型
export type { BlogPost } from "./components/blog-list-content";
export type { ContentItem } from "./components/content-list";
export type { RelatedPost as BlogRelatedPost } from "@/components/cards/related-posts-card";

// 注意：已移除 DocPagination 组件的导出，因为翻页功能不再需要
// 注意：已移除未使用的类型导出（ContentCategory, ContentSearchResult, ContentStats, Url, BaseFrontmatter, BaseContent, BaseCategory）
