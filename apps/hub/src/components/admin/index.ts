/**
 * 管理页面组件统一导出
 * 集中导出所有管理页面相关组件，便于引用
 */

export { AdminDialogs } from "./admin-dialogs";
// 主要组件
export { AdminPage } from "./admin-page";
// Store
export { useAdminStore } from "./admin-store";
export { DataTable } from "./data-table";
export { PageHeader } from "./page-header";
export { SearchFilter } from "./search-filter";
// 类型定义
export type {
  AdminDialogsProps,
  AdminPageProps,
  AdminPageState,
  DataTableAction,
  DataTableColumn,
  DataTableProps,
  EventHandlers,
  PageAction,
  PageHeaderProps,
  SearchFilterProps,
} from "./types";
// Hooks
export { useAdminData } from "./use-admin-data";
export { useEventHandlers } from "./use-event-handlers";
export { useFilteredItems } from "./use-filtered-items";
