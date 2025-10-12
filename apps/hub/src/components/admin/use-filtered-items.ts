/**
 * 过滤链接项的优化 hook
 * 使用防抖和 useMemo 优化过滤性能
 */

import { useMemo } from "react";
import type { LinksItem } from "@/components/links/links-types";
import { useDebouncedValue } from "@/components/shared";

/**
 * 过滤链接项的自定义 hook
 * 根据搜索词和分类筛选链接项
 *
 * @param items 链接项数组
 * @param searchTerm 搜索词
 * @param selectedCategory 选中的分类
 * @returns 过滤后的链接项数组
 */
export const useFilteredItems = (
  items: LinksItem[],
  searchTerm: string,
  selectedCategory: string
) => {
  /** 防抖后的搜索词，300ms 延迟 */
  const debouncedSearchTerm = useDebouncedValue(searchTerm, 300);

  /** 过滤后的链接项 */
  const filteredItems = useMemo(() => {
    // 如果没有搜索条件和分类筛选，直接返回原数据
    if (!debouncedSearchTerm && !selectedCategory) {
      return items;
    }

    /** 小写搜索词，用于不区分大小写的匹配 */
    const searchLower = debouncedSearchTerm.toLowerCase();

    return items.filter((item) => {
      /** 检查是否匹配搜索词 */
      const matchesSearch =
        !debouncedSearchTerm ||
        item.title.toLowerCase().includes(searchLower) ||
        item.description.toLowerCase().includes(searchLower) ||
        item.url.toLowerCase().includes(searchLower) ||
        item.tags.some((tag: string) => tag.toLowerCase().includes(searchLower));

      /** 检查是否匹配分类 */
      const matchesCategory = !selectedCategory || item.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [items, debouncedSearchTerm, selectedCategory]);

  return filteredItems;
};
