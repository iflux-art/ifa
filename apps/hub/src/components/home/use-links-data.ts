"use client";

/**
 * 链接数据管理 Hook
 * 整合现有的数据获取逻辑，优化状态管理和性能
 */

import { useCallback, useEffect, useMemo, useRef } from "react";
import { useCategories } from "@/components/link-categories";
import { loadAllLinksData } from "@/components/links/links-lib";
import { useFilterState } from "@/components/links/use-filter-state";
import { useLinksDataStore } from "@/components/links-admin/components/links-data-store";
import type { Category, LinksItem } from "./types";

// 定义selector函数，避免每次创建新对象
interface LinksDataState {
  items: LinksItem[];
  loading: boolean;
  error: string | null;
  setItems: (items: LinksItem[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

const useLinksDataStateSelector = (state: LinksDataState) => state;

export const useLinksData = (initialData?: LinksItem[]) => {
  // 使用ref来跟踪是否已经初始化
  const isInitialized = useRef(false);

  // 从 Zustand store 获取状态和动作
  const { items, loading, error, setItems, setLoading, setError } =
    useLinksDataStore(useLinksDataStateSelector);

  // 使用共享的分类数据 hook
  const {
    loading: categoriesLoading,
    error: categoriesError,
    getFilteredCategories,
  } = useCategories();

  // 转换分类数据格式以匹配内联类型定义
  const categories: Category[] = useMemo(() => {
    const filteredCategories = getFilteredCategories();
    return filteredCategories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      children: cat.children?.map((child) => ({
        id: child.id,
        name: child.name,
      })),
    }));
  }, [getFilteredCategories]);

  // 初始化数据获取
  useEffect(() => {
    // 避免在React Strict Mode下重复执行
    if (isInitialized.current) {
      return;
    }

    async function fetchData() {
      // 如果有初始数据，直接使用
      if (initialData && initialData.length > 0) {
        setItems(initialData);
        isInitialized.current = true;
        return;
      }

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
  }, [initialData, items.length, error, setItems, setLoading, setError]);

  // 过滤掉友链分类的数据 - 性能优化使用 useMemo
  const filteredItems = useMemo(() => items, [items]);

  // 使用过滤后的数据进行状态管理
  const {
    filteredItems: categoryFilteredItems,
    selectedCategory,
    handleCategoryChange,
  } = useFilterState(filteredItems);

  const handleCategoryClick = useCallback(
    (categoryId: string) => {
      console.log("处理分类点击事件:", categoryId);
      handleCategoryChange(categoryId);
    },
    [handleCategoryChange]
  );

  return {
    categories,
    selectedCategory,
    filteredItems: categoryFilteredItems,
    loading: loading || categoriesLoading,
    error: error || categoriesError,
    handleCategoryClick,
  };
};
