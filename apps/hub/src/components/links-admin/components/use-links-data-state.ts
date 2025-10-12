"use client";

import { useEffect, useMemo, useRef } from "react";
import { useCategories } from "@/components/link-categories";
import { loadAllLinksData } from "@/components/links/links-lib";
import { useFilterState } from "@/components/links/use-filter-state";
import type { LinksDataStore } from "@/components/links-admin/components/links-data-store";
import { useLinksDataStore } from "@/components/links-admin/components/links-data-store";

// 定义selector函数，避免每次创建新对象
const useLinksDataStateSelector = (state: LinksDataStore) => state;

export function useLinksDataState() {
  // 使用ref来跟踪是否已经初始化
  const isInitialized = useRef(false);

  // 从 Zustand store 获取状态和动作
  const { items, loading, error, setItems, setLoading, setError } =
    useLinksDataStore(useLinksDataStateSelector);

  // 使用共享的分类数据 hook
  const {
    categories,
    loading: categoriesLoading,
    error: categoriesError,
    getFilteredCategories,
  } = useCategories();

  // 初始化数据获取
  useEffect(() => {
    // 避免在React Strict Mode下重复执行
    if (isInitialized.current) {
      return;
    }

    async function fetchData() {
      // 只有在没有数据或有错误时才重新获取数据
      if (items.length > 0 && !error) {
        return;
      }

      try {
        isInitialized.current = true;
        setLoading(true);
        const itemsData = await loadAllLinksData();
        setItems(itemsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    fetchData();

    // 清理函数，用于在组件卸载时重置状态
    return () => {
      isInitialized.current = false;
    };
  }, [items.length, error, setItems, setLoading, setError]);

  // 过滤掉友链分类的数据 - 性能优化使用 useMemo
  const filteredItems = useMemo(() => items, [items]);

  // 使用共享的分类过滤函数
  const filteredCategories = useMemo(() => getFilteredCategories(), [getFilteredCategories]);

  // 使用过滤后的数据进行状态管理
  const {
    filteredItems: categoryFilteredItems,
    selectedCategory,
    selectedTag,
    availableTags: sortedTags, // 修复：使用 availableTags 而不是 filteredTags
    handleTagChange: handleTagClick,
    handleCategoryChange,
  } = useFilterState(filteredItems);

  const handleCategoryClick = (categoryId: string) => {
    console.log("处理分类点击事件:", categoryId);
    handleCategoryChange(categoryId);
  };

  // 使用共享的分类名称获取函数
  const getCategoryName = (categoryId: string) => {
    // 查找匹配的分类
    const category = categories.find((cat) => cat.id === categoryId);
    if (category) {
      return category.name;
    }

    // 查找子分类
    for (const cat of categories) {
      if (cat.children) {
        const subCategory = cat.children.find((sub) => sub.id === categoryId);
        if (subCategory) {
          return `${cat.name} > ${subCategory.name}`;
        }
      }
    }

    return categoryId;
  };

  // 计算总数 - 使用 useMemo 缓存计算结果
  const totalFilteredCount = useMemo(() => filteredItems.length, [filteredItems]);

  return {
    items: filteredItems, // 返回过滤后的数据（用于链接导航页面）
    allItems: items, // 返回所有原始数据（用于友链和关于页面）
    categories: filteredCategories, // 返回过滤后的分类
    selectedCategory,
    selectedTag,
    filteredItems: categoryFilteredItems, // 经过分类筛选的数据
    sortedTags,
    totalFilteredCount,
    loading: loading || categoriesLoading,
    error: error || categoriesError,
    handleCategoryClick,
    handleTagClick,
    getCategoryName,
  };
}
