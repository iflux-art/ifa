/**
 * 主页面组件
 * 重构自 LinksPage 组件，优化性能和结构
 * 使用 React.memo 提升性能，采用内联类型定义
 */

"use client";

import { memo } from "react";
import { LinksContent } from "./links-content";
import { Sidebar } from "./sidebar";
import type { HomePageProps } from "./types";
import { useLinksData } from "./use-links-data";

export const HomePage = memo(({ initialData }: HomePageProps) => {
  const { categories, selectedCategory, filteredItems, handleCategoryClick } =
    useLinksData(initialData);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4">
        {/* 12列网格布局，左右两侧各2列空白，中间8列主内容区，只在xl和2xl断点下显示空白列 */}
        <div className="grid grid-cols-12 gap-4 sm:gap-6">
          {/* 左侧空列 - 占2列，只在xl和2xl断点下显示 */}
          <div className="hidden xl:col-span-2 xl:block"></div>

          {/* 主内容区域 - 在小屏幕上占12列，在xl及以上占8列 */}
          <div className="col-span-12 xl:col-span-8">
            <div className="grid grid-cols-8 gap-4 sm:gap-6">
              {/* 左侧边栏 - 默认占8列，在xl和2xl断点下占2列 */}
              <div className="col-span-8 xl:col-span-2">
                <div
                  style={{
                    position: "sticky",
                    top: "80px",
                    maxHeight: "calc(100vh - 5rem - env(safe-area-inset-bottom))",
                  }}
                  className="hide-scrollbar overflow-y-auto"
                >
                  <Sidebar
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onCategoryChange={handleCategoryClick}
                  />
                </div>
              </div>

              {/* 链接卡片区域 - 默认占8列，在xl和2xl断点下占6列 */}
              <div className="col-span-8 xl:col-span-6">
                <LinksContent items={filteredItems} selectedCategory={selectedCategory} />
              </div>
            </div>
          </div>

          {/* 右侧空列 - 占2列，只在xl和2xl断点下显示 */}
          <div className="hidden xl:col-span-2 xl:block"></div>
        </div>
      </div>
    </div>
  );
});

HomePage.displayName = "HomePage";
