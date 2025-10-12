"use client";

import { lazy, Suspense } from "react";
import { FeatureErrorBoundary } from "@/components/shared/error-boundary";
import { AdminErrorFallback } from "@/components/shared/error-fallback";

// 使用 React.lazy 进行代码分割优化
const AdminPage = lazy(() =>
  import("@/components/admin").then((module) => ({
    default: module.AdminPage,
  }))
);

/**
 * 优化后的管理后台主入口
 * 使用 React.lazy 懒加载、代码分割和错误处理，提升性能和用户体验
 */
export default function AdminPageEntry() {
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
                            {Array.from({ length: 5 }, () => (
                              <div key={crypto.randomUUID()} className="h-4 rounded bg-muted"></div>
                            ))}
                          </div>
                        </div>

                        {/* 表格行 */}
                        {Array.from({ length: 8 }, () => (
                          <div key={crypto.randomUUID()} className="border-b p-4">
                            <div className="grid grid-cols-5 gap-4">
                              {Array.from({ length: 5 }, () => (
                                <div
                                  key={crypto.randomUUID()}
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
              <AdminPage />
            </Suspense>
          </FeatureErrorBoundary>
        </div>
      </div>
    </div>
  );
}
