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
  // 移除了 HamburgerMenu 和 NavCardMenu 的导出
} from './components'
export type { NavConfigItem } from './components/nav-config'
// 配置和类型导出
export { NAV_DESCRIPTIONS, NAV_ITEMS, NAV_PATHS } from './components/nav-config'
// Hooks 导出
export { useActiveSection, useNavbarScroll } from './hooks'
// Store 导出
export { useNavbarStore } from './stores/navbar-store.standard'
// 类型导出
export type {
  BaseNavItem,
  ExtendedNavItem,
  NavbarActions,
  NavbarState,
  NavbarStore,
  NavContentItem,
  NavContentType,
  ScrollDirection,
} from './types'
