"use client";

import type { BlogFrontmatter } from "@/components/features/posts/blog-content";
import { PostMeta } from "@/components/features/posts/post-meta";
import { BlogCategoryCard } from "@/components/features/sidebar/blog-category-card";
import { LatestPostsCard } from "@/components/features/sidebar/latest-posts-card";
import { RelatedPostsCard } from "@/components/features/sidebar/related-posts-card";
import { SidebarWrapper } from "@/components/features/sidebar/sidebar-wrapper";
import { TableOfContents } from "@/components/features/sidebar/table-of-contents";
import { TagCloudCard } from "@/components/features/sidebar/tag-cloud-card";
import ClientMDXRenderer from "@/components/mdx/client-mdx-renderer";

import { cn } from "@/lib/utils";

interface BlogPostPageProps {
	slug: string[];
	content: string;
	frontmatter: BlogFrontmatter;
	headings: {
		id: string;
		text: string;
		level: number;
	}[];
	relatedPosts: {
		title: string;
		href: string;
		category?: string;
		slug: string[];
	}[];
	latestPosts: {
		title: string;
		href: string;
		date?: string;
		category?: string;
	}[];
	allTags: {
		name: string;
		count: number;
	}[];
	allCategories: {
		name: string;
		count: number;
	}[];
}

/**
 * 博客文章页面容器组件
 * 处理博客文章的展示逻辑
 */
export const BlogPostPageContainer = ({
	slug,
	content,
	frontmatter,
	headings,
	relatedPosts,
	latestPosts,
	allTags,
	allCategories,
}: BlogPostPageProps) => {
	// 标题从 frontmatter 获取（提供 slug 作为后备）
	const title = frontmatter.title ?? slug.join("/");
	const date = frontmatter.date
		? new Date(frontmatter.date).toLocaleDateString("zh-CN", {
				year: "numeric",
				month: "long",
				day: "numeric",
			})
		: undefined;

	// 获取当前文章的所有标签
	const currentTags = frontmatter.tags || [];

	// 左侧边栏内容（包含原来右侧边栏的内容）
	const leftSidebar = (
		<>
			<BlogCategoryCard
				categories={allCategories}
				selectedCategory={frontmatter.category}
				enableRouting
				showHeader={false}
			/>
			<TagCloudCard
				allTags={allTags}
				selectedTags={currentTags}
				useDefaultRouting
			/>
			<TableOfContents headings={headings} className="prose-sm" />
			<RelatedPostsCard posts={relatedPosts} currentSlug={slug.slice(1)} />
			<LatestPostsCard posts={latestPosts} currentSlug={slug.slice(1)} />
		</>
	);

	// 右侧边栏内容（现在为空）
	const _rightSidebar = null; // 保留变量但添加下划线前缀以避免未使用警告

	return (
		<div className="min-h-screen bg-background">
			<div className="container mx-auto px-4 py-4">
				<div className="pb-8">
					<div className="grid grid-cols-12 gap-4 sm:gap-6">
						{/* 左侧空列 - 占2列，只在xl和2xl断点下显示 */}
						<div className="hidden xl:col-span-2 xl:block"></div>

						{/* 主内容区域 - 在小屏幕上占12列，在xl及以上占8列 */}
						<div className="col-span-12 xl:col-span-8">
							<div className="grid grid-cols-12 gap-4 sm:gap-6">
								{/* Sidebar - 占3列 */}
								<div className="col-span-12 md:col-span-3 lg:col-span-3 xl:col-span-3">
									<SidebarWrapper
										config={{
											sticky: true,
											stickyTop: "80px",
											responsive: {
												hideOnMobile: true,
												hideOnTablet: false,
												hideOnDesktop: false,
											},
										}}
									>
										<div className="space-y-6">{leftSidebar}</div>
									</SidebarWrapper>
								</div>

								{/* 文章内容区域 - 占9列 */}
								<div className="col-span-12 md:col-span-9 lg:col-span-9 xl:col-span-9">
									<article
										className={cn(
											"prose-container",
											// 添加卡片样式，与博客列表页的文章卡片保持一致
											"rounded-lg border bg-card text-card-foreground shadow-sm",
											// 响应式内边距，与博客卡片保持一致
											"p-3 sm:p-4 md:p-5 lg:p-6",
										)}
									>
										<header className="mb-8">
											<h1 className="mb-8 font-bold text-2xl tracking-tight sm:text-2xl">
												{title}
											</h1>
											{/* 使用 PostMeta 组件显示文章元数据 */}
											<PostMeta date={date} wordCount={content.length} />
										</header>

										<div className="prose prose-sm prose-zinc dark:prose-invert max-w-none prose-img:rounded-xl">
											<ClientMDXRenderer content={content} />
										</div>
									</article>
								</div>
							</div>
						</div>

						{/* 右侧空列 - 占2列，只在xl和2xl断点下显示 */}
						<div className="hidden xl:col-span-2 xl:block"></div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default BlogPostPageContainer;
