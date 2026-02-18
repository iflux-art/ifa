/**
 * 本地搜索引擎
 * 纯客户端搜索，无需 API 调用
 */
import type { SearchIndexItem, SearchResult } from "./search-types";

// 全局搜索索引缓存
let globalSearchIndex: SearchIndexItem[] | null = null;
let indexLoadPromise: Promise<SearchIndexItem[]> | null = null;

/**
 * 加载搜索索引
 */
async function loadSearchIndex(): Promise<SearchIndexItem[]> {
	if (globalSearchIndex) {
		return globalSearchIndex;
	}

	// 如果已经在加载中，返回同一个 Promise
	if (indexLoadPromise) {
		return indexLoadPromise;
	}

	indexLoadPromise = (async () => {
		try {
			const response = await fetch("/api/search/index");
			if (!response.ok) {
				throw new Error(`Failed to load search index: ${response.status}`);
			}
			const data = (await response.json()) as { index: SearchIndexItem[] };
			globalSearchIndex = data.index;
			return globalSearchIndex;
		} catch (error) {
			console.error("Failed to load search index:", error);
			indexLoadPromise = null;
			return [];
		}
	})();

	return indexLoadPromise;
}

/**
 * 预加载搜索索引
 */
export function preloadSearchIndex(): void {
	loadSearchIndex().catch((error) => {
		console.warn("Failed to preload search index:", error);
	});
}

/**
 * 计算匹配分数
 */
function calculateScore(
	item: SearchIndexItem,
	query: string,
	queryLower: string,
): number {
	let score = 0;

	// 标题完全匹配 - 最高分
	if (item.title === query) {
		score += 100;
	}
	// 标题开头匹配
	else if (item.title.toLowerCase().startsWith(queryLower)) {
		score += 80;
	}
	// 标题包含查询词
	else if (item.title.toLowerCase().includes(queryLower)) {
		score += 60;
	}

	// 描述包含查询词
	if (item.description?.toLowerCase().includes(queryLower)) {
		score += 30;
	}

	// 标签匹配
	if (item.tags) {
		for (const tag of item.tags) {
			if (tag.toLowerCase().includes(queryLower)) {
				score += 40;
				break;
			}
		}
	}

	// 分类匹配
	if (item.category?.toLowerCase().includes(queryLower)) {
		score += 20;
	}

	// 内容包含查询词
	if (item.content?.toLowerCase().includes(queryLower)) {
		score += 10;
	}

	return score;
}

/**
 * 查找匹配的标题
 */
function findMatchingHeading(
	item: SearchIndexItem,
	queryLower: string,
): { id: string; text: string } | null {
	if (!item.headings) {
		return null;
	}

	for (const heading of item.headings) {
		if (heading.text.toLowerCase().includes(queryLower)) {
			return { id: heading.id, text: heading.text };
		}
	}

	return null;
}

/**
 * 执行本地搜索
 */
export async function performLocalSearch(
	query: string,
	limit = 10,
): Promise<SearchResult[]> {
	if (!query.trim()) {
		return [];
	}

	const index = await loadSearchIndex();
	if (index.length === 0) {
		return [];
	}

	const queryLower = query.toLowerCase().trim();
	const results: SearchResult[] = [];

	for (const item of index) {
		const score = calculateScore(item, query, queryLower);

		if (score > 0) {
			const matchingHeading = findMatchingHeading(item, queryLower);

			results.push({
				type: "blog",
				title: item.title,
				description: item.description,
				path: matchingHeading
					? `${item.path}#${matchingHeading.id}`
					: item.path,
				tags: item.tags,
				category: item.category,
				headingId: matchingHeading?.id,
				headingText: matchingHeading?.text,
				score,
			});
		}
	}

	// 按分数排序
	results.sort((a, b) => (b.score ?? 0) - (a.score ?? 0));

	return results.slice(0, limit);
}

/**
 * 检查索引是否已加载
 */
export function isIndexLoaded(): boolean {
	return globalSearchIndex !== null;
}

/**
 * 清除索引缓存
 */
export function clearIndexCache(): void {
	globalSearchIndex = null;
	indexLoadPromise = null;
}
