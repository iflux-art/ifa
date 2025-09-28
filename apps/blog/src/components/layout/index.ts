// 布局模块统一导出
// 集中管理所有布局相关的组件、类型、工具函数、状态和钩子

// 组件导出
export { ClientLayout } from "./client-layout";

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

// 配置信息

// 导航相关组件
export { Footer } from "@iflux-art/ui/footer";
export { Breadcrumb } from "@/components/content-header/breadcrumb";
export {
  NAV_DESCRIPTIONS,
  NAV_ITEMS,
  NAV_PATHS,
} from "@/components/navbar/nav-config";
export { TableOfContentsCard } from "@/components/widgets/table-of-contents-card";
