/**
 * 搜索相关类型定义
 */

export interface SearchResult {
  type: "blog"; // 只支持博客类型
  title: string;
  description?: string;
  path?: string;
  tags?: string[];
  /** 摘要（用于高级搜索结果） */
  excerpt?: string;
  /** 相关性评分 */
  score?: number;
  /** 高亮信息 */
  highlights?: {
    title?: string;
    content?: string[];
  };
}

export interface SearchOptions {
  type?: "blog"; // 只支持博客类型
  limit?: number;
  includeContent?: boolean;
  useCache?: boolean;
}

export interface SearchResponse {
  results: SearchResult[];
  total: number;
  query: string;
  type: string;
}
