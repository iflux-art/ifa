import type { Metadata } from "next";
import {
	getAllPosts,
	getAllTagsWithCount,
} from "@/components/features/posts/lib";
import { BlogPageContainer } from "@/components/layout/blog-page";

export const metadata: Metadata = {
	title: "博客",
};

/**
 * ISR: 每小时重新验证一次
 */
export const revalidate = 3600;

// 服务端获取所有需要的数据
async function getBlogPageData() {
	try {
		// 获取所有文章
		const allPosts = await getAllPosts();

		// 获取所有标签及其计数
		const tagsWithCount = await getAllTagsWithCount();
		const allTags = Object.entries(tagsWithCount)
			.map(([name, count]) => ({ name, count }))
			.sort((a, b) => b.count - a.count);

		// 获取所有分类及其计数
		const allCategories: Record<string, number> = {};
		allPosts.forEach((post) => {
			if (post.category) {
				allCategories[post.category] = (allCategories[post.category] || 0) + 1;
			}
		});
		const categories = Object.entries(allCategories)
			.map(([name, count]) => ({ name, count }))
			.sort((a, b) => b.count - a.count);

		// 获取最新文章（前5篇）
		const latestPosts = allPosts
			.filter((post) => post.date)
			.sort((a, b) => {
				// 安全地处理日期，避免非空断言
				const dateA = a.date ? new Date(a.date).getTime() : 0;
				const dateB = b.date ? new Date(b.date).getTime() : 0;
				return dateB - dateA;
			})
			.slice(0, 5)
			.map((post) => ({
				title: post.title ?? post.slug,
				href: `/posts/${post.slug}`,
				date: post.date,
				category: post.category,
			}));

		return {
			allPosts,
			allTags,
			categories,
			latestPosts,
		};
	} catch (error) {
		console.error("获取博客页面数据失败:", error);
		return {
			allPosts: [],
			allTags: [],
			categories: [],
			latestPosts: [],
		};
	}
}

export default async function Home() {
	const { allPosts, allTags, categories } = await getBlogPageData();

	return (
		<BlogPageContainer
			initialPosts={allPosts}
			allTags={allTags}
			categories={categories}
		/>
	);
}
