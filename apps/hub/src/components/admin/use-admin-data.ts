"use client";

/**
 * 管理页面数据管理 hook
 * 整合数据获取、状态管理和分类数据
 */

import { useCallback, useEffect } from "react";
import { useCategories } from "@/components/link-categories";
import { loadAllLinksData } from "@/components/links/links-lib";
import type { LinksItem } from "@/components/links/links-types";
import { useAdminStore } from "./admin-store";

/**
 * 管理页面数据管理 hook
 * @param initialData 初始数据
 */
export const useAdminData = (initialData?: LinksItem[]) => {
  const {
    items,
    searchTerm,
    selectedCategory,
    showAddDialog,
    editingItem,
    deletingItem,
    loading,
    error,
    setItems,
    setSearchTerm,
    setSelectedCategory,
    setShowAddDialog,
    setEditingItem,
    setDeletingItem,
    setLoading,
    setError,
  } = useAdminStore();

  // 使用共享的分类数据 hook
  const { categories } = useCategories();

  // 加载数据函数
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const linksData = await loadAllLinksData();
      setItems(linksData.flat());
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load data";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [setItems, setLoading, setError]);

  // 初始化数据
  useEffect(() => {
    if (initialData) {
      setItems(initialData);
    } else {
      void loadData();
    }
  }, [initialData, loadData, setItems]);

  return {
    // 状态
    items,
    searchTerm,
    selectedCategory,
    showAddDialog,
    editingItem,
    deletingItem,
    loading,
    error,
    categories,

    // 操作函数
    setSearchTerm,
    setSelectedCategory,
    setShowAddDialog,
    setEditingItem,
    setDeletingItem,
    loadData,
  };
};
