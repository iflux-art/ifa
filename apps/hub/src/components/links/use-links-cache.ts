/**
 * 链接数据缓存管理 Hook
 * 提供更精细的链接数据缓存控制和管理功能
 */

import { useCallback } from "react";
import type { CategoryId } from "./types";

/**
 * 链接数据缓存管理 Hook 返回值接口
 */
interface UseLinksCacheReturn {
  /**
   * 清除指定分类的缓存
   * @param categoryId 分类ID，如果不提供则清除所有缓存
   */
  clearCache: (categoryId?: CategoryId) => void;

  /**
   * 清除所有缓存
   */
  clearAllCaches: () => void;

  /**
   * 预加载关键分类数据
   */
  preloadCritical: () => Promise<void>;

  /**
   * 刷新指定分类的数据
   * @param categoryId 分类ID
   */
  refreshCategory: (categoryId: CategoryId) => void;
}

/**
 * 链接数据缓存管理 Hook
 * 提供缓存控制、预加载和刷新功能
 */
export function useLinksCache(): UseLinksCacheReturn {
  /**
   * 清除缓存
   */
  const clearCache = useCallback((categoryId?: CategoryId) => {
    console.log("Clear cache for category:", categoryId);
    // TODO: 实现清除缓存的逻辑
  }, []);

  /**
   * 清除所有缓存
   */
  const clearAllCachesCallback = useCallback(() => {
    console.log("Clear all caches");
    // TODO: 实现清除所有缓存的逻辑
  }, []);

  /**
   * 预加载关键分类
   */
  const preloadCritical = useCallback(async () => {
    console.log("Preload critical categories");
    // TODO: 实现预加载关键分类的逻辑
  }, []);

  /**
   * 刷新指定分类的数据
   */
  const refreshCategory = useCallback((categoryId: CategoryId) => {
    console.log("Refresh category:", categoryId);
    // TODO: 实现刷新指定分类数据的逻辑
  }, []);

  return {
    clearCache,
    clearAllCaches: clearAllCachesCallback,
    preloadCritical,
    refreshCategory,
  };
}
