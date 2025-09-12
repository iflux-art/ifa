/**
 * 博客功能模块统一导出
 */

// 组件导出
export {
  BlogCard,
  RelatedPostsCard,
  LatestPostsCard,
  TagCloudCard,
  BlogCategoryCard,
  BlogListContent,
  ContentCard,
  ContentList,
  ContentDisplay,
  CodeBlock,
  ClientMDXRenderer,
  MDXComponents,
  MDXImg,
  MDXLink,
  MDXBlockquote,
  MDXCode,
  MDXPre,
} from "./components";

// Hooks 导出
export {
  useBlogPosts,
  useTagCounts,
  useTimelinePosts,
  getAllPosts,
  useContentSearch,
  useContentPagination,
  useContentFilter,
  useBlogPage,
} from "./hooks";

// 工具函数导出
export {
  getBlogContent,
  formatDate,
  calculateReadingTime,
  formatNumber,
  debounce,
  throttle,
  groupByCategory,
  groupByTag,
  sortContent,
  extractHeadings,
  generateBreadcrumbs,
  createBlogBreadcrumbs,
  getAllPosts as getAllBlogPosts,
  getAllTags,
  getAllTagsWithCount,
  getPostsByTag,
  getPostsByYear,
} from "./lib";

// 类型导出
export type {
  BlogPost,
  RelatedPost as BlogRelatedPost,
  TagCount as BlogTagCount,
  CategoryWithCount,
  BlogFrontmatter,
  BlogSearchResult,
  BlogSearchParams,
  // 内容相关类型
  ContentItem,
  ContentSearchParams,
  ContentPageState,
  // Hooks相关类型
  TagCount as HookTagCount,
  // 工具函数相关类型
  TocHeading,
} from "./types";

// 注意：已移除 DocPagination 组件的导出，因为翻页功能不再需要
// 注意：已移除未使用的类型导出（ContentCategory, ContentSearchResult, ContentStats, Url, BaseFrontmatter, BaseContent, BaseCategory）
