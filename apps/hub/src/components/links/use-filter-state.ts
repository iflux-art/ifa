"use client";

import { useEffect, useMemo, useRef } from "react";
import type { CategoryId } from "@/components/link-categories"; // 直接从 link-categories 导入
import type { LinksItem } from "@/components/links/links-types";
import { useLinkFilterStore } from "@/stores";

// 保持兼容性，逐步迁移
export function useFilterState(items: LinksItem[]) {
  const {
    selectedCategory,
    selectedTag,
    availableTags,
    setSelectedCategory,
    setSelectedTag,
    setFilteredItems,
    setAvailableTags,
    // 修改这里，使用resetState代替原来的resetFilters
    resetState,
  } = useLinkFilterStore();

  // 使用useRef存储上一次的items，避免不必要的更新
  const prevItemsRef = useRef<LinksItem[]>([]);

  // 过滤逻辑
  const filteredItems = useMemo(() => {
    let result = [...items]; // 创建一个新数组，避免修改原始数据

    // 按分类过滤
    if (selectedCategory) {
      result = result.filter((item) => {
        // 处理子分类的情况，例如 "development/security"
        if (selectedCategory.includes("/")) {
          return item.category === selectedCategory;
        }
        // 处理主分类的情况，需要匹配所有子分类
        return (
          item.category === selectedCategory || item.category.startsWith(`${selectedCategory}/`)
        );
      });
    }

    // 按标签过滤
    if (selectedTag) {
      result = result.filter((item) => item.tags?.includes(selectedTag));
    }

    return result;
  }, [items, selectedCategory, selectedTag]);

  // 计算可用标签
  useEffect(() => {
    // 只有当items发生变化时才重新计算标签
    if (prevItemsRef.current === items) return;

    // 从所有项目中提取唯一的标签
    const allTags = items.flatMap((item) => item.tags || []);
    const uniqueTags = Array.from(new Set(allTags)).sort();

    setAvailableTags(uniqueTags);
    prevItemsRef.current = items;
  }, [items, setAvailableTags]);

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setFilteredItems(filteredItems);
  };

  const handleTagChange = (tag: string) => {
    setSelectedTag(tag);
    setFilteredItems(filteredItems);
  };

  const resetFilters = () => {
    resetState();
    setFilteredItems(items);
  };

  return {
    filteredItems,
    selectedCategory: selectedCategory as CategoryId, // 类型转换
    selectedTag,
    availableTags,
    handleCategoryChange,
    handleTagChange,
    resetFilters,
  };
}
