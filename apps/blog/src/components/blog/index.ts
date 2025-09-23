/**
 * 博客功能模块统一导出
 */

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
// 从 widgets 目录导出 BlogCategoryCard
export { BlogCategoryCard } from "@/components/widgets/blog-category-card";
export type { RelatedPost as BlogRelatedPost } from "@/components/widgets/related-posts-card";
// 从组件文件导出的类型
export type { BlogPost } from "./blog-list-content";
// 组件导出
export {
  BlogCard,
  BlogListContent,
} from "./blog-list-content";
export { BlogPageContainer } from "./blog-page";
// 工具函数导出
export {
  calculateReadingTime,
  debounce,
  extractHeadings,
  formatDate,
  formatNumber,
  groupByCategory,
  groupByTag,
  sortContent,
  throttle,
} from "./client-utils";
export { ContentDisplay } from "./content-display";
export type { ContentItem, ContentListProps } from "./content-list";
export { ContentList } from "./content-list";
// Hooks 导出
export { useBlogPage } from "./use-blog-page";
// 移除了依赖 Node.js 模块的导出，这些函数现在应该通过 API 路由调用
// export {
//   getBlogContent,
//   getAllBlogMeta,
// } from "./blog-content";
// export { searchBlogPosts } from "./blog-search";
// export { generateBlogPaths } from "./blog-paths";

// 类型导出
// 暂时移除类型导出以解决编译问题
// export type {
//   BlogFrontmatter,
//   BlogSearchParams,
//   BlogSearchResult,
//   CategoryWithCount,
//   // 内容相关类型
//   ContentPageState,
//   ContentSearchParams,
//   TagCount as BlogTagCount,
//   // Hooks相关类型
//   TagCount as HookTagCount,
//   // 工具函数相关类型
//   TocHeading,
// } from "./types";
