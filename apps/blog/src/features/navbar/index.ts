/**
 * Navbar 功能模块统一导出
 */

// 组件导出
export {
  ActiveLink,
  Logo,
  MainNavbar,
  NavItem,
  NavItemList,
  NavLink,
  NavListMenu,
  // HamburgerMenu 和 NavCardMenu 已移除
} from "./components";
export type { NavConfigItem } from "./components/nav-config";
// 配置和类型导出
export {
  NAV_DESCRIPTIONS,
  NAV_ITEMS,
  NAV_PATHS,
} from "./components/nav-config";
// Hooks 导出
export { useActiveSection, useNavbarScroll } from "./hooks";
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
