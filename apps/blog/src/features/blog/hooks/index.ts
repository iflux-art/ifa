/**
 * 博客相关钩子函数
 * @module hooks/use-blog
 */

"use client";

// 添加缺失的导入
import { useCallback, useMemo, useState } from "react";
import type {
  BlogPost,
  CategoryWithCount,
  ContentPageState,
  ContentSearchParams,
} from "@/features/blog/types";
import { API_PATHS } from "@/lib/api/api-paths";
import {
  type HookResult,
  useContentData,
} from "../../../hooks/use-content-data";

export interface TagCount {
  tag: string;
  count: number;
}

// 内联 BlogResult、UseBlogPostsResult、UseTimelinePostsResult 类型定义
export interface BlogResult<T> extends HookResult<T> {
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
}

export interface UseBlogPostsResult extends BlogResult<BlogPost[]> {
  posts: BlogPost[];
  postsCount: Record<string, number>;
  categories: CategoryWithCount[];
}

// 导出 CategoryWithCount 类型供外部使用
export type { CategoryWithCount };

export interface UseTimelinePostsResult
  extends BlogResult<Record<string, BlogPost[]>> {
  postsByYear: Record<string, BlogPost[]>;
}

/**
 * 内容搜索参数 Hook
 * @param initialParams 初始搜索参数
 * @returns 搜索参数和更新函数
 */
export function useContentSearch(
  initialParams: Partial<ContentSearchParams> = {},
) {
  const [searchParams, setSearchParams] = useState<ContentSearchParams>({
    query: "",
    limit: 10,
    type: "all",
    ...initialParams,
  });

  const updateSearch = useCallback((params: Partial<ContentSearchParams>) => {
    setSearchParams((prev) => ({ ...prev, ...params }));
  }, []);

  return {
    searchParams,
    updateSearch,
  };
}

/**
 * 内容分页状态 Hook
 * @param initialPageState 初始分页状态
 * @returns 分页状态和更新函数
 */
export function useContentPagination(
  initialPageState: Partial<ContentPageState> = {},
) {
  const [pageState, setPageState] = useState<ContentPageState>({
    page: 1,
    limit: 10,
    ...initialPageState,
  });

  const updatePage = useCallback((page: number) => {
    setPageState((prev) => ({ ...prev, page }));
  }, []);

  const updateLimit = useCallback((limit: number) => {
    setPageState((prev) => ({ ...prev, limit, page: 1 })); // 重置到第一页
  }, []);

  const resetPagination = useCallback(() => {
    setPageState({
      page: 1,
      limit: 10,
      ...initialPageState,
    });
  }, [initialPageState]);

  return {
    pageState,
    updatePage,
    updateLimit,
    resetPagination,
  };
}

/**
 * 内容筛选状态 Hook
 * @param initialFilters 初始筛选条件
 * @returns 筛选状态和更新函数
 */
export function useContentFilter(
  initialFilters: Partial<ContentPageState> = {},
) {
  const [filters, setFilters] = useState<ContentPageState>({
    page: 1,
    limit: 10,
    ...initialFilters,
  });

  const updateFilter = useCallback((filter: Partial<ContentPageState>) => {
    setFilters((prev) => ({ ...prev, ...filter }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      page: 1,
      limit: 10,
      ...initialFilters,
    });
  }, [initialFilters]);

  return {
    filters,
    updateFilter,
    clearFilters,
  };
}

/**
 * 按日期对博客文章进行排序
 */
function sortPostsByDate(posts: BlogPost[] | null | undefined) {
  if (!(posts && Array.isArray(posts))) return [];
  return [...posts].sort((a, b) => {
    // 确保 date 属性存在且是有效的
    if (a.date && b.date) {
      // 处理不同的日期格式
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);

      // 检查日期是否有效
      if (Number.isNaN(dateA.getTime()) || Number.isNaN(dateB.getTime())) {
        return 0;
      }

      return dateB.getTime() - dateA.getTime();
    }
    return 0;
  });
}

/**
 * 使用博客文章列表
 *
 * @returns 博客文章列表
 */
export function useBlogPosts(): UseBlogPostsResult {
  const {
    data: posts,
    loading: dataLoading,
    error,
    refresh,
  } = useContentData<BlogPost[]>({
    type: "blog",
    path: API_PATHS.blog.Posts,
    disableCache: false, // 启用缓存
    params: { cache: "force-cache" }, // 使用服务器缓存
    forceRefresh: false, // 禁用强制刷新
  });

  const sortedPosts = useMemo(() => sortPostsByDate(posts), [posts]);

  const { postsCount, categories, isComputing } = useMemo(() => {
    const postsCount: Record<string, number> = {};
    const categoriesCount: Record<string, number> = {};

    if (!sortedPosts) {
      return { postsCount: {}, categories: [], isComputing: true };
    }

    sortedPosts.forEach((post) => {
      // 处理标签统计，确保 tags 属性存在且是数组
      if (post.tags && Array.isArray(post.tags)) {
        post.tags.forEach((tag) => {
          if (typeof tag === "string") {
            postsCount[tag] = (postsCount[tag] || 0) + 1;
          }
        });
      }

      // 处理分类统计，确保 category 属性存在且是字符串
      if (post.category && typeof post.category === "string") {
        categoriesCount[post.category] =
          (categoriesCount[post.category] || 0) + 1;
      }
    });

    // 转换为带计数的分类数组
    const categories: CategoryWithCount[] = Object.entries(categoriesCount)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    return {
      postsCount,
      categories,
      isComputing: false,
    };
  }, [sortedPosts]);

  const loading = dataLoading || isComputing;

  return {
    data: sortedPosts ?? [],
    posts: sortedPosts ?? [],
    loading,
    error,
    refresh,
    postsCount,
    categories,
  };
}

/**
 * 使用标签统计
 *
 * @returns 标签统计列表
 */
export function useTagCounts(): HookResult<TagCount[]> {
  const { data, loading, error, refresh } = useContentData<
    Record<string, number>
  >({
    type: "blog",
    path: API_PATHS.blog.TagsCount,
  });

  const tagCounts = useMemo(() => {
    if (!data) return [];
    const countsArray = Object.entries(data).map(([tag, count]) => ({
      tag,
      count: count as number,
    }));

    return countsArray.sort(
      (a, b) => (b.count as number) - (a.count as number),
    );
  }, [data]);

  return {
    data: tagCounts,
    loading,
    error,
    refresh,
  };
}

/**
 * 使用按年份分组的博客文章
 *
 * @returns 按年份分组的博客文章
 */
export function useTimelinePosts(): UseTimelinePostsResult {
  const { data, loading, error, refresh } = useContentData<
    Record<string, BlogPost[]>
  >({
    type: "blog",
    path: API_PATHS.blog.Timeline,
  });

  return {
    data: data ?? {},
    postsByYear: data ?? {},
    loading,
    error,
    refresh,
  };
}

/**
 * 获取所有博客文章
 * @returns 所有博客文章列表
 */
export async function getAllPosts() {
  const response = await fetch("/api/blog/posts", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("获取博客文章失败");
  }

  const posts = (await response.json()) as BlogPost[];
  return sortPostsByDate(posts);
}

// Blog 页面状态管理 Hook
export { useBlogPage } from "./use-blog-page";
