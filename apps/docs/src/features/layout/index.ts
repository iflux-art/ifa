// 布局模块统一导出
// 集中管理所有布局相关的组件、类型、工具函数、状态和钩子

// 组件导出
export { AppGrid } from "./app-grid";
export { ThreeColumnLayout } from "./multi-layout";
export { PageContainer, type PageContainerProps } from "./page-container";
export { ResponsiveGrid, ThreeColumnGrid } from "./responsive-grid";

// 类型导出
export type {
  PageLayoutType,
  PageContainerConfig,
  SidebarConfig,
  NotFoundProps,
  PageProps,
  PageLayoutProps,
  AppGridProps,
  ThreeColumnLayoutProps,
  ThreeColumnGridProps,
  SidebarWrapperProps,
  GridColsMap,
  GridGapMap,
} from "./layout-types";

// 工具函数导出
export {
  getLayoutClassName,
  getContainerClassName,
  getMainContentClasses,
  getSidebarClasses,
  DEFAULT_SIDEBAR_CONFIG,
  THREE_COLUMN_LAYOUT_CONFIG,
  getPageTitle,
  getResponsiveClasses,
  gridColsMap,
  gridGapMap,
} from "./layout-utils";

// 状态管理导出
export { useLayoutStore } from "./layout-store.standard";

// 钩子函数导出
export { useResponsiveLayout } from "./use-responsive-layout";
