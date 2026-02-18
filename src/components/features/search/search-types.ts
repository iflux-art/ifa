/**
 * 搜索相关类型定义
 */

export interface SearchIndexItem {
	/** 文章标题 */
	title: string;
	/** 文章描述 */
	description?: string;
	/** 文章路径 (如 /posts/dev/publish-packages-to-npm) */
	path: string;
	/** 文章分类 */
	category?: string;
	/** 文章标签 */
	tags?: string[];
	/** 文章内容 (用于搜索匹配) */
	content?: string;
	/** 文章标题列表 (用于跳转定位) */
	headings?: {
		level: number;
		text: string;
		id: string;
	}[];
}

export interface SearchResult {
	type: "blog";
	title: string;
	description?: string;
	path?: string;
	tags?: string[];
	category?: string;
	/** 匹配的标题ID (用于跳转定位) */
	headingId?: string;
	/** 匹配的标题文本 */
	headingText?: string;
	/** 摘要（用于高级搜索结果） */
	excerpt?: string;
	/** 相关性评分 */
	score?: number;
}

export interface SearchOptions {
	type?: "blog";
	limit?: number;
}

export interface SearchResponse {
	results: SearchResult[];
	total: number;
	query: string;
	type: string;
}
