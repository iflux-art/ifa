/**
 * 搜索功能统一导出
 * 集中管理所有搜索相关的功能
 *
 * 注意：为避免客户端导入服务端代码，不再导出search-api.ts
 * 服务端 API 函数请直接从 './lib/search-api' 导入
 */

// 组件导出
export { SearchBar } from "./search-bar";
export { SearchButton } from "./search-button";
export { SearchDialog } from "./search-dialog";
export { SearchResults } from "./search-results";
// Hooks 导出
export { useSearch } from "./use-search";
export { useSearchState } from "./use-search-state";
// 客户端搜索引擎导出
export {
  getSearchSuggestions,
  highlightSearchTerm,
  performSearch,
} from "./search-engine";
// 类型导出
export type {
  SearchOptions,
  SearchResponse,
  SearchResult,
} from "./hub-search-types";
