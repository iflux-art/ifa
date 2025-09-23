// 布局模块统一导出
// 集中管理所有布局相关的组件、类型、工具函数、状态和钩子

// 组件导出
export { AppGrid } from "./app-grid";
// 状态管理导出
export { useLayoutStore } from "./layout-store.standard";
// 类型导出
export type {
  AppGridProps,
  GridColsMap,
  GridGapMap,
  NotFoundProps,
  PageContainerConfig,
  PageLayoutProps,
  PageLayoutType,
  PageProps,
  SidebarConfig,
  SidebarWrapperProps,
  ThreeColumnGridProps,
  ThreeColumnLayoutProps,
} from "./layout-types";
// 工具函数导出
export {
  DEFAULT_SIDEBAR_CONFIG,
  getContainerClassName,
  getLayoutClassName,
  getMainContentClasses,
  getPageTitle,
  getResponsiveClasses,
  getSidebarClasses,
  gridColsMap,
  gridGapMap,
  THREE_COLUMN_LAYOUT_CONFIG,
} from "./layout-utils";
export { ThreeColumnLayout } from "./multi-layout";
export { PageContainer, type PageContainerProps } from "./page-container";
export { ResponsiveGrid, ThreeColumnGrid } from "./responsive-grid";

// 钩子函数导出
export { useResponsiveLayout } from "./use-responsive-layout";
