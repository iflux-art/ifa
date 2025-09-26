/**
 * 链接功能模块导出
 */

export { LinksSidebar } from "@/components/sidebar";
// 从 components 导出
export { DataTable } from "./components/data-table";
export { LinksContent } from "./components/links-content";
export { LinksForm } from "./components/links-form";
// 从 services 导出
export type { LinkDataService } from "./services/link-data-service";
export { linkDataService } from "./services/link-data-service";
export type { LinkService } from "./services/link-service";
export type { LinkManagementService } from "./services/link-management-service";
export { linkManagementService } from "./services/link-management-service";
export type {
  LinkCategoryService,
  LinkCategory,
} from "./services/link-category-service";
export {
  linkCategoryService,
  getCategoryDisplayName,
} from "./services/link-category-service";
// 表格配置导出
export {
  getPageActions,
  getTableActions,
  getTableColumns,
} from "./tables/table-config";
// 从 hooks 导出
export { useCategories } from "./hooks/use-categories";
export { useFilterState } from "./hooks/use-filter-state";
export { useLinksDataState as useLinksData } from "./hooks/use-links-data-state";
export { useLinksCache } from "./hooks/use-links-cache";
export { useLinksRealTimeUpdate } from "./hooks/use-links-real-time-update";
export { useTagAnchors } from "./hooks/use-tag-anchors";

// 从 stores 导出
export { useLinksDataStore } from "./stores/links-data-store";

// 从 types 导出
export type {
  CategoryId,
  LinksCategory,
  LinksFormData,
  LinksItem,
  LinksSubCategory,
} from "./types";

// 从 utils 导出
export { validateLinksFormData, validateLinksUpdate } from "./utils/validation";
