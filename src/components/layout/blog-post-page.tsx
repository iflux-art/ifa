"use client";

import type { BlogFrontmatter } from "@/components/features/posts/blog-content";
import { PostMeta } from "@/components/features/posts/post-meta";
import { BlogCategoryCard } from "@/components/features/sidebar/blog-category-card";
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
			/>
			<TagCloudCard
				allTags={allTags}
				selectedTags={currentTags}
				useDefaultRouting
			/>
			<TableOfContents headings={headings} className="prose-sm" />
			<RelatedPostsCard posts={relatedPosts} currentSlug={slug.slice(1)} />
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
											<h1 className="mb-4 font-bold text-2xl tracking-tight sm:text-2xl">
												{title}
											</h1>
											<PostMeta date={date} wordCount={content.length} />
										</header>

										<div className="prose prose-sm prose-zinc dark:prose-invert max-w-none prose-img:rounded-xl">
											<ClientMDXRenderer content={content} />
										</div>
									</article>

									{/* 版权声明卡片 */}
									<div className="mt-6 rounded-lg border bg-card p-4 text-card-foreground shadow-sm transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 sm:p-5 lg:p-6">
										<div className="flex flex-col gap-3">
											<div className="flex items-center gap-2">
												<div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
													<svg
														viewBox="0 0 24 24"
														className="h-4 w-4 text-primary"
														fill="none"
														stroke="currentColor"
														strokeWidth="2"
														role="img"
														aria-hidden="true"
													>
														<circle cx="12" cy="12" r="10" />
														<path d="M12 6v6l4 2" />
													</svg>
												</div>
												<span className="font-medium text-sm">版权声明</span>
											</div>
											<div className="space-y-2 text-muted-foreground text-sm">
												<p>本文为作者原创文章，遵循 CC BY-NC-ND 4.0 协议。</p>
												<ul className="list-inside list-disc space-y-1 pl-1">
													<li>
														<span className="text-foreground">署名</span>
														：转载时请注明出处
													</li>
													<li>
														<span className="text-foreground">
															非商业性使用
														</span>
														：禁止商业用途
													</li>
													<li>
														<span className="text-foreground">禁止演绎</span>
														：不得修改原文
													</li>
												</ul>
											</div>
											<a
												href="https://creativecommons.org/licenses/by-nc-nd/4.0/"
												target="_blank"
												rel="noopener noreferrer"
												className="group relative inline-flex items-center gap-1 text-primary text-sm"
											>
												<span className="relative">
													查看完整许可证
													<span className="absolute bottom-0 left-0 h-[1px] w-0 bg-primary transition-all duration-300 group-hover:w-full" />
												</span>
												<svg
													className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5"
													fill="none"
													viewBox="0 0 24 24"
													stroke="currentColor"
													strokeWidth="2"
													role="img"
													aria-hidden="true"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
													/>
												</svg>
											</a>
										</div>
									</div>
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
