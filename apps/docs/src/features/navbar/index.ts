/**
 * Navbar 功能模块统一导出
 */

// 组件导出
export {
  Logo,
  MainNavbar,
  NavItem,
  NavItemList,
  NavLink,
  ActiveLink,
  NavListMenu,
  // 移除了 HamburgerMenu 和 NavCardMenu 的导出
} from "./components";

// Hooks 导出
export { useNavbarScroll, useActiveSection } from "./hooks";

// Store 导出
export { useNavbarStore } from "./stores/navbar-store.standard";

// 类型导出
export type {
  BaseNavItem,
  ExtendedNavItem,
  ScrollDirection,
  NavbarState,
  NavbarActions,
  NavbarStore,
  NavContentType,
  NavContentItem,
} from "./types";

// 配置和类型导出
export { NAV_ITEMS, NAV_PATHS, NAV_DESCRIPTIONS } from "./components/nav-config";
export type { NavConfigItem } from "./components/nav-config";
