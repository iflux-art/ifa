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
// 客户端搜索引擎导出
export {
  getSearchSuggestions,
  highlightSearchTerm,
  performSearch,
} from "./search-engine";
export { SearchResults } from "./search-results";
// Store 导出
export { useSearchStore } from "./search-store";
// 服务端搜索导出
export { performServerSearch as serverSearch } from "./server-search";
// 类型导出
export type { SearchOptions, SearchResponse, SearchResult } from "./types";
// Hooks 导出
export { useSearch } from "./use-search";
export { useSearchState } from "./use-search-state";
