/**
 * MDX 组件配置
 * 统一管理所有 MDX 组件映射
 */

import type React from "react";
import { MDXBlockquote } from "@/components/mdx/mdx-blockquote";
import { MDXCode } from "@/components/mdx/mdx-code";
import { MDXImg } from "@/components/mdx/mdx-img";
import { MDXLink } from "@/components/mdx/mdx-link";
import { MDXPre } from "@/components/mdx/mdx-pre";

/**
 * 生成标题 ID
 */
function generateHeadingId(text: string): string {
	return (
		text
			.toLowerCase()
			// 处理 Markdown 链接 [文本](url)
			.replace(/\[[^\]]+\]\([^)]+\)/g, "$1")
			// 移除非字母数字字符
			.replace(/[^\u4e00-\u9fa5a-z0-9]+/g, "-")
			// 移除首尾连字符
			.replace(/^-+|-+$/g, "")
	);
}

// 标题样式映射
const headingStyles: Record<number, string> = {
	1: "scroll-mt-20 text-3xl font-bold tracking-tight",
	2: "scroll-mt-20 text-2xl font-semibold tracking-tight",
	3: "scroll-mt-20 text-xl font-semibold",
	4: "scroll-mt-20 text-lg font-medium",
	5: "scroll-mt-20 text-base font-medium",
	6: "scroll-mt-20 text-base font-medium",
};

/**
 * H2 组件
 */
const H2 = ({ children }: { children?: React.ReactNode }) => {
	const text = typeof children === "string" ? children : "";
	const id = generateHeadingId(text);
	return (
		<h2 id={id} className={headingStyles[2]}>
			{children}
		</h2>
	);
};

/**
 * H3 组件
 */
const H3 = ({ children }: { children?: React.ReactNode }) => {
	const text = typeof children === "string" ? children : "";
	const id = generateHeadingId(text);
	return (
		<h3 id={id} className={headingStyles[3]}>
			{children}
		</h3>
	);
};

/**
 * H4 组件
 */
const H4 = ({ children }: { children?: React.ReactNode }) => {
	const text = typeof children === "string" ? children : "";
	const id = generateHeadingId(text);
	return (
		<h4 id={id} className={headingStyles[4]}>
			{children}
		</h4>
	);
};

/**
 * MDX 组件映射配置
 * 将 HTML 元素映射到自定义 React 组件
 */
export const MDXComponents = {
	a: MDXLink,
	blockquote: MDXBlockquote,
	code: MDXCode,
	img: MDXImg,
	pre: MDXPre,
	h2: H2,
	h3: H3,
	h4: H4,
} as const;

/**
 * MDX 组件 Hook
 * 提供统一的组件获取接口
 */
export const useMDXComponents = () => MDXComponents;
