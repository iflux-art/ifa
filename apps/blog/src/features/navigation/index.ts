/**
 * Navigation 功能模块统一导出
 *
 * 包含面包屑、目录、侧边栏等导航相关功能的公共组件、类型、工具函数等
 */

// 组件导出
// 面包屑组件已移至独立的 breadcrumb 模块
// export {
//   // 面包屑组件
//   Breadcrumb,
// } from "./components/breadcrumb";
// 侧边栏组件已移至独立的 sidebar 模块
// export {
//   // 侧边栏组件
//   Sidebar,
//   SidebarWrapper,
// } from "./components/sidebar";
// 目录组件已移至独立的 toc 模块
// export {
//   // 目录组件
//   TableOfContents,
//   TableOfContentsCard,
// } from "./components/toc";
// 类型导出
export type {
  // 基础导航类型
  BaseNavItem,
  BaseSearchResult,
  // 面包屑相关类型已移至独立的 breadcrumb 模块
  // BreadcrumbItem,
  // BreadcrumbProps,
  NestedNavItem,
  // 布局相关类型
  SidebarConfig,
  // 侧边栏相关类型已移至独立的 sidebar 模块
  // SidebarItem,
  // SidebarProps,
  // SidebarWrapperProps,
  // 目录相关类型已移至独立的 toc 模块
  // TocHeading,
  // TocProps,
  // TableOfContentsCardProps,
} from "./types";

// Hooks 导出
// export {} from "./hooks";

// 工具函数导出
// export {} from "./lib";
