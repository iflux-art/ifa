/**
 * 通用布局组件导出
 * 集中导出所有通用布局组件，便于引用
 */

// 布局结构组件
export { AppGrid } from "./app-grid";
export { PageContainer, type PageContainerProps } from "./page-container";
export { LayoutContainer, type LayoutContainerProps } from "./layout-container";
export { MultiLayout } from "./multi-layout";
export { ResponsiveGrid } from "./responsive-grid";

// 导航相关组件
export { Footer } from "./footer";
export { Breadcrumb } from "@/features/navigation";
export { Sidebar, SidebarWrapper } from "@/features/navigation";

// 配置信息
export {
  NAV_ITEMS,
  NAV_PATHS,
  NAV_DESCRIPTIONS,
} from "@/features/navbar/components/nav-config";
