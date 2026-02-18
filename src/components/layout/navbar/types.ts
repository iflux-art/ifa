/**
 * Navbar 功能模块类型定义
 */

import type { ComponentType, ReactNode } from "react";

/** 面包屑导航项 */
export interface BreadcrumbItem {
	/** 显示的标签文本 */
	label: string;
	/** 链接地址，如果不提供则显示为纯文本 */
	href?: string;
	/** 是否为当前页面 */
	isCurrent?: boolean;
}

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
}
