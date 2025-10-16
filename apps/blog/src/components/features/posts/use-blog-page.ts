"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useCallback } from "react";
import { getAllPosts } from "@/components/features/posts/hooks";
import { useCache } from "@/hooks/use-advanced-cache";
import type { BlogPost } from "@/components/features/posts/blog-types";
// 从 blog-category-card 组件中导入 CategoryWithCount 类型
import type { CategoryWithCount } from "@/components/features/sidebar/blog-category-card";

export interface UseBlogPageReturn {
  // 数据状态
  posts: BlogPost[];
  filteredPosts: BlogPost[];
  categories: CategoryWithCount[];
  postsCount: Record<string, number>;
  relatedPosts: {
    title: string;
    href: string;
    category: string | undefined;
    slug: string[];
  }[];
  latestPosts: {
    title: string;
    href: string;
    date: string | undefined;
    category: string | undefined;
  }[];

  // 加载状态
  loading: boolean;

  // 过滤状态
  category: string | undefined;
  tag: string | undefined;

  // 事件处理器
  handleCategoryClick: (newCategory: string | null) => void;
  handleTagClick: (newTag: string | null) => void;

  // 刷新数据
  refreshData: () => Promise<void>;
}

interface UseBlogPageOptions {
  initialPosts?: BlogPost[];
}

/**
 * Blog页面状态管理Hook
 * 封装了博客页面的所有状态管理和数据处理逻辑
 */
export function useBlogPage(options: UseBlogPageOptions = {}): UseBlogPageReturn {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { initialPosts = [] } = options;

  // 使用统一缓存机制获取文章数据
  const {
    data: postsData,
    loading,
    refetch: refreshData,
  } = useCache<BlogPost[]>(
    "blog-posts",
    async () => {
      // 如果提供了初始数据且不为空，使用初始数据
      if (initialPosts && initialPosts.length > 0) {
        return initialPosts;
      }
      // 否则从API获取数据
      const data = await getAllPosts();
      return data || [];
    },
    {
      expiry: 5 * 60 * 1000, // 5分钟缓存
      strategy: "cache-first",
      validator: (data) => Array.isArray(data),
    }
  );

  // 确保使用最新的数据源
  const posts = postsData && postsData.length > 0 ? postsData : initialPosts || [];

  // 从URL参数中获取分类和标签筛选条件
  const category = searchParams ? (searchParams.get("category") ?? undefined) : undefined;
  const tag = searchParams ? (searchParams.get("tag") ?? undefined) : undefined;

  // 过滤文章
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      if (category && post.category !== category) {
        return false;
      }
      if (tag && !post.tags?.includes(tag)) {
        return false;
      }
      return true;
    });
  }, [posts, category, tag]);

  // 计算分类统计
  const calculateCategoriesData = useCallback(() => {
    // 重新计算分类统计
    const categoriesCount: Record<string, number> = {};
    for (const post of posts) {
      if (post.category) {
        categoriesCount[post.category] = (categoriesCount[post.category] || 0) + 1;
      }
    }

    const categories: CategoryWithCount[] = Object.entries(categoriesCount)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    // 重新计算标签统计
    const postsCount: Record<string, number> = {};
    for (const post of posts) {
      if (post.tags) {
        for (const tag of post.tags) {
          postsCount[tag] = (postsCount[tag] || 0) + 1;
        }
      }
    }

    return { categories, postsCount };
  }, [posts]);

  // 分类统计（使用统一缓存机制）
  const { data: categoriesData } = useCache<{
    categories: CategoryWithCount[];
    postsCount: Record<string, number>;
  }>(
    `blog_categories_${posts.length}_${category ?? "all"}_${tag ?? "all"}`,
    () => {
      return Promise.resolve(calculateCategoriesData());
    },
    {
      expiry: 5 * 60 * 1000, // 5分钟缓存
      strategy: "cache-first",
      validator: (data) =>
        data !== null &&
        typeof data === "object" &&
        Array.isArray(data.categories) &&
        typeof data.postsCount === "object",
    }
  );

  // 计算相关文章
  const calculateRelatedPosts = useCallback(() => {
    // 重新计算相关文章
    return posts.slice(0, 10).map((post) => ({
      title: post.title ?? "",
      href: `/posts/${post.slug ?? ""}`,
      category: post.category,
      slug: post.slug ? post.slug.split("/") : [],
    }));
  }, [posts]);

  // 相关文章（使用统一缓存机制）
  const { data: relatedPostsData } = useCache<UseBlogPageReturn["relatedPosts"]>(
    `blog_related_${posts.length}`,
    () => {
      // 重新计算相关文章
      return Promise.resolve(calculateRelatedPosts());
    },
    {
      expiry: 5 * 60 * 1000, // 5分钟缓存
      strategy: "cache-first",
      validator: (data) => Array.isArray(data),
    }
  );

  // 计算最新文章
  const calculateLatestPosts = useCallback(() => {
    // 重新计算最新文章
    return posts
      .filter((post) => post.date)
      .slice(0, 5)
      .map((post) => ({
        title: post.title ?? "",
        href: `/posts/${post.slug ?? ""}`,
        date: post.date?.toString(),
        category: post.category,
      }));
  }, [posts]);

  // 最新发布的文章（使用统一缓存机制）
  const { data: latestPostsData } = useCache<UseBlogPageReturn["latestPosts"]>(
    `blog_latest_${posts.length}`,
    () => {
      // 重新计算最新文章
      return Promise.resolve(calculateLatestPosts());
    },
    {
      expiry: 5 * 60 * 1000, // 5分钟缓存
      strategy: "cache-first",
      validator: (data) => Array.isArray(data),
    }
  );

  // 处理分类点击
  const handleCategoryClick = (newCategory: string | null) => {
    const newParams = new URLSearchParams(searchParams?.toString() ?? "");
    if (newCategory) {
      newParams.set("category", newCategory);
    } else {
      newParams.delete("category");
    }
    router.push(`/?${newParams.toString()}`, { scroll: false });
  };

  // 处理标签点击
  const handleTagClick = (newTag: string | null) => {
    const newParams = new URLSearchParams(searchParams?.toString() ?? "");
    if (newTag) {
      newParams.set("tag", newTag);
    } else {
      newParams.delete("tag");
    }
    router.push(`/?${newParams.toString()}`, { scroll: false });
  };

  return {
    // 数据状态
    posts,
    filteredPosts,
    categories: categoriesData?.categories ?? [],
    postsCount: categoriesData?.postsCount ?? {},
    relatedPosts: relatedPostsData ?? [],
    latestPosts: latestPostsData ?? [],

    // 加载状态
    loading,

    // 过滤状态
    category,
    tag,

    // 事件处理器
    handleCategoryClick,
    handleTagClick,

    // 刷新数据
    refreshData,
  };
}
