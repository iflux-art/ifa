import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { BlogPost } from "@/components/features/posts/blog-types";
import { getBlogCache } from "@/components/features/posts/lib";

export interface BlogFrontmatter {
	/** 文章标题 */
	title: string;
	/** 文章描述 */
	description?: string;
	/** 文章分类 */
	category?: string;
	/** 文章标签 */
	tags?: string[];
	/** 文章创建日期 */
	date?: string;
	/** 文章更新日期 */
	update?: string;
	/** 文章作者 */
	author?: string;
	/** 文章封面图片 */
	cover?: string;
	/** 文章状态 */
	status?: "draft" | "published" | "archived";
	/** 文章访问权限 */
	access?: "public" | "private" | "protected";
	/** 允许任意其他属性 */
	[key: string]: unknown;
}

export function getBlogContent(slug: string[]): {
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
} {
	const filePath = findBlogFile(slug);
	if (!filePath) {
		throw new Error(
			`未找到博客: ${slug.join("/")}. 请求的博客文章不存在或已被删除。`,
		);
	}
	const fileContent = fs.readFileSync(filePath, "utf8");
	const { content, data } = matter(fileContent);
	const safeFrontmatter = data as BlogFrontmatter;
	const headings = extractHeadingsFromContent(content);

	// 使用统一的缓存数据
	const cache = getBlogCache();
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
 * 从内容中提取标题（内联函数，避免循环依赖）
 * 处理 Markdown 链接格式 [文本](url)
 */
function extractHeadingsFromContent(
	content: string,
): { level: number; text: string; id: string }[] {
	const headings: { level: number; text: string; id: string }[] = [];
	const lines = content.split("\n");

	for (const line of lines) {
		const match = line.match(/^(#{1,6})\s+(.+)$/);
		if (match) {
			const level = match[1].length;
			let text = match[2].trim();

			// 处理 Markdown 链接格式 [文本](url) -> 提取文本
			text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");

			// 生成 ID
			const id = text
				.toLowerCase()
				.replace(/[^\u4e00-\u9fa5a-z0-9]+/g, "-")
				.replace(/^-+|-+$/g, "");
			headings.push({ level, text, id });
		}
	}

	return headings;
}

function findBlogFile(slug: string[]): string | null {
	const blogDir = path.join(process.cwd(), "src", "content");
	const relativePath = path.join(...slug);

	// 检查直接文件匹配
	const mdxPath = path.join(blogDir, `${relativePath}.mdx`);
	if (fs.existsSync(mdxPath)) {
		return mdxPath;
	}

	const mdPath = path.join(blogDir, `${relativePath}.md`);
	if (fs.existsSync(mdPath)) {
		return mdPath;
	}

	// 检查目录中的索引文件
	const indexMdx = path.join(blogDir, relativePath, "index.mdx");
	if (fs.existsSync(indexMdx)) {
		return indexMdx;
	}

	const indexMd = path.join(blogDir, relativePath, "index.md");
	if (fs.existsSync(indexMd)) {
		return indexMd;
	}

	return null;
}

export function getAllBlogMeta(): {
	slug: string[];
	frontmatter: BlogFrontmatter;
}[] {
	const blogDir = path.join(process.cwd(), "src", "content");
	if (!fs.existsSync(blogDir)) {
		return [];
	}

	const files: string[] = [];

	const scanDirectory = (dir: string) => {
		const items = fs.readdirSync(dir, { withFileTypes: true });
		items.forEach((item) => {
			const itemPath = path.join(dir, item.name);
			if (item.isDirectory()) {
				scanDirectory(itemPath);
			} else if (
				item.isFile() &&
				(item.name.endsWith(".mdx") || item.name.endsWith(".md"))
			) {
				files.push(itemPath);
			}
		});
	};

	scanDirectory(blogDir);

	return files.map((filePath) => {
		const fileContent = fs.readFileSync(filePath, "utf8");
		const { data } = matter(fileContent);
		const relativePath = path.relative(blogDir, filePath);
		const slug = relativePath
			.replace(/\.(mdx|md)$/, "")
			.replace(/\\/g, "/")
			.split("/");

		return {
			slug,
			frontmatter: data as BlogFrontmatter,
		};
	});
}
