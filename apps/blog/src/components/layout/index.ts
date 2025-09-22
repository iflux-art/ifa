/**
 * 通用布局组件导出
 * 集中导出所有通用布局组件，便于引用
 */

// 配置信息
export {
  NAV_DESCRIPTIONS,
  NAV_ITEMS,
  NAV_PATHS,
} from "@/components/navbar/nav-config";
export { Breadcrumb } from "@/components/breadcrumb";
export { Sidebar, SidebarWrapper } from "@/components/sidebar";
export { TableOfContents, TableOfContentsCard } from "@/components/toc";
// 布局结构组件
export { AppGrid } from "./app-grid";
// 导航相关组件
export { Footer } from "@iflux-art/ui/footer";
export { LayoutContainer, type LayoutContainerProps } from "./layout-container";
export { MultiLayout } from "./multi-layout";
export { PageContainer, type PageContainerProps } from "./page-container";
export { ResponsiveGrid } from "./responsive-grid";
