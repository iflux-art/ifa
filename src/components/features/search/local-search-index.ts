/**
 * 本地搜索索引生成器
 * 在构建时生成搜索索引，供客户端使用
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import { glob } from "fast-glob";
import matter from "gray-matter";
import type { SearchIndexItem } from "./search-types";

const CONTENT_DIR = path.join(process.cwd(), "src", "content");

/**
 * 从内容中提取标题
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

/**
 * 清理内容，移除 Markdown 语法
 */
function cleanContent(content: string): string {
	let cleaned = content;

	// 移除 frontmatter
	cleaned = cleaned.replace(/^---[\s\S]*?---/, "");

	// 移除代码块
	cleaned = cleaned.replace(/```[\s\S]*?```/g, "");

	// 移除行内代码
	cleaned = cleaned.replace(/`[^`]+`/g, "");

	// 移除链接但保留文本
	cleaned = cleaned.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");

	// 移除图片
	cleaned = cleaned.replace(/!\[([^\]]*)\]\([^)]+\)/g, "");

	// 移除 HTML 标签
	cleaned = cleaned.replace(/<[^>]+>/g, "");

	// 移除 Markdown 标题符号
	cleaned = cleaned.replace(/^#+\s+/gm, "");

	// 移除 Markdown 列表符号
	cleaned = cleaned.replace(/^[\s]*[-*+]\s+/gm, "");
	cleaned = cleaned.replace(/^[\s]*\d+\.\s+/gm, "");

	// 移除引用符号
	cleaned = cleaned.replace(/^>\s+/gm, "");

	// 移除加粗和斜体
	cleaned = cleaned.replace(/[*_]{1,3}([^*_]+)[*_]{1,3}/g, "$1");

	// 移除多余空白
	cleaned = cleaned.replace(/\s+/g, " ").trim();

	return cleaned;
}

/**
 * 扫描单个内容文件
 */
async function scanContentFile(
	filePath: string,
	contentType: string,
): Promise<SearchIndexItem | null> {
	try {
		const content = await fs.readFile(filePath, "utf-8");
		const { data: frontmatter, content: body } = matter(content);

		if (!frontmatter?.title || typeof frontmatter.title !== "string") {
			return null;
		}

		// 计算相对路径
		const relativePath = path.relative(
			path.join(CONTENT_DIR, contentType),
			filePath,
		);
		const slug = relativePath.replace(/\.mdx?$/, "");

		// 提取标题
		const headings = extractHeadingsFromContent(body);

		// 清理内容用于搜索
		const cleanedContent = cleanContent(body);

		return {
			title: frontmatter.title,
			description:
				typeof frontmatter.description === "string"
					? frontmatter.description
					: undefined,
			path: `/posts/${contentType}/${slug}`,
			category:
				typeof frontmatter.category === "string"
					? frontmatter.category
					: contentType,
			tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : undefined,
			content: cleanedContent,
			headings,
		};
	} catch (error) {
		console.error(`Error scanning file ${filePath}:`, error);
		return null;
	}
}

/**
 * 扫描指定类型的内容目录
 */
async function scanContentType(
	contentType: string,
): Promise<SearchIndexItem[]> {
	const basePath = path.join(CONTENT_DIR, contentType);

	try {
		await fs.access(basePath);
	} catch {
		return [];
	}

	const files = await glob("**/*.mdx", { cwd: basePath });
	const results: SearchIndexItem[] = [];

	for (const file of files) {
		const filePath = path.join(basePath, file);
		const item = await scanContentFile(filePath, contentType);
		if (item) {
			results.push(item);
		}
	}

	return results;
}

/**
 * 获取内容目录中所有子目录名称
 */
async function getContentDirectories(): Promise<string[]> {
	try {
		const entries = await fs.readdir(CONTENT_DIR, { withFileTypes: true });
		return entries
			.filter((entry) => entry.isDirectory() && !entry.name.startsWith("."))
			.map((entry) => entry.name);
	} catch {
		return [];
	}
}

/**
 * 生成完整的搜索索引
 */
export async function generateSearchIndex(): Promise<SearchIndexItem[]> {
	// 动态获取内容目录中的所有子目录
	const contentTypes = await getContentDirectories();

	const allItems: SearchIndexItem[] = [];

	for (const contentType of contentTypes) {
		const items = await scanContentType(contentType);
		allItems.push(...items);
	}

	return allItems;
}

/**
 * 搜索索引缓存
 */
let cachedIndex: SearchIndexItem[] | null = null;

/**
 * 获取搜索索引 (带缓存)
 */
export async function getSearchIndex(): Promise<SearchIndexItem[]> {
	if (cachedIndex) {
		return cachedIndex;
	}

	cachedIndex = await generateSearchIndex();
	return cachedIndex;
}

/**
 * 清除缓存
 */
export function clearSearchIndexCache(): void {
	cachedIndex = null;
}
