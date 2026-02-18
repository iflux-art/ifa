import { Home, Link, type LucideIcon, PenTool } from "lucide-react";
import type { BaseNavItem } from "./types";

/**
 * 导航配置项接口
 */
export interface NavConfigItem extends BaseNavItem {
	/** 描述文本 */
	description: string;
	/** 是否在特定场景下隐藏 */
	hidden?: boolean;
	/** 子菜单项 */
	children?: readonly NavConfigItem[];
	/** 图标 */
	icon?: LucideIcon;
}

export const NAV_ITEMS = [
	{
		key: "blog",
		label: "博客",
		description: "阅读最新的文章，了解行业动态和技术趋势",
		icon: PenTool,
	},
	{
		key: "friends",
		label: "友链",
		description: "探索我们的合作伙伴和友情链接，发现更多优质资源",
		icon: Link,
	},
	{
		key: "hub",
		label: "导航",
		description: "网址导航和资源集合",
		icon: Home,
		href: "https://hub.iflux.art/",
	},
] as const;

export const NAV_PATHS: Record<string, string> = {
	blog: "/",
	friends: "/friends",
	hub: "https://hub.iflux.art/",
} as const;
