/**
 * 内容功能模块统一导出
 *
 * 包含文档等内容相关功能的公共组件、类型、工具函数等
 */

// 组件类型导出
export type {
  // 代码高亮组件类型
  CodeBlockProps,
} from "@/components";
// 组件导出
export {
  // MDX 组件
  ClientMDXRenderer,
  // 代码高亮组件
  CodeBlock,
  // 内容展示组件
  ContentDisplay,
  MDXBlockquote,
  MDXCode,
  MDXComponents,
  MDXImg,
  MDXLink,
  MDXPre,
} from "@/components";
// 从其他位置导入的组件
export {
  DocsSidebar,
  DocsSidebarCard,
  DocsSidebarWrapper,
} from "@/components/docs-sidebar";
// 从本地文件导出类型
export type { ContentCardProps } from "./content-card";
// 从本地文件导出组件
export { ContentCard } from "./content-card";
export type { ContentListProps } from "./content-list";
export { ContentList } from "./content-list";

// Docs相关组件导出
export { DocContentDisplay } from "./doc-content-display";
export { DocErrorHandler } from "./doc-error-handler";
export { DocPageContainer } from "./doc-page-container";
// ==================== Docs相关类型导出 ====================
export type {
  DocCategory,
  DocContentBase,
  DocContentResult,
  DocFrontmatter,
  DocItem,
  DocListItem,
  DocNavBase,
  DocTreeNode,
  NavDocItem,
  SidebarItem,
} from "./docs-types";
export {
  type DocCategoryWithDocs,
  type GlobalDocsStructure,
  getAllDocsStructure,
  resolveDocumentPath,
} from "./global-docs";
export { useGlobalDocs } from "./use-global-docs";
export {
  generateDocPaths,
  generateDocPathsFromStructure,
  getFlattenedDocsOrder,
  scanContentDirectory,
} from "./doc-paths";
export { searchDocs } from "./doc-search";
// Docs相关Hooks导出
export {
  getAllDocs,
  useDocCategories,
  useDocContent,
  useDocMeta,
} from "./docs-hooks";
// Docs相关工具函数导出
export {
  countWords,
  createDocBreadcrumbsServer,
  generateDocPathsFromFeatures,
  getDirectoryTitle,
  getDocContentFromFeatures,
  getDocSidebar,
  getFirstDocInDirectory,
  isRedirectLoop,
  resolveDocPath,
} from "./docs-lib";
export { extractHeadings } from "./extract-headings";
// Hooks 导出
export {
  useContentFilter,
  useContentPagination,
  useContentSearch,
} from "./hooks";
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
} from "./lib";
// 类型导出
export type {
  ContentCategory,
  ContentItem,
  ContentPageState,
  ContentSearchParams,
  ContentSearchResult,
  ContentStats,
} from "./types";
export { useDocsState } from "./use-docs-state";
export { useGlobalDocsState } from "./use-global-docs-state";
