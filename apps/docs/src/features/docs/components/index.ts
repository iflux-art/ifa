/**
 * Docs 功能组件统一导出
 */

// 文档内容展示组件
export { DocContentDisplay } from "./doc-content-display";
// 文档错误处理组件
export { DocErrorHandler } from "./doc-error-handler";
// 文档页面容器组件
export { DocPageContainer } from "./doc-page-container";
export { DocPageLayout } from "./doc-page-layout";
// 文档首页组件
export { DocsHomePage } from "./docs-home-page";
export { DocsSidebar } from "./docs-sidebar";
export { DocsSidebarCard } from "./docs-sidebar-card";
// 文档相关组件
export { DocsSidebarWrapper } from "./docs-sidebar-wrapper";
export {
  type DocCategoryWithDocs,
  type GlobalDocsStructure,
  getAllDocsStructure,
  resolveDocumentPath,
} from "./global-docs";
export { useGlobalDocs } from "./use-global-docs";
