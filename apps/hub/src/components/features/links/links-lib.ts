/**
 * 链接数据工具函数
 * 提供链接数据加载、缓存清理等核心功能
 */

import type { LinksItem } from "@/components/features/links/links-types";

/**
 * 从 links-data.json 加载所有链接数据
 */
export async function loadAllLinksData(): Promise<LinksItem[]> {
  try {
    // 直接从 links-data.json 导入数据
    const data = await import("@/components/features/links/links-data.json");

    // 转换数据类型以匹配 LinksItem 接口
    const items: LinksItem[] = data.default.map((item) => ({
      ...item,
      iconType: item.iconType as "image" | "text" | undefined,
    }));

    return items;
  } catch (error) {
    console.error("加载链接数据失败:", error);
    return [];
  }
}

/**
 * 添加一个函数来清除所有缓存
 */
export function clearAllCaches(): void {
  try {
    if (typeof window === "undefined") {
      return;
    }

    // 清除localStorage中的所有缓存
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("links-")) {
        localStorage.removeItem(key);
      }
    });

    console.log("所有缓存已清除");
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("清除缓存时出错:", error);
    }
  }
}

/**
 * 处理chunk加载错误的恢复函数
 */
export function handleChunkLoadError(): void {
  if (typeof window !== "undefined") {
    console.warn("检测到chunk加载错误，正在清除缓存并重新加载页面...");
    clearAllCaches();

    // 在开发环境中，尝试重新加载页面
    if (process.env.NODE_ENV === "development") {
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  }
}
