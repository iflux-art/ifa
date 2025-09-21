import { FileText, Home, PenTool } from "lucide-react";
import type { BaseNavItem } from "./navbar-types";

// 导航项配置
export const NAV_ITEMS: BaseNavItem[] = [
  {
    key: "buttons",
    label: "按钮组件",
    href: "/#buttons",
    icon: PenTool,
  },
  {
    key: "layout",
    label: "布局组件",
    href: "/#layout",
    icon: FileText,
  },
  {
    key: "grid-layout-demo",
    label: "网格布局",
    href: "/grid-layout-demo",
    icon: Home,
  },
];

// 导航路径映射
export const NAV_PATHS: Record<string, string> = {
  buttons: "/#buttons",
  layout: "/#layout",
  "grid-layout-demo": "/grid-layout-demo",
};

// 导航描述信息
export const NAV_DESCRIPTIONS: Record<string, string> = {
  buttons: "查看按钮组件示例",
  layout: "查看布局组件示例",
  "grid-layout-demo": "查看网格布局组件演示",
};
