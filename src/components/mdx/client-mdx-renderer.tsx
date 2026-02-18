"use client";

import { evaluateSync } from "@mdx-js/mdx";
import { MDXProvider } from "@mdx-js/react";
import matter from "gray-matter";
import { type ComponentType, useMemo } from "react";
import * as runtime from "react/jsx-runtime";
import remarkGfm from "remark-gfm";
import { useMDXComponents } from "@/components/mdx/mdx-components";

interface ClientMDXRendererProps {
	content: string;
	/**
	 * Custom error component to display when MDX parsing fails
	 */
	errorComponent?: ComponentType<{ error: Error }>;
}

/**
 * Default error component for MDX parsing failures
 */
function DefaultErrorComponent() {
	return (
		<div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-destructive">
			<p className="font-medium">MDX 内容解析失败</p>
			<p className="text-sm">请检查内容格式是否正确</p>
		</div>
	);
}

/**
 * 客户端 MDX 渲染器
 * 负责在客户端动态编译和渲染 MDX 内容
 *
 * Note: For production, consider using server-side MDX compilation
 * with @next/mdx for better performance.
 *
 * @see https://nextjs.org/docs/app/building-your-application/configuring/mdx
 */
export default function ClientMDXRenderer({
	content,
	errorComponent: ErrorComponent = DefaultErrorComponent,
}: ClientMDXRendererProps) {
	const components = useMDXComponents();

	const { MDXContent, error } = useMemo(() => {
		try {
			// 解析并移除 frontmatter
			const { content: pureContent } = matter(content);

			// 编译为 React 组件
			const mdxModule = evaluateSync(pureContent, {
				...runtime,
				useMDXComponents: () => components,
				remarkPlugins: [remarkGfm],
			});

			return { MDXContent: mdxModule.default, error: null };
		} catch (err) {
			console.error("MDX 编译失败:", err);
			return {
				MDXContent: null,
				error: err instanceof Error ? err : new Error("Unknown error"),
			};
		}
	}, [content, components]);

	if (error) {
		return <ErrorComponent error={error} />;
	}

	if (!MDXContent) {
		return <ErrorComponent error={new Error("No content")} />;
	}

	return (
		<MDXProvider components={components}>
			<MDXContent />
		</MDXProvider>
	);
}
