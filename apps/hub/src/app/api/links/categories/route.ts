import { NextResponse } from "next/server";
import type { LinkCategory } from "@/components/link-categories/categories";
import { generateCategoriesFromFiles } from "@/components/link-categories/categories-server";

// 添加缓存变量
let cachedCategories: LinkCategory[] | null = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5分钟缓存

export async function GET() {
  try {
    // 检查缓存
    const now = Date.now();
    if (cachedCategories && now - cacheTimestamp < CACHE_DURATION) {
      console.log("使用缓存的分类数据");
      return NextResponse.json(cachedCategories);
    }

    console.log("重新生成分类数据");
    const categories = await generateCategoriesFromFiles();

    // 更新缓存
    cachedCategories = categories;
    cacheTimestamp = now;

    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error reading links categories:", error);
    return NextResponse.json(
      {
        error: "Failed to read categories",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
