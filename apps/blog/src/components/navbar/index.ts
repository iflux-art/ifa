/**
 * Navbar 功能模块统一导出
 */

// 组件导出
export { Logo } from "./logo";
export { MainNavbar } from "./main-navbar";
export type { NavConfigItem } from "./nav-config";
// 配置和类型导出
export {
  NAV_DESCRIPTIONS,
  NAV_ITEMS,
  NAV_PATHS,
} from "./nav-config";
export { NavItem, NavItemList } from "./nav-item";
export { ActiveLink, NavLink } from "./nav-link";
export { NavListMenu } from "./nav-menu";
// 类型导出
export type {
  BaseNavItem,
  BaseSearchResult,
  BreadcrumbItem,
  Heading,
  NavbarSearchResult,
  NestedNavItem,
  SidebarItem,
  SidebarProps,
} from "./types";
// Hooks 导出
export { useActiveSection } from "./use-active-section";
