/**
 * 搜索功能统一导出
 * 集中管理所有搜索相关的功能
 */

// 组件导出
export { SearchBar } from "./search-bar";
export { SearchDialog } from "./search-dialog";
// 客户端搜索引擎导出
export { getSearchSuggestions, performSearch } from "./search-engine";
// 类型导出
export type {
  SearchOptions,
  SearchResponse,
  SearchResult,
} from "./search-types";

// 服务端搜索函数导出
export { performServerSearch } from "./server-search";
// Hooks 导出
export { useSearchState } from "./use-search-state";
