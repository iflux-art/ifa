"use client";

/**
 * 搜索状态管理 React Hook
 * 使用本地搜索，无需 API 调用
 */

import { useCallback, useEffect, useState } from "react";
import {
	performLocalSearch,
	preloadSearchIndex,
} from "@/components/features/search/local-search-engine";
import type { SearchResult } from "@/components/features/search/search-types";

interface UseSearchStateReturn {
	/** 执行搜索 */
	search: (query: string) => Promise<void>;
	/** 搜索结果 */
	results: SearchResult[];
	/** 是否正在加载 */
	isLoading: boolean;
	/** 是否正在加载索引 */
	isIndexLoading: boolean;
	/** 错误信息 */
	error: string | null;
	/** 当前搜索词 */
	query: string;
	/** 设置搜索词 */
	setQuery: (query: string) => void;
	/** 重置搜索 */
	resetSearch: () => void;
}

export function useSearchState(): UseSearchStateReturn {
	const [query, setQuery] = useState("");
	const [results, setResults] = useState<SearchResult[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [isIndexLoading, setIsIndexLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// 组件挂载时预加载索引
	useEffect(() => {
		const loadIndex = async () => {
			try {
				setIsIndexLoading(true);
				// 预加载索引
				preloadSearchIndex();
				// 等待一小段时间确保索引开始加载
				await new Promise((resolve) => setTimeout(resolve, 100));
			} catch (err) {
				console.error("Failed to preload search index:", err);
			} finally {
				setIsIndexLoading(false);
			}
		};

		loadIndex();
	}, []);

	const search = useCallback(async (searchQuery: string): Promise<void> => {
		if (!searchQuery.trim()) {
			setResults([]);
			return;
		}

		setIsLoading(true);
		setError(null);

		try {
			const searchResults = await performLocalSearch(searchQuery, 15);
			setResults(searchResults);
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : "搜索失败";
			setError(errorMessage);
			setResults([]);
		} finally {
			setIsLoading(false);
		}
	}, []);

	const resetSearch = useCallback(() => {
		setQuery("");
		setResults([]);
		setIsLoading(false);
		setError(null);
	}, []);

	return {
		search,
		results,
		isLoading,
		isIndexLoading,
		error,
		query,
		setQuery,
		resetSearch,
	};
}
