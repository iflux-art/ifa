/**
 * 博客相关工具函数
 * 使用 Next.js 最佳实践
 */
export { getBlogContent } from "./blog-content";

// 从client-utils重新导出客户端安全的函数
export {
	calculateReadingTime,
	createBlogBreadcrumbs,
	debounce,
	extractHeadings,
	extractHeadingsSimple,
	formatDate,
	formatNumber,
	formatReadingTime,
	generateBreadcrumbs,
	groupByCategory,
	groupByTag,
	sortContent,
	sortPostsByDate,
	type TocHeading,
	throttle,
} from "./client-utils";

import { promises as fs } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { cache } from "react";
import { toSlug, translateBatch } from "@/lib/translation";
import type { BlogPost } from "./blog-types";

// ==================== 类型定义 ====================

interface BlogCache {
	posts: BlogPost[];
	postsByYear: Record<string, BlogPost[]>;
	tagCounts: Record<string, number>;
	categoryCounts: Record<string, number>;
	allTags: { name: string; count: number }[];
	allCategories: { name: string; count: number }[];
}

// ==================== 工具函数 ====================

const CONTENT_DIR = path.join(process.cwd(), "src", "content");

function isMarkdownFile(fileName: string): boolean {
	return fileName.endsWith(".mdx") || fileName.endsWith(".md");
}

async function scanMarkdownFiles(dir: string): Promise<string[]> {
	const files: string[] = [];
	const items = await fs.readdir(dir, { withFileTypes: true });

	for (const item of items) {
		// 跳过以点开头的目录（如 .obsidian）
		if (item.name.startsWith(".")) {
			continue;
		}
		const itemPath = path.join(dir, item.name);
		if (item.isDirectory()) {
			files.push(...(await scanMarkdownFiles(itemPath)));
		} else if (item.isFile() && isMarkdownFile(item.name)) {
			files.push(itemPath);
		}
	}
	return files;
}

function createBlogPost(
	filePath: string,
	data: Record<string, unknown>,
	blogDir: string,
	slugMap: Map<string, string>,
): BlogPost {
	const relativePath = path.relative(blogDir, filePath);
	const originalSlug = relativePath
		.replace(/\.(mdx|md)$/, "")
		.replace(/\\/g, "/")
		.split("/");

	const translatedSlug = originalSlug.map(
		(segment) => slugMap.get(segment) ?? toSlug(segment),
	);

	const slugStr = translatedSlug.join("/");

	return {
		id: slugStr,
		slug: slugStr,
		originalSlug: originalSlug.join("/"),
		title:
			(data.title as string) ??
			originalSlug[originalSlug.length - 1] ??
			originalSlug.join("/"),
		description:
			(data.description as string) ?? (data.excerpt as string) ?? "暂无描述",
		excerpt: (data.excerpt as string) ?? "点击阅读全文",
		date: String(data.date),
		image: data.cover as string | undefined,
		tags: (data.tags as string[]) ?? [],
		category: (data.category as string) ?? translatedSlug[0] ?? "uncategorized",
	};
}

// ==================== 核心缓存函数 ====================

async function buildBlogCache(): Promise<BlogCache> {
	// 检查目录是否存在
	try {
		await fs.access(CONTENT_DIR);
	} catch {
		return {
			posts: [],
			postsByYear: {},
			tagCounts: {},
			categoryCounts: {},
			allTags: [],
			allCategories: [],
		};
	}

	const files = await scanMarkdownFiles(CONTENT_DIR);
	const posts: BlogPost[] = [];
	const tagCounts: Record<string, number> = {};
	const categoryCounts: Record<string, number> = {};

	// 收集所有需要翻译的路径段
	const segmentsToTranslate = new Set<string>();
	for (const filePath of files) {
		const relativePath = path.relative(CONTENT_DIR, filePath);
		const segments = relativePath
			.replace(/\.(mdx|md)$/, "")
			.replace(/\\/g, "/")
			.split("/");
		for (const segment of segments) {
			if (segment && !/^[a-zA-Z0-9-]+$/.test(segment)) {
				segmentsToTranslate.add(segment);
			}
		}
	}

	// 批量翻译
	const slugMap = new Map<string, string>();
	if (segmentsToTranslate.size > 0) {
		const translated = await translateBatch([...segmentsToTranslate]);
		for (const [original, translatedSlug] of translated) {
			slugMap.set(original, toSlug(translatedSlug));
		}
	}

	for (const filePath of files) {
		const fileContent = await fs.readFile(filePath, "utf8");
		const { data } = matter(fileContent);

		if (data.published === false) continue;

		const post = createBlogPost(filePath, data, CONTENT_DIR, slugMap);
		posts.push(post);

		// 统计分类
		if (post.category) {
			categoryCounts[post.category] = (categoryCounts[post.category] || 0) + 1;
		}

		// 统计标签
		for (const tag of post.tags ?? []) {
			tagCounts[tag] = (tagCounts[tag] || 0) + 1;
		}
	}

	// 按日期排序
	posts.sort((a, b) => {
		if (a.date && b.date) {
			return new Date(b.date).getTime() - new Date(a.date).getTime();
		}
		return 0;
	});

	// 按年份分组
	const postsByYear: Record<string, BlogPost[]> = {};
	for (const post of posts) {
		if (post.date) {
			const year = new Date(post.date).getFullYear().toString();
			if (!postsByYear[year]) {
				postsByYear[year] = [];
			}
			postsByYear[year].push(post);
		}
	}

	// 构建标签和分类数组
	const allTags = Object.entries(tagCounts)
		.map(([name, count]) => ({ name, count }))
		.sort((a, b) => b.count - a.count);

	const allCategories = Object.entries(categoryCounts)
		.map(([name, count]) => ({ name, count }))
		.sort((a, b) => b.count - a.count);

	return {
		posts,
		postsByYear,
		tagCounts,
		categoryCounts,
		allTags,
		allCategories,
	};
}

// ==================== 导出的缓存函数 ====================

/**
 * 获取博客缓存数据（使用 React cache）
 * React cache() 提供请求级别的缓存，在同一渲染周期内避免重复调用
 * 配合页面级的 revalidate 实现 ISR
 */
export const getBlogCache = cache(
	async (): Promise<BlogCache> => buildBlogCache(),
);

/**
 * 获取所有博客文章
 */
export async function getAllPosts(): Promise<BlogPost[]> {
	const cache = await getBlogCache();
	return cache.posts;
}

/**
 * 获取所有标签及其文章数量
 */
export async function getAllTagsWithCount(): Promise<Record<string, number>> {
	const cache = await getBlogCache();
	return cache.tagCounts;
}

/**
 * 获取所有标签
 */
export async function getAllTags(): Promise<string[]> {
	const cache = await getBlogCache();
	return Object.keys(cache.tagCounts).sort();
}

/**
 * 获取按年份分组的文章
 */
export async function getPostsByYear(): Promise<Record<string, BlogPost[]>> {
	const cache = await getBlogCache();
	return cache.postsByYear;
}

/**
 * 根据标签获取文章
 */
export async function getPostsByTag(tag: string): Promise<BlogPost[]> {
	const cache = await getBlogCache();
	return cache.posts
		.filter((post) => post.tags?.includes(tag))
		.sort((a, b) => {
			if (a.date && b.date) {
				return new Date(b.date).getTime() - new Date(a.date).getTime();
			}
			return 0;
		});
}

/**
 * 清除博客缓存（用于开发模式）
 */
export function clearBlogCache(): void {
	// unstable_cache 由 Next.js 自动管理，无需手动清除
}

/**
 * 获取 slug 到 originalSlug 的映射（用于重定向）
 */
export async function getSlugRedirectMap(): Promise<Map<string, string>> {
	const cache = await getBlogCache();
	const redirectMap = new Map<string, string>();

	for (const post of cache.posts) {
		if (post.originalSlug && post.slug !== post.originalSlug) {
			redirectMap.set(post.originalSlug, post.slug);
		}
	}

	return redirectMap;
}
