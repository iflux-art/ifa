/**
 * 优化后的首页组件
 * 实现了图标懒加载、分批加载、代码分割、SSG等优化
 */

import type { Metadata } from "next";
import { lazy, Suspense } from "react";
import type { LinksItem } from "@/components/home/types";
import { FeatureErrorBoundary } from "@/components/shared/error-boundary";
import { ErrorFallback } from "@/components/shared/error-fallback";

// 按需加载 OptimizedHomePage 组件
const OptimizedHomePage = lazy(() =>
  import("../components/home/optimized-home-page").then((module) => ({
    default: module.OptimizedHomePage,
  }))
);

// 在构建时生成静态元数据
export const metadata: Metadata = {
  title: "网址导航",
  description: "收集整理各类优质网站资源，方便快速访问",
  openGraph: {
    title: "网址导航",
    description: "收集整理各类优质网站资源，方便快速访问",
    type: "website",
  },
};

// 在构建时获取静态数据
async function getStaticData() {
  try {
    // 直接从链接数据文件中获取数据
    const data = await import("../components/links/links-data.json").then(
      (module) => module.default || module
    );

    // 转换数据类型以匹配 LinksItem 接口
    const items: LinksItem[] = data.map((item) => ({
      ...item,
      iconType: item.iconType as "image" | "text" | undefined,
    }));

    // 使用生成的分类数据
    let categories: Array<{
      id: string;
      name: string;
      children?: Array<{ id: string; name: string }>;
    }> = [];
    try {
      const generatedCategories = await import("../components/links/generated-categories").then(
        (module) => module.generatedCategories || module.default
      );
      categories = generatedCategories;
    } catch (error) {
      console.warn("Failed to load generated categories, using empty array:", error);
    }

    // 只返回关键数据，减少初始加载量
    const criticalItems = items.slice(0, 100); // 只返回前100个项目作为关键数据
    const criticalCategories = categories.slice(0, 5); // 只返回前5个分类

    return {
      items: criticalItems,
      categories: criticalCategories,
      totalItems: items.length,
      totalCategories: categories.length,
    };
  } catch (error) {
    console.error("获取静态数据失败:", error);
    return {
      items: [],
      categories: [],
      totalItems: 0,
      totalCategories: 0,
    };
  }
}

export default async function OptimizedHome() {
  const staticData = await getStaticData();

  return (
    <FeatureErrorBoundary fallback={<ErrorFallback />}>
      <Suspense
        fallback={
          <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4">
              {/* 优化的骨架屏 */}
              <div className="grid grid-cols-12 gap-4 sm:gap-6">
                {/* 左侧空列 */}
                <div className="hidden xl:col-span-2 xl:block"></div>

                {/* 主内容区域 */}
                <div className="col-span-12 xl:col-span-8">
                  <div className="grid grid-cols-8 gap-4 sm:gap-6">
                    {/* 左侧边栏 */}
                    <div className="col-span-8 md:col-span-2">
                      <div className="space-y-4 pt-6">
                        <div className="h-6 w-3/4 animate-pulse rounded bg-muted"></div>
                        <div className="space-y-2">
                          {Array.from({ length: 8 }, (_, i) => (
                            <div
                              key={`sidebar-item-${Date.now()}-${i}`}
                              className="h-4 w-full animate-pulse rounded bg-muted"
                            ></div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* 链接卡片区域 */}
                    <div className="col-span-8 md:col-span-6">
                      <div className="space-y-6 pt-6">
                        {/* 标题骨架 */}
                        <div className="h-8 w-1/3 animate-pulse rounded bg-muted"></div>

                        {/* 链接卡片骨架 */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-3 xl:grid-cols-3">
                          {Array.from({ length: 12 }, (_, i) => (
                            <div
                              key={`card-item-${Date.now()}-${i}`}
                              className="animate-pulse space-y-3 rounded-lg border p-4"
                            >
                              <div className="flex items-center space-x-3">
                                <div className="h-10 w-10 rounded-full bg-muted"></div>
                                <div className="h-5 flex-1 rounded bg-muted"></div>
                              </div>
                              <div className="h-4 w-full rounded bg-muted"></div>
                              <div className="h-4 w-2/3 rounded bg-muted"></div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 右侧空列 */}
                <div className="hidden xl:col-span-2 xl:block"></div>
              </div>
            </div>
          </div>
        }
      >
        <OptimizedHomePage initialData={staticData} />
      </Suspense>
    </FeatureErrorBoundary>
  );
}
