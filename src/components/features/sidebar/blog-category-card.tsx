"use client";

import { Folder } from "lucide-react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

/**
 * 分类
 */
export interface CategoryItem {
	/** 分类名称 */
	name: string;
}

/**
 * @deprecated 使用 CategoryItem 代替
 */
export type CategoryWithCount = CategoryItem;

export interface BlogCategoryCardProps {
	categories?: CategoryItem[];
	selectedCategory?: string;
	onCategoryClick?: (category: string | null) => void;
	className?: string;
	/**
	 * 是否启用路由功能
	 * @default false
	 */
	enableRouting?: boolean;
	/**
	 * 是否显示标题栏
	 * @default true
	 */
	showHeader?: boolean;
}

/**
 * 博客分类卡片组件
 *
 * 以卡片形式显示博客分类，支持点击筛选功能
 */
export const BlogCategoryCard = ({
	categories = [],
	selectedCategory,
	onCategoryClick,
	className,
	enableRouting = false,
	showHeader = true,
}: BlogCategoryCardProps) => {
	const router = useRouter();

	const handleClick = (category: string | null) => {
		if (enableRouting) {
			if (category) {
				router.push(`/?category=${encodeURIComponent(category)}`);
			} else {
				router.push("/");
			}
		}
		onCategoryClick?.(category);
	};

	return (
		<Card
			className={cn(
				"w-full transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10",
				className,
			)}
		>
			{showHeader && (
				<CardHeader className="pt-4 pb-2">
					<CardTitle className="flex items-center gap-2 font-medium text-foreground text-sm">
						<Folder className="h-3.5 w-3.5 text-primary" />
						分类
					</CardTitle>
				</CardHeader>
			)}
			<CardContent className={showHeader ? "pt-0 pb-4" : "py-4"}>
				<div className="hide-scrollbar overflow-y-auto">
					<div className="grid grid-cols-2 gap-1.5 sm:gap-2">
						{categories.map((category) => {
							const isSelected = selectedCategory === category.name;
							return (
								<button
									key={category.name}
									type="button"
									onClick={() => handleClick(isSelected ? null : category.name)}
									className={cn(
										"h-6 min-h-[32px] cursor-pointer touch-manipulation rounded-md px-2.5 py-1.5 font-normal text-sm transition-all duration-200 sm:h-5 sm:min-h-[20px] sm:px-2 sm:py-0.5 sm:text-[10px]",
										"hover:shadow-sm active:scale-95",
										isSelected
											? "bg-primary text-primary-foreground shadow-sm"
											: "border-0 bg-muted/60 text-muted-foreground hover:bg-primary/10 hover:text-primary active:bg-primary/20",
									)}
								>
									{category.name}
								</button>
							);
						})}
					</div>
				</div>
			</CardContent>
		</Card>
	);
};
