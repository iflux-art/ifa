/**
 * 管理后台主入口页面
 * 实现静态生成、代码分割和骨架屏优化
 */

import type { Metadata } from "next";
import { lazy, Suspense } from "react";
import { getStaticAdminData } from "@/components/admin/get-static-admin-data";
import type { LinksCategory } from "@/components/link-categories";
import type { LinksItem } from "@/components/links/links-types";
import { FeatureErrorBoundary } from "@/components/shared/error-boundary";
import { AdminErrorFallback } from "@/components/shared/error-fallback";

// 静态生成元数据
export const metadata: Metadata = {
  title: "管理后台 - IFA Hub",
  description: "管理网站链接和内容",
};

// 服务端获取静态数据
async function getStaticData() {
  try {
    const staticData = await getStaticAdminData();
    return staticData;
  } catch (error) {
    console.error("获取静态数据失败:", error);
    return {
      items: [] as LinksItem[],
      categories: [] as LinksCategory[],
      totalItems: 0,
      totalCategories: 0,
      generatedAt: new Date().toISOString(),
    };
  }
}

// 使用 React.lazy 进行代码分割优化
const OptimizedAdminPage = lazy(() =>
  import("@/components/admin/optimized-admin-page").then((module) => ({
    default: module.OptimizedAdminPage,
  }))
);

/**
 * 优化后的管理后台主入口
 * 使用静态生成、React.lazy 懒加载、代码分割和错误处理，提升性能和用户体验
 */
export default async function AdminPageEntry() {
  const staticData = await getStaticData();

  return (
    <div className="min-h-screen w-full bg-background">
      <div className="container mx-auto px-4 py-4">
        <div className="mt-4">
          <FeatureErrorBoundary fallback={<AdminErrorFallback />}>
            <Suspense
              fallback={
                <div className="min-h-screen bg-background">
                  <div className="container mx-auto px-4 py-6 lg:py-8">
                    <div className="animate-pulse space-y-6">
                      {/* 页面标题骨架 */}
                      <div className="h-8 w-1/3 rounded-lg bg-muted"></div>

                      {/* 搜索和过滤骨架 */}
                      <div className="flex flex-col gap-4 sm:flex-row">
                        <div className="h-10 flex-1 rounded bg-muted"></div>
                        <div className="h-10 w-32 rounded bg-muted"></div>
                        <div className="h-10 w-24 rounded bg-muted"></div>
                      </div>

                      {/* 数据表格骨架 */}
                      <div className="rounded-lg border">
                        {/* 表头 */}
                        <div className="border-b p-4">
                          <div className="grid grid-cols-5 gap-4">
                            {Array.from({ length: 5 }, (_, i) => (
                              <div
                                key={`header-${Date.now()}-${i}`}
                                className="h-4 rounded bg-muted"
                              ></div>
                            ))}
                          </div>
                        </div>

                        {/* 表格行 */}
                        {Array.from({ length: 8 }, (_, i) => (
                          <div key={`row-${Date.now()}-${i}`} className="border-b p-4">
                            <div className="grid grid-cols-5 gap-4">
                              {Array.from({ length: 5 }, (_, j) => (
                                <div
                                  key={`cell-${Date.now()}-${i}-${j}`}
                                  className="h-4 rounded bg-muted"
                                ></div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              }
            >
              <OptimizedAdminPage initialData={staticData} />
            </Suspense>
          </FeatureErrorBoundary>
        </div>
      </div>
    </div>
  );
}
