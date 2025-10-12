/**
 * 搜索状态管理 React Hook
 * 集成 Zustand 状态管理
 */

import { useCallback, useEffect, useState } from "react";
import { getSearchSuggestions, performSearch } from "@/components/search/search-engine";
import type { SearchOptions, SearchResult } from "@/components/search/search-types";
import { useSearchStore } from "./search-store";

interface UseSearchStateReturn {
  search: (query: string, options?: SearchOptions) => Promise<void>;
  results: SearchResult[];
  isLoading: boolean;
  error: string | null;
  query: string;
  suggestions: string[];
  getSuggestions: (query: string) => Promise<void>;
  // Zustand 状态
  searchTerm: string;
  selectedCategory: string;
  setSearchTerm: (term: string) => void;
  setSelectedCategory: (category: string) => void;
  resetSearch: () => void;
}

export function useSearchState(): UseSearchStateReturn {
  // 使用 Zustand 管理搜索状态
  const { searchTerm, selectedCategory, setSearchTerm, setSelectedCategory, resetState } =
    useSearchStore();

  // 本地状态管理搜索结果和加载状态
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // 当 Zustand 中的搜索词改变时，更新本地查询状态
  useEffect(() => {
    setQuery(searchTerm);
  }, [searchTerm]);

  const search = useCallback(
    async (searchQuery: string, options?: SearchOptions): Promise<void> => {
      // 更新 Zustand 状态
      setSearchTerm(searchQuery);

      setIsLoading(true);
      setError(null);
      setQuery(searchQuery);

      try {
        const response = await performSearch(searchQuery, options);
        setResults(response.results);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "搜索失败";
        setError(errorMessage);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    },
    [setSearchTerm]
  );

  const getSuggestions = useCallback(async (searchQuery: string): Promise<void> => {
    try {
      const suggestionList = await getSearchSuggestions(searchQuery);
      setSuggestions(suggestionList);
    } catch (err) {
      console.error("获取建议失败:", err);
      setSuggestions([]);
    }
  }, []);

  // 清理建议当查询为空时
  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
    }
  }, [query]);

  return {
    search,
    results,
    isLoading,
    error,
    query,
    suggestions,
    getSuggestions,
    // Zustand 状态和动作
    searchTerm,
    selectedCategory,
    setSearchTerm,
    setSelectedCategory,
    resetSearch: resetState,
  };
}
