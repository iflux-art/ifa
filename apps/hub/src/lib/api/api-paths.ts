/**
 * API 路径常量
 * 定义所有API端点的路径常量，便于统一管理和维护
 */

// 内容API路径
export const CONTENT_API_PATHS = {
  // 链接相关
  Links: "/api/links",
  Link: (id: string) => `/api/links/${id}`,
  LinkCategories: "/api/links/categories",
} as const;

// 搜索API路径
export const SEARCH_API_PATHS = {
  Search: "/api/search",
} as const;

// 导出API_PATHS以保持向后兼容性
export const API_PATHS = {
  content: CONTENT_API_PATHS,
  search: SEARCH_API_PATHS,
} as const;
