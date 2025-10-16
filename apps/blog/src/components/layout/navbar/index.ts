/**
 * Navbar 功能模块导出
 * 集中导出导航栏相关组件和配置
 */

// 组件导出
export { Logo } from "./logo";
export { MainNavbar } from "./main-navbar";
export { NavListMenu } from "./nav-menu";
export { MobileMenu } from "./mobile-menu";

// 配置导出
export { NAV_DESCRIPTIONS, NAV_ITEMS, NAV_PATHS } from "./nav-config";

// 类型导出
export type {
  BaseNavItem,
  BreadcrumbItem,
  Heading,
  NavbarSearchResult,
  SidebarItem,
  SidebarProps,
} from "./types";

// Hooks 导出
export { useActiveSection } from "./use-active-section";
