import type { Metadata } from "next";
import { lazy, Suspense } from "react";
import { FeatureErrorBoundary } from "@/components/shared/error-boundary";
import { ErrorFallback } from "@/components/shared/error-fallback";

// 使用 React.lazy 进行代码分割优化
const HomePage = lazy(() =>
  import("@/components/home").then((module) => ({
    default: module.HomePage,
  }))
);

/**
 * 首页元数据
 * 优化后的网址导航页面元数据
 */
export const metadata: Metadata = {
  title: "网址导航",
  description: "收集整理各类优质网站资源，方便快速访问",
  openGraph: {
    title: "网址导航",
    description: "收集整理各类优质网站资源，方便快速访问",
    type: "website",
  },
};

/**
 * 优化后的首页组件
 * 使用 React.lazy 懒加载、代码分割和错误处理，提升加载性能和用户体验
 */
export default function Home() {
  return (
    <FeatureErrorBoundary fallback={<ErrorFallback />}>
      <Suspense
        fallback={
          <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4">
              {/* 12列网格布局，左右两侧各2列空白，中间8列主内容区，只在xl和2xl断点下显示空白列 */}
              <div className="grid grid-cols-12 gap-4 sm:gap-6">
                {/* 左侧空列 - 占2列，只在xl和2xl断点下显示 */}
                <div className="hidden xl:col-span-2 xl:block"></div>

                {/* 主内容区域 - 在小屏幕上占12列，在xl及以上占8列 */}
                <div className="col-span-12 xl:col-span-8">
                  <div className="grid grid-cols-8 gap-4 sm:gap-6">
                    {/* 左侧边栏 - 占2列 */}
                    <div className="col-span-8 md:col-span-2">
                      <div className="space-y-4 pt-6">
                        <div className="h-6 w-3/4 rounded bg-muted"></div>
                        <div className="space-y-2">
                          {Array.from({ length: 8 }, () => (
                            <div
                              key={crypto.randomUUID()}
                              className="h-4 w-full rounded bg-muted"
                            ></div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* 链接卡片区域 - 占6列 */}
                    <div className="col-span-8 md:col-span-6">
                      <div className="space-y-6 pt-6">
                        {/* 标题骨架 */}
                        <div className="h-8 w-1/3 rounded bg-muted"></div>

                        {/* 链接卡片骨架 */}
                        <div className="grid grid-cols-6 gap-4">
                          {Array.from({ length: 9 }, () => (
                            <div
                              key={crypto.randomUUID()}
                              className="col-span-2 space-y-3 rounded-lg border p-4"
                            >
                              <div className="flex items-center space-x-3">
                                <div className="h-8 w-8 rounded bg-muted"></div>
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

                {/* 右侧空列 - 占2列，只在xl和2xl断点下显示 */}
                <div className="hidden xl:col-span-2 xl:block"></div>
              </div>
            </div>
          </div>
        }
      >
        <HomePage />
      </Suspense>
    </FeatureErrorBoundary>
  );
}
