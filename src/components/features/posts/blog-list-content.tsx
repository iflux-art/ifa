"use client";

import { forwardRef } from "react";
import type { BlogPost } from "@/components/features/posts/blog-types";
import { formatDate } from "@/components/features/posts/client-utils";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// Re-export formatDate for backward compatibility
export { formatDate };

// 内联文章卡片相关类型定义
interface BlogCardProps {
	title: string;
	description?: string;
	href: string;
	category?: string;
	tags?: string[];
	author?: string;
	className?: string;
	onCategoryClick?: (category: string) => void;
	onTagClick?: (tag: string) => void;
}

// 分类徽章组件
interface CategoryBadgeProps {
	category: string;
	onCategoryClick?: (category: string) => void;
}

const CategoryBadge = ({ category, onCategoryClick }: CategoryBadgeProps) => (
	<Badge
		variant="secondary"
		className="cursor-pointer touch-manipulation px-2.5 py-1 font-medium text-xs transition-colors hover:bg-primary hover:text-primary-foreground"
		onClick={(e) => {
			e.preventDefault();
			e.stopPropagation();
			onCategoryClick?.(category);
		}}
	>
		{category}
	</Badge>
);

// 标签列表组件
interface TagBadgesProps {
	tags: string[];
	onTagClick?: (tag: string) => void;
}

const TagBadges = ({ tags, onTagClick }: TagBadgesProps) => (
	<div className="flex flex-wrap gap-1">
		{tags.slice(0, 4).map((tag) => (
			<Badge
				key={tag}
				variant="outline"
				className="cursor-pointer touch-manipulation border-muted-foreground/20 px-2 py-0.5 text-xs transition-colors hover:border-primary/30 hover:bg-accent/50"
				onClick={(e) => {
					e.preventDefault();
					e.stopPropagation();
					onTagClick?.(tag);
				}}
			>
				{tag}
			</Badge>
		))}
	</div>
);

/**
 * 文章卡片组件
 * 完整的独立实现，包含所有必要的样式和交互逻辑
 */
const BlogCard = forwardRef<HTMLAnchorElement, BlogCardProps>(
	(
		{
			title,
			description,
			href,
			category,
			tags = [],
			className,
			onCategoryClick,
			onTagClick,
		},
		ref,
	) => (
		<a ref={ref} href={href} className="block h-full">
			<Card
				className={cn(
					"group h-full overflow-hidden border transition-all duration-300 hover:border-primary/50 hover:shadow-lg",
					// 移动端触摸优化
					"touch-manipulation active:scale-[0.98]",
					className,
				)}
			>
				<div className="flex h-full">
					{/* 内容区域 */}
					<div className="flex w-full flex-1 flex-col p-4">
						{/* Title with Category on the right */}
						<div className="mb-2 flex items-center gap-2">
							<h2 className="flex-1 truncate font-bold text-base leading-tight transition-colors group-hover:text-primary">
								{title}
							</h2>
							{category && (
								<CategoryBadge
									category={category}
									onCategoryClick={onCategoryClick}
								/>
							)}
						</div>

						{/* Description - 2 lines */}
						{description && (
							<p className="mb-2 line-clamp-2 text-muted-foreground text-sm">
								{description}
							</p>
						)}

						{/* Tags - 1 line */}
						{tags.length > 0 && (
							<div className="mt-auto">
								<TagBadges tags={tags} onTagClick={onTagClick} />
							</div>
						)}
					</div>
				</div>
			</Card>
		</a>
	),
);

BlogCard.displayName = "BlogCard";

export interface BlogListContentProps {
	posts: BlogPost[];
	selectedCategory?: string | null;
	selectedTag?: string | null;
	onCategoryClick?: (category: string | null) => void;
	onTagClick?: (tag: string | null) => void;
}

/**
 * 博客列表内容组件
 *
 * 显示博客文章列表
 */
export const BlogListContent = ({
	posts,
	selectedCategory,
	selectedTag,
	onCategoryClick,
	onTagClick,
}: BlogListContentProps) => {
	// 生成筛选结果为空时的提示信息
	const getEmptyMessage = () => {
		if (selectedCategory && selectedTag) {
			return `未找到分类为"${selectedCategory}"且包含标签"${selectedTag}"的文章`;
		} else if (selectedCategory) {
			return `未找到分类为"${selectedCategory}"的文章`;
		} else if (selectedTag) {
			return `未找到包含标签"${selectedTag}"的文章`;
		} else {
			return "暂无文章";
		}
	};

	if (!posts.length) {
		return (
			<div className="flex min-h-[400px] items-center justify-center">
				<div className="text-center">
					<p className="text-lg text-muted-foreground">{getEmptyMessage()}</p>
					{(selectedCategory ?? selectedTag) && (
						<p className="mt-2 text-muted-foreground text-sm">
							尝试调整筛选条件或清除筛选查看所有文章
						</p>
					)}
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			{posts.map((post: BlogPost) => (
				<BlogCard
					key={post.slug}
					title={post.title}
					description={post.description}
					href={`/posts/${post.slug}`}
					category={post.category}
					tags={post.tags}
					author={post.author}
					onCategoryClick={onCategoryClick}
					onTagClick={onTagClick}
				/>
			))}
		</div>
	);
};
