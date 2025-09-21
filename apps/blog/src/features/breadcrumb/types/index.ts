/**
 * Breadcrumb 类型定义
 */

import type { ReactNode } from "react";

// ==================== 面包屑相关类型 ====================

/** 面包屑导航项 */
export interface BreadcrumbItem {
  /** 显示的标签文本 */
  label: string;
  /** 链接地址，如果不提供则显示为纯文本 */
  href?: string;
  /** 是否为当前页面 */
  isCurrent?: boolean;
}

/** 面包屑属性 */
export interface BreadcrumbProps {
  /** 面包屑导航项列表 */
  items: BreadcrumbItem[];
  /** 分隔符，默认为 "/" */
  separator?: string | ReactNode;
  /** 额外的CSS类名 */
  className?: string;
}
