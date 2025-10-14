import type { ComponentType, ReactNode } from "react";

/** 基础导航项 */
export interface BaseNavItem {
  /** 导航项标识 */
  key: string;
  /** 显示标签 */
  label: string;
  /** 链接地址 */
  href?: string;
  /** 图标 */
  icon?: ComponentType<{ className?: string }> | ReactNode;
  /** 是否为外部链接 */
  external?: boolean;
  /** 是否禁用 */
  disabled?: boolean;
  /** 描述信息 */
  description?: string;
  /** 子导航项 */
  children?: BaseNavItem[];
}

/** 导航栏 Props 接口 */
export interface NavbarProps {
  /** 自定义类名 */
  className?: string;
  /** 是否固定在顶部 */
  fixed?: boolean;
  /** 是否显示阴影 */
  shadow?: boolean;
  /** 导航项列表 */
  items?: BaseNavItem[];
}

/** Logo Props 接口 */
export interface LogoProps {
  /** 自定义类名 */
  className?: string;
  /** Logo 文本 */
  text?: string;
  /** Logo 图片 URL */
  imageUrl?: string;
  /** 链接地址 */
  href?: string;
  /** 是否显示文本 */
  showText?: boolean;
}

/** 导航菜单 Props 接口 */
export interface NavMenuProps {
  /** 导航项列表 */
  items: BaseNavItem[];
  /** 自定义类名 */
  className?: string;
  /** 菜单方向 */
  direction?: "horizontal" | "vertical";
  /** 是否可折叠 */
  collapsible?: boolean;
}
