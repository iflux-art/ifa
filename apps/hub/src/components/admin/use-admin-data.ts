"use client";

import { useCallback } from "react";
import { useLinksData } from "@/components/links";
import type { LinksItem } from "@/components/links/types";

/**
 * 管理后台数据Hook
 * 封装了链接数据的增删改查操作
 */
export function useAdminData() {
  const {
    allItems: items,
    loading,
    error,
    handleCategoryClick,
  } = useLinksData();

  /**
   * 刷新数据
   */
  const refreshData = useCallback(() => {
    // 调用 handleCategoryClick 来刷新数据
    handleCategoryClick("");
  }, [handleCategoryClick]);

  /**
   * 添加新链接
   */
  const addItem = useCallback(
    async (data: Omit<LinksItem, "id" | "createdAt" | "updatedAt">) => {
      try {
        const response = await fetch("/api/links", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "添加失败");
        }

        const newItem = await response.json();
        // 刷新数据以获取最新列表
        refreshData();
        return newItem;
      } catch (err) {
        console.error("添加链接失败:", err);
        throw err;
      }
    },
    [refreshData],
  );

  /**
   * 更新链接
   */
  const updateItem = useCallback(
    async (id: string, data: Partial<LinksItem>) => {
      try {
        const response = await fetch(`/api/links?id=${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "更新失败");
        }

        const updatedItem = await response.json();
        // 刷新数据以获取最新列表
        refreshData();
        return updatedItem;
      } catch (err) {
        console.error("更新链接失败:", err);
        throw err;
      }
    },
    [refreshData],
  );

  /**
   * 删除链接
   */
  const deleteItem = useCallback(
    async (id: string) => {
      try {
        const response = await fetch(`/api/links?id=${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "删除失败");
        }

        // 刷新数据以获取最新列表
        refreshData();
        return true;
      } catch (err) {
        console.error("删除链接失败:", err);
        throw err;
      }
    },
    [refreshData],
  );

  return {
    items,
    loading,
    error,
    refreshData,
    addItem,
    updateItem,
    deleteItem,
  };
}
