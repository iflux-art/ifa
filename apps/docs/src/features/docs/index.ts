/**
 * Docs 功能模块统一导出
 * 集中管理文档功能的所有导出，便于外部引用
 */

// ==================== 组件导出 ====================
export {
  type DocCategoryWithDocs,
  DocErrorHandler,
  DocPageContainer,
  DocsHomePage,
  DocsSidebar,
  DocsSidebarCard,
  DocsSidebarWrapper,
  type GlobalDocsStructure,
  getAllDocsStructure,
  resolveDocumentPath,
  useGlobalDocs,
} from "./components";

// ==================== Hooks 导出 ====================
export {
  useDocCategories,
  useDocContent,
  useDocMeta,
} from "./hooks";

// ==================== 工具函数导出 ====================
export {
  countWords,
  createDocBreadcrumbsServer,
  getDirectoryTitle,
  getFirstDocInDirectory,
  isRedirectLoop,
  resolveDocPath,
} from "./lib";

// ==================== 类型定义导出 ====================
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
} from "./types";
