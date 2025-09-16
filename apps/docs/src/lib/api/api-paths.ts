/**
 * API 路径常量
 *
 * 定义所有API端点的路径常量，便于统一管理和维护
 */

// 内容API路径
export const CONTENT_API_PATHS = {
  // 文档相关
  Docs: "/api/docs",
  Doc: (slug: string) => `/api/docs/${slug}`,
  DocCategories: "/api/docs-categories",
  DocList: "/api/docs-list",
} as const;

// 搜索API路径
export const SEARCH_API_PATHS = {
  Search: "/api/search",
  SearchSuggestions: "/api/search/suggestions",
} as const;

// 导出API_PATHS以保持向后兼容性
export const API_PATHS = {
  content: CONTENT_API_PATHS,
  search: SEARCH_API_PATHS,
  docs: CONTENT_API_PATHS, // 为文档API提供别名以保持向后兼容性
} as const;
