/**
 * 博客内容读取
 * 使用 Next.js 最佳实践
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type {
	BlogFrontmatter,
	BlogPost,
} from "@/components/features/posts/blog-types";
import {
	extractHeadingsSimple,
	getBlogCache,
} from "@/components/features/posts/lib";

// Re-export BlogFrontmatter for backward compatibility
export type { BlogFrontmatter } from "@/components/features/posts/blog-types";

const CONTENT_DIR = path.join(process.cwd(), "src", "content");

/**
 * 查找博客文件
 */
async function findBlogFile(slug: string[]): Promise<string | null> {
	// 解码 URL 编码的 slug（支持中文文件名）
	const decodedSlug = slug.map((s) => decodeURIComponent(s));
	const relativePath = path.join(...decodedSlug);

	// 检查直接文件匹配
	const mdxPath = path.join(CONTENT_DIR, `${relativePath}.mdx`);
	try {
		await fs.access(mdxPath);
		return mdxPath;
	} catch {}

	const mdPath = path.join(CONTENT_DIR, `${relativePath}.md`);
	try {
		await fs.access(mdPath);
		return mdPath;
	} catch {}

	// 检查目录中的索引文件
	const indexMdx = path.join(CONTENT_DIR, relativePath, "index.mdx");
	try {
		await fs.access(indexMdx);
		return indexMdx;
	} catch {}

	const indexMd = path.join(CONTENT_DIR, relativePath, "index.md");
	try {
		await fs.access(indexMd);
		return indexMd;
	} catch {}

	return null;
}

/**
 * 获取博客内容
 */
export async function getBlogContent(slug: string[]): Promise<{
	slug: string[];
	content: string;
	frontmatter: BlogFrontmatter;
	headings: { level: number; text: string; id: string }[];
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
	allTags: { name: string; count: number }[];
	allCategories: { name: string; count: number }[];
}> {
	const filePath = await findBlogFile(slug);
	if (!filePath) {
		throw new Error(
			`未找到博客: ${slug.join("/")}. 请求的博客文章不存在或已被删除。`,
		);
	}

	const fileContent = await fs.readFile(filePath, "utf8");
	const { content, data } = matter(fileContent);

	// 直接使用 frontmatter 中的标题和分类
	const safeFrontmatter = data as BlogFrontmatter;

	const headings = extractHeadingsSimple(content);

	// 使用统一的缓存数据
	const cache = await getBlogCache();
	const allMeta = cache.posts;
	const currentTags = safeFrontmatter.tags ?? [];
	const currentCategory = safeFrontmatter.category;
	const currentSlugStr = slug.join("/");

	// 计算相关文章
	const candidates = allMeta.filter(
		(item: BlogPost) => item.slug !== currentSlugStr,
	);
	let related = candidates.filter((item: BlogPost) => {
		if (!item.tags) {
			return false;
		}
		return item.tags.some((tag: string) => currentTags.includes(tag));
	});

	if (related.length < 10 && currentCategory) {
		const more = candidates.filter(
			(item: BlogPost) => item.category === currentCategory,
		);
		related = related.concat(more);
	}

	if (related.length < 10) {
		const more = candidates.slice(0, 10 - related.length);
		related = related.concat(more);
	}

	const relatedPosts = related.slice(0, 10).map((item: BlogPost) => ({
		title: item.title ?? item.slug,
		href: `/posts/${item.slug}`,
		category: item.category,
		slug: item.slug.split("/"),
	}));

	// 计算最新文章 - 使用缓存中的已排序数据
	const latestPosts = cache.posts
		.filter((item: BlogPost) => item.slug !== currentSlugStr && item.date)
		.slice(0, 5)
		.map((item: BlogPost) => ({
			title: item.title ?? item.slug,
			href: `/posts/${item.slug}`,
			date: item.date,
			category: item.category,
		}));

	return {
		slug,
		content,
		frontmatter: safeFrontmatter,
		headings,
		relatedPosts,
		latestPosts,
		allTags: cache.allTags,
		allCategories: cache.allCategories,
	};
}

/**
 * 获取所有博客元数据
 */
export async function getAllBlogMeta(): Promise<
	{
		slug: string[];
		frontmatter: BlogFrontmatter;
	}[]
> {
	try {
		await fs.access(CONTENT_DIR);
	} catch {
		return [];
	}

	const files: string[] = [];

	async function scanDirectory(dir: string) {
		const items = await fs.readdir(dir, { withFileTypes: true });
		for (const item of items) {
			// 跳过以点开头的目录（如 .obsidian）
			if (item.name.startsWith(".")) {
				continue;
			}
			const itemPath = path.join(dir, item.name);
			if (item.isDirectory()) {
				await scanDirectory(itemPath);
			} else if (
				item.isFile() &&
				(item.name.endsWith(".mdx") || item.name.endsWith(".md"))
			) {
				files.push(itemPath);
			}
		}
	}

	await scanDirectory(CONTENT_DIR);

	const results = [];
	for (const filePath of files) {
		const fileContent = await fs.readFile(filePath, "utf8");
		const { data } = matter(fileContent);
		const relativePath = path.relative(CONTENT_DIR, filePath);
		const slug = relativePath
			.replace(/\.(mdx|md)$/, "")
			.replace(/\\/g, "/")
			.split("/");

		results.push({
			slug,
			frontmatter: data as BlogFrontmatter,
		});
	}

	return results;
}
