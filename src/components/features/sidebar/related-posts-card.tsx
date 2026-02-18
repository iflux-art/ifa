import { ArrowRightLeft, FileText } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// 相关文章类型定义
export interface RelatedPost {
	title: string;
	href: string;
	category?: string;
	slug: string[];
}

export interface RelatedPostsCardProps {
	posts?: RelatedPost[];
	currentSlug: string[];
}

/**
 * 相关文章卡片组件
 */
export const RelatedPostsCard = ({
	posts = [],
	currentSlug,
}: RelatedPostsCardProps) => {
	const validPosts = posts || [];

	// 即使没有相关文章也渲染组件
	const currentPath = `/blog/${currentSlug.join("/")}`;

	return (
		<Card className="w-full transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10">
			<CardHeader className="pt-4 pb-2">
				<CardTitle className="flex items-center gap-2 font-medium text-foreground text-sm">
					<ArrowRightLeft className="h-3.5 w-3.5 text-primary" />
					相关文章
				</CardTitle>
			</CardHeader>
			<CardContent className="pt-0 pb-4">
				{validPosts.length > 0 ? (
					validPosts.slice(0, 5).map((post, index) => {
						const isActive = currentPath === post.href;
						// 使用索引和href的组合作为唯一key，避免重复
						const uniqueKey = `${post.href}-${index}`;
						return (
							<Link
								key={uniqueKey}
								href={post.href}
								className={cn(
									"group flex items-start gap-2 rounded-md p-2 text-xs transition-all duration-200 hover:bg-muted/60 active:scale-[0.98]",
									isActive && "bg-muted font-medium text-primary",
								)}
							>
								<FileText className="mt-0.5 h-3 w-3 shrink-0 text-muted-foreground/70 group-hover:text-foreground/80" />
								<div className="min-w-0 flex-1">
									<p className="truncate text-muted-foreground leading-relaxed group-hover:text-foreground">
										{post.title}
									</p>
								</div>
							</Link>
						);
					})
				) : (
					<p className="text-muted-foreground text-sm">暂无相关文章</p>
				)}
			</CardContent>
		</Card>
	);
};
