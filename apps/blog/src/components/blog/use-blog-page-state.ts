"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect } from "react";
import type { BlogPost } from "@/components/blog";
// 移除直接导入，改为通过API调用获取数据
// import { getAllBlogMeta } from "@/components/blog";
// 导入新的异步操作工具
import { executeAsyncOperation } from "@/lib/utils/async";
import { useBlogPageStore } from "@/stores";

// 内联 CategoryWithCount 类型定义
interface CategoryWithCount {
  name: string;
  count: number;
}

export interface UseBlogPageStateReturn {
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

/**
 * Blog页面状态管理Hook (使用 Zustand)
 * 封装了博客页面的所有状态管理和数据处理逻辑
 */
export function useBlogPageState(): UseBlogPageStateReturn {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 从 Zustand store 获取状态和动作
  const {
    posts,
    loading,
    category,
    tag,
    setPosts,
    setLoading,
    setCategory,
    setTag,
  } = useBlogPageStore();

  // 加载文章数据
  const loadPosts = useCallback(async () => {
    const operation = async () => {
      // 通过API路由获取数据
      const response = await fetch("/api/blog/posts");
      if (!response.ok) {
        throw new Error(
          `Failed to fetch blog posts: ${response.status} ${response.statusText}`,
        );
      }
      const data = await response.json();
      return data as BlogPost[];
    };

    await executeAsyncOperation(operation, {
      setLoading,
      onSuccess: (data) => {
        setPosts(data);
      },
      contentType: "blog",
    });
  }, [setPosts, setLoading]);

  // 初始化时加载数据
  useEffect(() => {
    void loadPosts();
  }, [loadPosts]);

  // 从 URL 参数中获取分类和标签过滤条件
  useEffect(() => {
    const entries = Object.fromEntries(searchParams.entries());
    const categoryParam = entries.category;
    const tagParam = entries.tag;

    if (categoryParam) {
      setCategory(categoryParam as string);
    }

    if (tagParam) {
      setTag(tagParam as string);
    }
  }, [searchParams, setCategory, setTag]);

  // 过滤文章
  const filteredPosts = posts.filter((post) => {
    if (category && post.category !== category) return false;
    if (tag && !post.tags?.includes(tag)) return false;
    return true;
  });

  // 分类统计
  const categoriesCount: Record<string, number> = {};
  posts.forEach((post) => {
    if (post.category) {
      categoriesCount[post.category] =
        (categoriesCount[post.category] || 0) + 1;
    }
  });

  const categories: CategoryWithCount[] = Object.entries(categoriesCount)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  // 标签统计
  const postsCount: Record<string, number> = {};
  posts.forEach((post) => {
    post.tags?.forEach((tag: string) => {
      postsCount[tag] = (postsCount[tag] || 0) + 1;
    });
  });

  // 相关文章（取最新的10篇）
  const relatedPosts = posts.slice(0, 10).map((post) => ({
    title: post.title,
    href: `/posts/${Array.isArray(post.slug) ? post.slug.join("/") : post.slug}`,
    category: post.category,
    slug: Array.isArray(post.slug) ? post.slug : post.slug.split("/"),
  }));

  // 最新发布的文章
  const latestPosts = posts
    .filter((post) => post.date)
    .slice(0, 5)
    .map((post) => ({
      title: post.title,
      href: `/posts/${Array.isArray(post.slug) ? post.slug.join("/") : post.slug}`,
      date: post.date?.toString(),
      category: post.category,
    }));

  // 处理分类点击
  const handleCategoryClick = (newCategory: string | null) => {
    setCategory(newCategory || undefined);
    const newParams = new URLSearchParams(searchParams.toString());
    if (newCategory) {
      newParams.set("category", newCategory);
    } else {
      newParams.delete("category");
    }
    router.push(`/posts?${newParams.toString()}`, { scroll: false });
  };

  // 处理标签点击
  const handleTagClick = (newTag: string | null) => {
    setTag(newTag || undefined);
    const newParams = new URLSearchParams(searchParams.toString());
    if (newTag) {
      newParams.set("tag", newTag);
    } else {
      newParams.delete("tag");
    }
    router.push(`/posts?${newParams.toString()}`, { scroll: false });
  };

  return {
    // 数据状态
    posts,
    filteredPosts,
    categories,
    postsCount,
    relatedPosts,
    latestPosts,

    // 加载状态
    loading,

    // 过滤状态
    category,
    tag,

    // 事件处理器
    handleCategoryClick,
    handleTagClick,

    // 刷新数据
    refreshData: loadPosts,
  };
}
