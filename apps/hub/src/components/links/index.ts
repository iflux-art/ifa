/**
 * 链接功能模块导出
 */

export { LinksSidebar } from "@/components/sidebar";
// 从 components 导出
export { DataTable } from "./data-table";
export { LinkCard } from "./link-card";
// 从 services 导出
export type { LinkDataService } from "./link-data-service";
export { linkDataService } from "./link-data-service";
export type { LinkService } from "./link-service";
export { LinksContent } from "./links-content";
export { LinksForm } from "./links-form";
export { LinksPageContainer } from "./links-page";
// 表格配置导出
export {
  getPageActions,
  getTableActions,
  getTableColumns,
} from "./table-config";
// 从 hooks 导出
export { useCategories } from "./use-categories";
export { useFilterState } from "./use-filter-state";
export { useLinksDataState as useLinksData } from "./use-links-data-state";
// 注意：linkService 实例使用了 Node.js 原生模块，不应在客户端使用

// 从 stores 导出
export { useLinksDataStore } from "./links-data-store";

// 从 types 导出
export type {
  CategoryId,
  LinksCategory,
  LinksFormData,
  LinksItem,
  LinksSubCategory,
} from "./types";
