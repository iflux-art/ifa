/**
 * 获取管理页面的静态数据
 * 用于服务端渲染和静态生成优化
 */

import type { LinksItem } from "@/components/links/links-types";
import type { LinksCategory } from "@/components/link-categories/categories-types";

// 动态导入链接数据
async function getLinksData() {
  try {
    const data = await import("@/components/links/links-data.json");
    return data.default;
  } catch (error) {
    console.warn("Failed to load links data:", error);
    return null;
  }
}

/**
 * 获取管理页面的静态数据
 * 直接从链接数据文件中读取数据
 */
export async function getStaticAdminData() {
  // 获取链接数据
  const linksData = await getLinksData();

  if (linksData) {
    // 转换为 LinksItem 类型
    const items: LinksItem[] = linksData.map((item) => ({
      ...item,
      iconType: item.iconType as "image" | "text" | undefined,
    }));

    // 使用生成的分类数据
    let categories: LinksCategory[] = [];
    try {
      const generatedCategories = await import("@/components/links/generated-categories").then(
        (module) => module.generatedCategories || module.default
      );
      // 类型转换
      categories = generatedCategories as LinksCategory[];
    } catch (error) {
      console.warn("Failed to load generated categories, using empty array:", error);
    }

    // 返回数据
    return {
      items: items,
      categories: categories,
      totalItems: items.length,
      totalCategories: categories.length,
      generatedAt: new Date().toISOString(),
    };
  }

  // 如果数据不可用，返回空数据结构
  return {
    items: [] as LinksItem[],
    categories: [] as LinksCategory[],
    totalItems: 0,
    totalCategories: 0,
    generatedAt: new Date().toISOString(),
  };
}
