"use client";

import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type MDXLinkProps = {
	href: string;
	children: React.ReactNode;
	className?: string;
	external?: boolean;
	openInNewTab?: boolean;
	showExternalIcon?: boolean;
} & React.AnchorHTMLAttributes<HTMLAnchorElement>;

const isExternalLink = (href: string): boolean =>
	href.startsWith("http") ||
	href.startsWith("mailto:") ||
	href.startsWith("tel:");

export const MDXLink = ({
	href,
	children,
	className,
	external,
	openInNewTab = true,
	showExternalIcon = true,
}: MDXLinkProps) => {
	if (!href) return null;

	const isExternal = external ?? isExternalLink(href);
	// 使用 background 渐变实现从左到右延伸的下划线动画
	// 支持多行文本，效果更好
	const linkClasses = cn(
		"not-prose font-medium text-primary",
		"bg-gradient-to-r from-primary/80 to-primary/80",
		"bg-[length:0%_2px] bg-left-bottom bg-no-repeat",
		"transition-[background-size] duration-300 ease-in-out",
		"hover:bg-[length:100%_2px]",
		"isExternal && text-primary",
		className,
	);

	if (isExternal) {
		return (
			<a
				href={href}
				className={linkClasses}
				target={openInNewTab ? "_blank" : undefined}
				rel="noopener noreferrer"
			>
				{children}
				{showExternalIcon && (
					<ExternalLink className="ml-1 inline-block h-3 w-3" />
				)}
			</a>
		);
	}

	return (
		<Link href={href} className={linkClasses}>
			{children}
		</Link>
	);
};
