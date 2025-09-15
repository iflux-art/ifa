/**
 * 内容功能模块统一导出
 *
 * 包含文档等内容相关功能的公共组件、类型、工具函数等
 */

// 组件类型导出
export type {
  // 代码高亮组件类型
  CodeBlockProps,
  ContentCardProps,
  ContentListProps,
} from './components'
// 组件导出
export {
  // MDX 组件
  ClientMDXRenderer,
  // 代码高亮组件
  CodeBlock,
  ContentCard,
  // 内容展示组件
  ContentDisplay,
  ContentList,
  MDXBlockquote,
  MDXCode,
  MDXComponents,
  MDXImg,
  MDXLink,
  MDXPre,
} from './components'

// Hooks 导出
export {
  useContentFilter,
  useContentPagination,
  useContentSearch,
} from './hooks'
// 工具函数导出
export {
  calculateReadingTime,
  debounce,
  formatDate,
  formatNumber,
  groupByCategory,
  groupByTag,
  sortContent,
  throttle,
} from './lib'
// 类型导出
export type {
  ContentCategory,
  ContentItem,
  ContentPageState,
  ContentSearchParams,
  ContentSearchResult,
  ContentStats,
} from './types'
