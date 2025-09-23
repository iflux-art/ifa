/**
 * Navbar 组件统一导出
 */

export { Logo } from "./logo";
// 核心组件
export { MainNavbar } from "./main-navbar";
export type { NavConfigItem } from "./nav-config";
export { NAV_DESCRIPTIONS, NAV_ITEMS, NAV_PATHS } from "./nav-config";
export { NavLink } from "./nav-link";
// 导航菜单组件
export { NavListMenu } from "./nav-menu";
// Store
export { useNavbarStore } from "./navbar-store.standard";
// 配置和类型
export type { BaseNavItem } from "./types";
// Hooks
export { useActiveSection } from "./use-active-section";
export { useNavbarScroll } from "./use-navbar-scroll";
