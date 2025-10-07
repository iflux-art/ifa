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
export { SidebarWrapper } from "@/components/sidebar";
export { Breadcrumb } from "@/components/posts";
// 布局结构组件
export { AppGrid } from "./app-grid";
// 导航相关组件
export { LayoutContainer, type LayoutContainerProps } from "./layout-container";
