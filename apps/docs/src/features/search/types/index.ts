/**
 * 搜索功能相关类型定义
 */

import type { Url } from '@/features/content/types'

// ==================== 搜索结果类型 ====================

/** 搜索结果基础接口 */
export interface BaseSearchResult {
  /** 结果唯一标识 */
  id: string
  /** 结果标题 */
  title: string
  /** 结果描述 */
  description?: string
  /** 结果类型 */
  type: 'link' | 'doc' | 'tool' | 'command' | 'navigation' | 'history'
  /** 结果链接 */
  url?: string
  /** 结果路径 */
  path?: string
  /** 结果标签 */
  tags?: string[]
  /** 是否为外部链接 */
  external?: boolean
}

/** 搜索结果接口 */
export interface SearchResult extends BaseSearchResult {
  /** 结果分类 */
  category?: string
  /** 结果图标 */
  icon?: string
  /** 结果权重 */
  weight?: number
}

// ==================== 搜索参数类型 ====================

/** 搜索选项接口 */
export interface SearchOptions {
  /** 搜索类型 */
  type?: 'all' | 'links' | 'doc' | 'docs'
  /** 结果限制数量 */
  limit?: number
  /** 是否包含内容 */
  includeContent?: boolean
}

/** 搜索参数接口 */
export interface SearchParams {
  /** 搜索查询 */
  query: string
  /** 搜索选项 */
  options?: SearchOptions
}

// ==================== 搜索响应类型 ====================

/** 搜索响应接口 */
export interface SearchResponse {
  /** 搜索结果 */
  results: SearchResult[]
  /** 结果总数 */
  total: number
  /** 搜索查询 */
  query: string
  /** 搜索类型 */
  type: string
}

// ==================== 搜索状态类型 ====================

/** 搜索状态接口 */
export interface SearchState {
  /** 搜索结果 */
  results: SearchResult[]
  /** 搜索查询 */
  query: string
  /** 是否正在加载 */
  loading: boolean
  /** 错误信息 */
  error: string | null
  /** 结果总数 */
  total: number
}

/** 搜索操作接口 */
export interface SearchActions {
  /** 执行搜索 */
  search: (query: string, options?: SearchOptions) => Promise<void>
  /** 清除搜索结果 */
  clear: () => void
  /** 设置加载状态 */
  setLoading: (loading: boolean) => void
  /** 设置错误信息 */
  setError: (error: string | null) => void
}

/** 搜索派生状态类型 */
export interface SearchDerivedState {
  // 派生状态将在组件中计算，不在store中存储
  // 例如：是否有搜索结果、是否显示建议等
  hasResults?: boolean
  showSuggestions?: boolean
  filteredResults?: SearchResult[]
}

/** 搜索完整store接口 */
export interface SearchStore extends SearchState, SearchActions {}

// ==================== 搜索建议类型 ====================

/** 搜索建议接口 */
export interface SearchSuggestion {
  /** 建议文本 */
  text: string
  /** 建议权重 */
  weight: number
  /** 建议类型 */
  type: 'query' | 'tag' | 'category'
}

// ==================== 链接数据类型 ====================

/** 链接数据接口 */
export interface LinkData {
  /** 链接唯一标识 */
  id: string
  /** 链接标题 */
  title: string
  /** 链接描述 */
  description?: string
  /** 链接地址 */
  url: Url
  /** 链接标签 */
  tags?: string[]
  /** 链接分类 */
  category?: string
  /** 是否为外部链接 */
  external?: boolean
  /** 链接图标 */
  icon?: string
}
