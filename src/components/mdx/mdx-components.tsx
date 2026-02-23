/**
 * MDX 组件配置
 * 统一管理所有 MDX 组件映射
 *
 * 注意：基础排版样式由 @tailwindcss/typography 插件提供
 * 这里只定义需要特殊处理的组件
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

/**
 * 提取文本内容用于生成 ID
 */
function extractText(children: unknown): string {
	if (typeof children === "string") return children;
	if (typeof children === "number") return String(children);
	if (Array.isArray(children)) return children.map(extractText).join("");
	if (
		typeof children === "object" &&
		children !== null &&
		"props" in children
	) {
		const props = (children as { props?: { children?: unknown } }).props;
		return props?.children ? extractText(props.children) : "";
	}
	return "";
}

/**
 * H2 组件 - 添加锚点支持和独特样式
 */
const H2 = ({ children }: { children?: React.ReactNode }) => {
	const text = extractText(children);
	const id = generateHeadingId(text);
	return (
		<h2
			id={id}
			className="group relative mt-8 mb-4 scroll-mt-20 font-bold text-xl"
		>
			<span className="relative block w-full rounded-r-lg border-primary/30 border-l-4 bg-primary/5 px-5 py-3">
				{children}
			</span>
		</h2>
	);
};

/**
 * H3 组件 - 添加锚点支持
 */
const H3 = ({ children }: { children?: React.ReactNode }) => {
	const text = extractText(children);
	const id = generateHeadingId(text);
	return (
		<h3
			id={id}
			className="group relative mt-6 mb-3 scroll-mt-20 font-semibold text-lg"
		>
			<span className="relative">{children}</span>
		</h3>
	);
};

/**
 * H4 组件 - 添加锚点支持
 */
const H4 = ({ children }: { children?: React.ReactNode }) => {
	const text = extractText(children);
	const id = generateHeadingId(text);
	return (
		<h4
			id={id}
			className="group relative mt-5 mb-2 scroll-mt-20 font-medium text-base"
		>
			{children}
		</h4>
	);
};

/**
 * P 组件 - 段落样式
 */
const P = ({ children }: { children?: React.ReactNode }) => {
	return <p className="my-1.5 leading-relaxed">{children}</p>;
};

/**
 * MDX 组件映射配置
 * 将 HTML 元素映射到自定义 React 组件
 *
 * 以下元素由 @tailwindcss/typography 处理，无需自定义：
 * - p, h1, h5, h6 - 基础排版
 * - ul, ol, li - 列表
 * - table, thead, tbody, tr, th, td - 表格
 * - hr - 分隔线
 */
export const MDXComponents = {
	// 标题 - 添加锚点支持
	h2: H2,
	h3: H3,
	h4: H4,

	// 段落 - 自定义间距和行高
	p: P,

	// 链接和媒体 - 特殊处理
	a: MDXLink,
	img: MDXImg,

	// 代码 - 语法高亮和复制功能
	pre: MDXPre,
	code: MDXCode,

	// 引用 - 自定义样式
	blockquote: MDXBlockquote,
} as const;

/**
 * MDX 组件 Hook
 * 提供统一的组件获取接口
 */
export const useMDXComponents = () => MDXComponents;
