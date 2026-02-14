"use client";

import { cn } from "@/lib/utils";

interface FooterProps {
	className?: string;
}

/**
 * 底栏组件
 * 显示版权信息，支持自定义样式
 */
export const Footer = ({ className }: FooterProps) => (
	<footer
		className={cn(
			"w-full border-border/30 border-t bg-transparent py-4 md:py-6",
			className,
		)}
	>
		<div className="container mx-auto flex items-center justify-center px-4">
			<div className="text-muted-foreground text-sm">
				© 2025 iFluxArt 保留所有权利
			</div>
		</div>
	</footer>
);
