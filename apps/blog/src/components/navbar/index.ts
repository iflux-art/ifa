/**
 * Navbar 功能模块统一导出
 */

// 组件导出
export { ActiveLink, NavLink } from "./nav-link";
export { NavItem, NavItemList } from "./nav-item";
export { NavListMenu } from "./nav-menu";
export { Logo } from "./logo";
export { MainNavbar } from "./main-navbar";

// 配置和类型导出
export type { NavConfigItem } from "./nav-config";
export {
  NAV_DESCRIPTIONS,
  NAV_ITEMS,
  NAV_PATHS,
} from "./nav-config";

// Hooks 导出
export { useActiveSection } from "./use-active-section";
export { useNavbarScroll } from "./use-navbar-scroll";

// Store 导出
export { useNavbarStore } from "./navbar-store";

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
