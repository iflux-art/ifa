"use client";

import { Check, Copy } from "lucide-react";
import Prism from "prismjs";
import React, { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import "prismjs/themes/prism-tomorrow.css"; // 使用暗色主题
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-json";
import "prismjs/components/prism-css";
import "prismjs/components/prism-python";
import "prismjs/plugins/line-numbers/prism-line-numbers.js";
import "prismjs/plugins/line-numbers/prism-line-numbers.css";
import "./mdx-pre-styles.css"; // 自定义样式

interface CodeBlockProps {
	code: string;
	language: string;
	fileName?: string;
	showLineNumbers?: boolean;
	highlightLines?: number[];
	className?: string;
}

/**
 * 代码块组件 - 提供语法高亮和统一样式
 */
function CodeBlock({
	code,
	language,
	fileName,
	showLineNumbers = true,
	highlightLines = [],
	className,
}: CodeBlockProps) {
	const codeRef = useRef<HTMLElement>(null);
	const preRef = useRef<HTMLPreElement>(null);
	const [copied, setCopied] = useState(false);
	const [mounted, setMounted] = useState(false);

	// 处理语言名称
	const getLanguage = React.useCallback(() => {
		const langMap: Record<string, string> = {
			js: "javascript",
			jsx: "jsx",
			ts: "typescript",
			tsx: "tsx",
			html: "html",
			css: "css",
			json: "json",
			bash: "bash",
			sh: "bash",
			python: "python",
			py: "python",
		};

		return langMap[language.toLowerCase()] || language.toLowerCase();
	}, [language]);

	// 处理复制代码功能
	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(code);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch (err) {
			console.error("复制失败:", err);
		}
	};

	// 设置组件已挂载
	useEffect(() => {
		setMounted(true);
	}, []);

	// 应用代码高亮
	useEffect(() => {
		if (mounted && codeRef.current) {
			try {
				const lang = getLanguage();
				// 检查 Prism 是否支持该语言
				if (Prism.languages[lang]) {
					// 应用高亮
					Prism.highlightElement(codeRef.current);
				}
			} catch (error) {
				console.warn("代码高亮处理失败:", error);
			}
		}
	}, [mounted, getLanguage]);

	// 获取语言显示名称
	const getLanguageDisplayName = React.useCallback(() => {
		const langMap: Record<string, string> = {
			javascript: "JavaScript",
			jsx: "JSX",
			typescript: "TypeScript",
			tsx: "TSX",
			html: "HTML",
			css: "CSS",
			json: "JSON",
			bash: "Bash",
			python: "Python",
		};

		const lang = getLanguage();
		return langMap[lang] || lang.charAt(0).toUpperCase() + lang.slice(1);
	}, [getLanguage]);

	// 手动创建行高亮标记
	const renderHighlightLines = () => {
		if (!mounted || highlightLines.length === 0) {
			return null;
		}

		const lineHeight = 22; // 行高
		const paddingTop = fileName ? 64 : 36; // 上内边距加上标题栏高度

		return highlightLines.map((lineNumber) => (
			<div
				key={`highlight-${lineNumber}`}
				className="absolute right-0 left-0 border-blue-500 border-l-2 bg-blue-100/40 dark:bg-[#3b3b3b]/80"
				style={{
					top: `${paddingTop + (lineNumber - 1) * lineHeight}px`,
					height: `${lineHeight}px`,
					zIndex: 0,
				}}
			/>
		));
	};

	return (
		<div
			className={cn(
				"relative my-6 overflow-hidden rounded-md border border-border bg-background transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10",
				className,
			)}
		>
			{/* 标题栏 */}
			<div className="flex items-center justify-between border-border border-b bg-muted/80 px-4 py-2 dark:bg-muted/50">
				{/* 左侧语言标签和文件名 */}
				<div className="flex items-center gap-2">
					<Badge variant="secondary" className="px-2 py-1 font-medium text-xs">
						{getLanguageDisplayName()}
					</Badge>
					{fileName && (
						<span className="font-medium text-muted-foreground text-xs">
							{fileName}
						</span>
					)}
				</div>

				{/* 复制按钮 */}
				<button
					type="button"
					onClick={handleCopy}
					className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary/80 hover:text-foreground"
					title={copied ? "已复制!" : "复制代码"}
					aria-label={copied ? "已复制" : "复制代码"}
				>
					{copied ? (
						<Check className="h-4 w-4 text-green-500" />
					) : (
						<Copy className="h-4 w-4" />
					)}
				</button>
			</div>

			{/* 代码块 */}
			<div className="relative">
				{/* 自定义高亮行 */}
				{renderHighlightLines()}

				<pre
					ref={preRef}
					className={cn(
						"group relative z-10 m-0 max-h-[500px] overflow-auto bg-background p-4 font-mono text-[0.9rem]",
						showLineNumbers && mounted ? "line-numbers" : "",
					)}
					style={{
						fontFamily:
							"'JetBrains Mono', 'Fira Code', 'Cascadia Code', 'Roboto Mono', monospace",
					}}
				>
					<code
						ref={codeRef}
						className={mounted ? `language-${getLanguage()}` : undefined}
					>
						{code}
					</code>
				</pre>
			</div>
		</div>
	);
}

type MDXPreProps = {
	children: React.ReactNode;
	className?: string;
} & React.HTMLAttributes<HTMLPreElement>;

/**
 * 从 children 中提取代码内容和语言
 */
function extractCodeInfo(children: React.ReactNode): {
	code: string;
	language: string;
} {
	let code = "";
	let language = "plaintext";

	// 直接从pre标签的className中提取语言信息
	if (
		React.isValidElement(children) &&
		children.props &&
		typeof children.props === "object" &&
		"className" in children.props
	) {
		const preClassName = children.props.className as string | undefined;
		const langMatch = preClassName?.match(/language-(\w+)/);
		if (langMatch?.[1]) {
			language = langMatch[1];
		}
	}

	// 递归遍历 children 来提取代码内容
	const extractText = (node: React.ReactNode): string => {
		if (typeof node === "string") {
			return node;
		}
		if (typeof node === "number") {
			return String(node);
		}
		if (React.isValidElement(node)) {
			// 检查是否是 code 元素
			if (
				node.type === "code" &&
				typeof node.props === "object" &&
				node.props &&
				"className" in node.props
			) {
				const className = node.props.className as string | undefined;
				const langMatch = className?.match(/language-(\w+)/);
				if (langMatch?.[1]) {
					language = langMatch[1];
				}
			}
			// 递归处理子元素
			if (
				typeof node.props === "object" &&
				node.props &&
				"children" in node.props
			) {
				return extractText(node.props.children as React.ReactNode);
			}
		}
		if (Array.isArray(node)) {
			return node.map(extractText).join("");
		}
		return "";
	};

	code = extractText(children);
	return { code: code.trim(), language };
}

/**
 * MDX Pre 组件 - 处理代码块
 * 转换 MDX 代码块为 CodeBlock 组件，提供语法高亮和统一样式
 */
export function MDXPre({ children, className, ...props }: MDXPreProps) {
	const { code, language } = extractCodeInfo(children);

	// 如果有代码内容则使用 CodeBlock，否则回退到原始 pre 元素
	if (code) {
		return (
			<CodeBlock
				code={code}
				language={language}
				showLineNumbers={true}
				className={className}
			/>
		);
	}

	// 回退到原始 pre 元素
	return (
		<pre className={className} {...props}>
			{children}
		</pre>
	);
}

export default MDXPre;
