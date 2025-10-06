/**
 * 搜索功能统一导出
 * 集中管理所有搜索相关的功能
 */

// 组件导出
export { SearchBar } from "./search-bar";
export { SearchDialog } from "./search-dialog";
export { SearchResults } from "./search-results";

// Hooks 导出
export { useSearch } from "./hooks/use-search";
export { useSearchState } from "./hooks/use-search-state";

// 客户端搜索引擎导出
export { getSearchSuggestions, performSearch } from "./lib/search-engine";

// 服务端搜索函数导出
export { performServerSearch } from "./lib/server-search";

// 类型导出
export type { SearchOptions, SearchResponse, SearchResult } from "./types";
