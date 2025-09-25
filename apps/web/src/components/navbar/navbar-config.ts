import { FileText, Home, Link, PenTool } from "lucide-react";
import type { ComponentType, ReactNode } from "react";

/** 基础导航项 */
interface BaseNavItem {
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
}

// 导航项配置
export const NAV_ITEMS: BaseNavItem[] = [
  {
    key: "blog",
    label: "博客",
    href: "https://blog.iflux.art/",
    icon: PenTool,
  },
  {
    key: "docs",
    label: "文档",
    href: "https://docs.iflux.art/",
    icon: FileText,
  },
  {
    key: "hub",
    label: "导航",
    href: "https://hub.iflux.art/",
    icon: Home,
  },
  {
    key: "friends",
    label: "友链",
    href: "https://blog.iflux.art/friends/",
    icon: Link,
  },
];

// 导航路径映射
export const NAV_PATHS: Record<string, string> = {
  blog: "https://blog.iflux.art/",
  docs: "https://docs.iflux.art/",
  hub: "https://hub.iflux.art/",
  friends: "https://blog.iflux.art/friends/",
};

// 导航描述信息
export const NAV_DESCRIPTIONS: Record<string, string> = {
  blog: "查看最新博客文章",
  docs: "查阅技术文档和指南",
  hub: "查看网站导航",
  friends: "查看友情链接",
};
