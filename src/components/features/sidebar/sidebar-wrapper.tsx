"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

// 响应式类名映射表
const RESPONSIVE_CLASS_MAP = {
	0: "block", // 000: 全部显示
	1: "lg:hidden xl:block", // 001: PC隐藏，移动端、平板和大屏显示
	2: "md:hidden xl:block", // 010: 平板隐藏，移动端和大屏显示
	3: "md:hidden", // 011: 平板和PC隐藏，移动端和大屏显示
	4: "hidden md:block", // 100: 移动端隐藏，平板及以上显示
	5: "hidden md:block lg:hidden xl:block", // 101: 移动端隐藏，平板显示，PC隐藏，大屏显示
	6: "hidden xl:block", // 110: 移动端和平板隐藏，大屏显示
	7: "hidden", // 111: 全部隐藏
} as const;

/**
 * 响应式类名生成函数
 * 根据不同设备尺寸生成对应的显示/隐藏类名
 */
function getResponsiveClasses(
	mobile: boolean,
	tablet: boolean,
	desktop: boolean,
): string {
	// 使用位运算生成索引：移动端(bit 2) + 平板(bit 1) + PC(bit 0)
	const index =
		(mobile ? 0b100 : 0) | (tablet ? 0b010 : 0) | (desktop ? 0b001 : 0);
	return (
		RESPONSIVE_CLASS_MAP[index as keyof typeof RESPONSIVE_CLASS_MAP] || "block"
	);
}

/**
 * 侧边栏默认配置常量
 */
const DEFAULT_SIDEBAR_CONFIG = {
	sticky: true,
	stickyTop: "80px",
	maxHeight: "calc(100vh - 6rem - env(safe-area-inset-bottom))",
	responsive: {
		hideOnMobile: true,
		hideOnTablet: false,
		hideOnDesktop: false,
	},
} as const;

/**
 * 侧边栏包装器属性接口
 */
interface SidebarWrapperProps {
	/**
	 * 侧边栏内容
	 */
	children: ReactNode;
	/**
	 * 侧边栏配置
	 */
	config: {
		/**
		 * 是否粘性定位
		 */
		sticky?: boolean;
		/**
		 * 粘性定位的top值
		 */
		stickyTop?: string;
		/**
		 * 最大高度
		 */
		maxHeight?: string;
		/**
		 * 响应式显示设置
		 */
		responsive?: {
			hideOnMobile?: boolean;
			hideOnTablet?: boolean;
			hideOnDesktop?: boolean;
		};
	};
}

/**
 * 侧边栏包装器组件
 * 提供统一的侧边栏样式和行为
 */
export const SidebarWrapper = ({ children, config }: SidebarWrapperProps) => {
	const {
		sticky = DEFAULT_SIDEBAR_CONFIG.sticky,
		stickyTop = DEFAULT_SIDEBAR_CONFIG.stickyTop,
		maxHeight = DEFAULT_SIDEBAR_CONFIG.maxHeight,
		responsive = DEFAULT_SIDEBAR_CONFIG.responsive,
	} = config;

	const { hideOnMobile, hideOnTablet, hideOnDesktop } = {
		...DEFAULT_SIDEBAR_CONFIG.responsive,
		...responsive,
	};

	// 生成响应式类名
	const responsiveClasses = getResponsiveClasses(
		hideOnMobile ?? false,
		hideOnTablet ?? false,
		hideOnDesktop ?? false,
	);

	return (
		<aside
			className={cn(
				"space-y-4",
				sticky && "sticky",
				responsiveClasses,
				// 使用已经定义的隐藏滚动条类名
				"scrollbar-hide",
			)}
			style={{
				top: sticky ? stickyTop : undefined,
				maxHeight: maxHeight ? maxHeight : undefined,
				overflowY: sticky ? "auto" : undefined,
			}}
		>
			{children}
		</aside>
	);
};
