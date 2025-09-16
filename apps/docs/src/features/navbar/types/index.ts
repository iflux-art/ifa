/**
 * 导航栏相关类型定义
 */

// ==================== 基础导航项类型 ====================

/** 基础导航项接口 */
export interface BaseNavItem {
  /** 导航项唯一标识 */
  key: string;
  /** 导航项显示文本 */
  label: string;
  /** 导航项链接地址 */
  href?: string;
  /** 是否为外部链接 */
  external?: boolean;
  /** 是否在新窗口打开 */
  newWindow?: boolean;
  /** 是否禁用 */
  disabled?: boolean;
}

// ==================== 扩展导航项类型 ====================

/** 扩展导航项接口 */
export interface ExtendedNavItem extends BaseNavItem {
  /** 子导航项 */
  children?: ExtendedNavItem[];
  /** 图标名称 */
  icon?: string;
  /** 描述文本 */
  description?: string;
  /** 是否为分隔符 */
  separator?: boolean;
  /** 自定义类名 */
  className?: string;
}

// ==================== 导航栏状态类型 ====================

/** 导航栏滚动方向 */
export type ScrollDirection = "up" | "down" | "none";

/** 导航栏状态接口 */
export interface NavbarState {
  /** 当前滚动方向 */
  direction: ScrollDirection;
  /** 当前滚动位置 */
  position: number;
  /** 是否显示页面标题 */
  showTitle: boolean;
  /** 页面标题 */
  pageTitle: string;
  /** 上次方向改变时间戳 */
  lastDirectionChange: number;
  /** 是否已初始化 */
  isInitialized: boolean;
}

/** 导航栏操作接口 */
export interface NavbarActions {
  /** 设置滚动位置 */
  setScrollPosition: (position: number) => void;
  /** 设置页面标题 */
  setPageTitle: (title: string) => void;
  /** 滚动到顶部 */
  scrollToTop: () => void;
  /** 初始化导航栏 */
  initialize: () => void;
}

/** 导航栏派生状态类型 */
export interface NavbarDerivedState {
  // 派生状态将在组件中计算，不在store中存储
  // 例如：是否应该隐藏导航栏、是否在页面顶部等
  shouldHideNavbar?: boolean;
  isAtTop?: boolean;
}

/** 导航栏完整store接口 */
export interface NavbarStore extends NavbarState, NavbarActions {}

// ==================== 导航内容类型 ====================

/** 导航内容项类型 */
export type NavContentType =
  | "doc"
  | "navigation"
  | "tool"
  | "command"
  | "history"
  | "link";

/** 导航内容项接口 */
export interface NavContentItem {
  /** 内容唯一标识 */
  id: string;
  /** 内容标题 */
  title: string;
  /** 内容描述 */
  description?: string;
  /** 内容类型 */
  type: NavContentType;
  /** 内容链接 */
  url?: string;
  /** 内容路径 */
  path?: string;
  /** 内容标签 */
  tags?: string[];
  /** 内容分类 */
  category?: string;
  /** 是否为外部链接 */
  external?: boolean;
}
