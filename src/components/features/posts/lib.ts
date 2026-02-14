/**
 * 博客相关工具函数
 */
export { getBlogContent } from "./blog-content";

// 从client-utils重新导出客户端安全的函数
export {
	calculateReadingTime,
	createBlogBreadcrumbs,
	debounce,
	extractHeadings,
	formatDate,
	formatNumber,
	generateBreadcrumbs,
	groupByCategory,
	groupByTag,
	sortContent,
	type TocHeading,
	throttle,
} from "./client-utils";

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { BlogPost } from "./blog-types";

// ==================== 博客相关函数 ====================

// 检查文件是否为Markdown文件
function isMarkdownFile(fileName: string): boolean {
	return fileName.endsWith(".mdx") || fileName.endsWith(".md");
}

// 生成文章slug
function generateBlogSlug(itemPath: string, blogDir: string): string {
	const pathParts =
		itemPath.split(blogDir)[1]?.split(path.sep).filter(Boolean) ?? [];

	if (pathParts.length === 1) {
		// 直接在blog目录下的文件
		// 修复：添加空值检查
		return (pathParts[0] ?? "").replace(/\.(mdx|md)$/, "");
	} else {
		// 在子目录中的文件
		const fileName = pathParts.pop() ?? "";
		return `${pathParts.join("/")}/${fileName.replace(/\.(mdx|md)$/, "")}`;
	}
}

// 创建BlogPost对象
function createBlogPost(data: Record<string, unknown>, slug: string): BlogPost {
	return {
		id: slug, // 使用slug作为默认ID
		slug,
		title: (data.title ?? slug) as string,
		description: (data.description ?? data.excerpt ?? "点击阅读全文") as string,
		excerpt: (data.excerpt ?? "点击阅读全文") as string,
		date: String(data.date),
		tags: (data.tags ?? []) as string[],
	} satisfies BlogPost;
}

// 处理单个文件的函数
function processFile(
	itemPath: string,
	blogDir: string,
	posts: BlogPost[],
): void {
	const fileContent = fs.readFileSync(itemPath, "utf8");
	const { data } = matter(fileContent);

	// 只包含已发布的文章
	if (data.published !== false) {
		const slug = generateBlogSlug(itemPath, blogDir);

		posts.push({
			id: slug, // 使用slug作为默认ID
			slug,
			title: (data.title as string) ?? slug,
			description: (data.description as string) ?? "暂无描述",
			excerpt: (data.excerpt as string) ?? "点击阅读全文",
			date: String(data.date),
			image: data.cover as string | undefined,
			tags: (data.tags as string[]) ?? [],
			category: (data.category as string) ?? "未分类",
		});
	}
}

/**
 * 递归函数来查找所有博客文件
 */
function _findPosts(dir: string, blogDir: string, posts: BlogPost[]): void {
	const items = fs.readdirSync(dir, { withFileTypes: true });

	for (const item of items) {
		const itemPath = path.join(dir, item.name);

		if (item.isDirectory()) {
			_findPosts(itemPath, blogDir, posts);
		} else if (item.isFile() && isMarkdownFile(item.name)) {
			processFile(itemPath, blogDir, posts);
		}
	}
}

/**
 * 对文章按日期排序
 */
function _sortPostsByDate(posts: BlogPost[]): BlogPost[] {
	return posts.sort((a, b) => {
		if (a.date && b.date) {
			return new Date(b.date).getTime() - new Date(a.date).getTime();
		}
		return 0;
	});
}

/**
 * 博客缓存数据结构
 * 用于存储一次性获取的所有博客元数据，避免重复读取文件
 */
interface BlogCache {
	posts: BlogPost[];
	postsByYear: Record<string, BlogPost[]>;
	tagCounts: Record<string, number>;
	categoryCounts: Record<string, number>;
	allTags: { name: string; count: number }[];
	allCategories: { name: string; count: number }[];
	lastUpdated: number;
}

// 内存缓存，5分钟内有效
let blogCache: BlogCache | null = null;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * 扫描所有博客文件
 */
function scanBlogFiles(dir: string): string[] {
	const files: string[] = [];
	const scanDirectory = (scanDir: string) => {
		const items = fs.readdirSync(scanDir, { withFileTypes: true });
		items.forEach((item) => {
			const itemPath = path.join(scanDir, item.name);
			if (item.isDirectory()) {
				scanDirectory(itemPath);
			} else if (
				item.isFile() &&
				(item.name.endsWith(".mdx") ||
					item.name.endsWith(".md") ||
					item.name.endsWith(".md"))
			) {
				files.push(itemPath);
			}
		});
	};
	scanDirectory(dir);
	return files;
}

/**
 * 从文件创建 BlogPost
 */
function createPostFromFile(
	filePath: string,
	blogDir: string,
): BlogPost | null {
	const fileContent = fs.readFileSync(filePath, "utf8");
	const { data } = matter(fileContent);

	// 只包含已发布的文章
	if (data.published === false) {
		return null;
	}

	const relativePath = path.relative(blogDir, filePath);
	const slug = relativePath
		.replace(/\.(mdx|md)$/, "")
		.replace(/\\/g, "/")
		.split("/");

	return {
		id: slug.join("/"),
		slug: slug.join("/"),
		title: (data.title as string) ?? slug.join("/"),
		description:
			(data.description as string) ?? (data.excerpt as string) ?? "暂无描述",
		excerpt: (data.excerpt as string) ?? "点击阅读全文",
		date: String(data.date),
		image: data.cover as string | undefined,
		tags: (data.tags as string[]) ?? [],
		category: (data.category as string) ?? "未分类",
	};
}

/**
 * 获取统一的博客缓存数据
 * 一次性获取所有博客元数据，避免重复读取文件
 * @exported 供其他模块使用
 */
export function getBlogCache(): BlogCache {
	const now = Date.now();

	// 检查缓存是否有效
	if (blogCache && now - blogCache.lastUpdated < CACHE_TTL) {
		return blogCache;
	}

	const blogDir = path.join(process.cwd(), "src", "content");
	if (!fs.existsSync(blogDir)) {
		const emptyCache: BlogCache = {
			posts: [],
			postsByYear: {},
			tagCounts: {},
			categoryCounts: {},
			allTags: [],
			allCategories: [],
			lastUpdated: now,
		};
		blogCache = emptyCache;
		return emptyCache;
	}

	// 扫描所有文件
	const files = scanBlogFiles(blogDir);
	const posts: BlogPost[] = [];
	const tagCounts: Record<string, number> = {};
	const categoryCounts: Record<string, number> = {};

	// 一次性遍历所有文件
	for (const filePath of files) {
		const post = createPostFromFile(filePath, blogDir);
		if (post) {
			posts.push(post);

			// 统计分类
			if (post.category) {
				categoryCounts[post.category] =
					(categoryCounts[post.category] || 0) + 1;
			}

			// 统计标签
			if (post.tags) {
				for (const tag of post.tags) {
					tagCounts[tag] = (tagCounts[tag] || 0) + 1;
				}
			}
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

	// 排序年份内的文章
	Object.keys(postsByYear).forEach((year) => {
		postsByYear[year].sort((a, b) => {
			if (a.date && b.date) {
				return new Date(b.date).getTime() - new Date(a.date).getTime();
			}
			return 0;
		});
	});

	// 构建标签和分类数组
	const allTags = Object.entries(tagCounts)
		.map(([name, count]) => ({ name, count }))
		.sort((a, b) => b.count - a.count);

	const allCategories = Object.entries(categoryCounts)
		.map(([name, count]) => ({ name, count }))
		.sort((a, b) => b.count - a.count);

	const cache: BlogCache = {
		posts,
		postsByYear,
		tagCounts,
		categoryCounts,
		allTags,
		allCategories,
		lastUpdated: now,
	};

	blogCache = cache;
	return cache;
}

/**
 * 清除博客缓存
 * 用于开发模式下强制刷新缓存
 */
export function clearBlogCache(): void {
	blogCache = null;
}

/**
 * 获取所有博客文章（使用缓存）
 * @returns 所有博客文章数组
 */
export function getAllPosts(): BlogPost[] {
	return getBlogCache().posts;
}

// 处理文件收集标签
function collectTagsFromFile(itemPath: string, allTags: Set<string>): void {
	const fileContent = fs.readFileSync(itemPath, "utf8");
	const { data } = matter(fileContent);

	// 只收集已发布文章的标签
	if (data.published !== false && data.tags && Array.isArray(data.tags)) {
		for (const tag of data.tags) {
			allTags.add(tag);
		}
	}
}

/**
 * 获取所有标签
 * @returns 所有标签数组
 */
export function getAllTags(): string[] {
	const blogDir = path.join(process.cwd(), "src", "content");
	if (!fs.existsSync(blogDir)) return [];

	const allTags = new Set<string>();

	// 递归函数来查找所有博客文件和标签
	const findTagsInFiles = (dir: string) => {
		const items = fs.readdirSync(dir, { withFileTypes: true });

		for (const item of items) {
			const itemPath = path.join(dir, item.name);

			if (item.isDirectory()) {
				findTagsInFiles(itemPath);
			} else if (item.isFile() && isMarkdownFile(item.name)) {
				collectTagsFromFile(itemPath, allTags);
			}
		}
	};

	findTagsInFiles(blogDir);
	return Array.from(allTags).sort();
}

// 处理文件计数标签
function _countTagsFromFile(
	itemPath: string,
	tagCounts: Record<string, number>,
): void {
	const fileContent = fs.readFileSync(itemPath, "utf8");
	const { data } = matter(fileContent);

	// 只收集已发布文章的标签
	if (data.published !== false && data.tags && Array.isArray(data.tags)) {
		for (const tag of data.tags) {
			tagCounts[tag] = (tagCounts[tag] || 0) + 1;
		}
	}
}

/**
 * 获取所有标签及其文章数量（使用缓存）
 * @returns 标签及其文章数量的记录
 */
export function getAllTagsWithCount(): Record<string, number> {
	return getBlogCache().tagCounts;
}

// 检查文章是否包含指定标签
function hasTag(data: Record<string, unknown>, tag: string): boolean {
	// 检查文章是否已发布（默认为true，除非明确设置为false）
	const isPublished = data.published !== false;
	const hasTags = data.tags && Array.isArray(data.tags);
	const includesTag = hasTags && (data.tags as string[]).includes(tag);

	return Boolean(isPublished && hasTags && includesTag);
}

// 处理单个文件的函数
function processPostFile(
	itemPath: string,
	blogDir: string,
	tag: string,
	posts: BlogPost[],
): void {
	const fileContent = fs.readFileSync(itemPath, "utf8");
	const { data } = matter(fileContent);

	if (hasTag(data, tag)) {
		const slug = generateBlogSlug(itemPath, blogDir);
		const post = createBlogPost(data, slug);
		posts.push(post);
	}
}

/**
 * 根据标签获取文章
 * @param tag 标签
 * @returns 文章数组
 */
export function getPostsByTag(tag: string): BlogPost[] {
	const blogDir = path.join(process.cwd(), "src", "content");
	if (!fs.existsSync(blogDir)) return [];

	const posts: BlogPost[] = [];

	// 递归函数来查找所有博客文件
	const findPostsWithTag = (dir: string) => {
		const items = fs.readdirSync(dir, { withFileTypes: true });

		for (const item of items) {
			const itemPath = path.join(dir, item.name);

			if (item.isDirectory()) {
				findPostsWithTag(itemPath);
			} else if (item.isFile() && isMarkdownFile(item.name)) {
				processPostFile(itemPath, blogDir, tag, posts);
			}
		}
	};

	findPostsWithTag(blogDir);

	// 按日期排序
	return posts.sort((a, b) => {
		if (a.date && b.date) {
			return new Date(b.date).getTime() - new Date(a.date).getTime();
		}
		return 0;
	});
}

/**
 * 检查文件是否为Markdown文件
 */
const isMarkdownFileForTimeline = (fileName: string): boolean =>
	fileName.endsWith(".mdx") || fileName.endsWith(".md");

/**
 * 生成完整slug的函数
 */
const generateFullSlug = (itemPath: string, blogDir: string): string => {
	const slug = path.basename(itemPath).replace(/\.(mdx|md)$/, "");
	const relativeDir = path.relative(blogDir, path.dirname(itemPath));
	return relativeDir ? `${relativeDir}/${slug}`.replace(/\\/g, "/") : slug;
};

/**
 * 创建BlogPost对象的函数
 */
const createBlogPostForTimeline = (
	itemPath: string,
	data: Record<string, unknown>,
	blogDir: string,
): BlogPost => {
	const slug = path.basename(itemPath).replace(/\.(mdx|md)$/, "");
	const fullSlug = generateFullSlug(itemPath, blogDir);

	return {
		id: fullSlug, // 使用fullSlug作为ID
		slug: fullSlug,
		title: (data.title as string) ?? slug,
		date: String(data.date),
		description: (data.description as string) ?? (data.excerpt as string) ?? "",
		excerpt: (data.excerpt as string) ?? "",
		tags: (data.tags as string[]) ?? [],
		author: (data.author as string) ?? "",
		authorAvatar: (data.authorAvatar as string) ?? null,
		authorBio: (data.authorBio as string) ?? "",
		published: (data.published as boolean) ?? true,
	};
};

/**
 * 处理单个文件的函数
 */
const processFileForTimeline = (
	itemPath: string,
	blogDir: string,
	postsByYear: Record<string, BlogPost[]>,
): void => {
	const fileContent = fs.readFileSync(itemPath, "utf8");
	const { data } = matter(fileContent);

	// 确保文章有日期且已发布
	if (data.date && data.published !== false) {
		const date = new Date(data.date as string | number | Date);
		const year = date.getFullYear().toString();

		// 创建年份分组（如果不存在）
		if (!postsByYear[year]) {
			postsByYear[year] = [];
		}

		// 添加文章到对应年份
		const post = createBlogPostForTimeline(itemPath, data, blogDir);
		postsByYear[year].push(post);
	}
};

/**
 * 递归函数来查找所有博客文件
 */
const _findPostsInDirectory = (
	dir: string,
	blogDir: string,
	postsByYear: Record<string, BlogPost[]>,
): void => {
	const items = fs.readdirSync(dir, { withFileTypes: true });

	for (const item of items) {
		const itemPath = path.join(dir, item.name);

		if (item.isDirectory()) {
			_findPostsInDirectory(itemPath, blogDir, postsByYear);
		} else if (item.isFile() && isMarkdownFileForTimeline(item.name)) {
			processFileForTimeline(itemPath, blogDir, postsByYear);
		}
	}
};

/**
 * 对文章按年份和日期排序
 */
const _sortPostsByYear = (postsByYear: Record<string, BlogPost[]>): void => {
	Object.keys(postsByYear).forEach((year) => {
		// 修复：添加类型检查以确保 postsByYear[year] 存在
		const posts = postsByYear[year];
		if (posts) {
			posts.sort(
				(a, b) =>
					new Date(b.date ?? "").getTime() - new Date(a.date ?? "").getTime(),
			);
		}
	});
};

/**
 * 获取所有博客文章并按年份分组（使用缓存）
 */
export function getPostsByYear(): Record<string, BlogPost[]> {
	return getBlogCache().postsByYear;
}
