/**
 * 通用布局组件导出
 * 集中导出所有通用布局组件，便于引用
 */

// 配置信息
export {
  NAV_DESCRIPTIONS,
  NAV_ITEMS,
  NAV_PATHS,
} from "@/features/navbar/components/nav-config";
export { Breadcrumb, Sidebar, SidebarWrapper } from "@/features/navigation";
// 布局结构组件
export { AppGrid } from "./app-grid";
// 导航相关组件
export { Footer } from "./footer";
export { LayoutContainer, type LayoutContainerProps } from "./layout-container";
export { MultiLayout } from "./multi-layout";
export { PageContainer, type PageContainerProps } from "./page-container";
export { ResponsiveGrid } from "./responsive-grid";
