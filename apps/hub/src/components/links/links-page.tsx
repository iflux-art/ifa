"use client";

import { Card, CardContent } from "@/components/ui/card";
import { SimpleLayout } from "@/components/layout";
import { LinksContent, LinksSidebar } from "@/components";
import { useLinksData } from "@/features/links/hooks";

/**
 * 链接导航页面容器组件（客户端）
 * 处理链接数据获取和交互逻辑
 */
export const LinksPageContainer = () => {
  const {
    categories,
    selectedCategory,
    filteredItems,
    handleCategoryClick,
    error,
    refreshData,
  } = useLinksData();

  // 左侧边栏内容
  const leftSidebar = (
    <Card className="w-full">
      <CardContent className="p-4">
        <LinksSidebar
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryClick}
        />
      </CardContent>
    </Card>
  );

  // 如果有错误，显示错误信息
  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex items-center justify-center py-24">
          <div className="text-center max-w-md">
            <h3 className="mb-2 text-lg font-medium text-destructive">
              加载失败
            </h3>
            <p className="text-sm text-muted-foreground mb-4">{error}</p>
            <button
              type="button"
              onClick={() => {
                refreshData();
              }}
              className="mt-2 rounded bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
            >
              重试
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 如果没有数据，显示空状态
  if (!filteredItems || filteredItems.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex items-center justify-center py-24">
          <div className="text-center max-w-md">
            <h3 className="mb-2 text-lg font-medium text-muted-foreground">
              暂无链接数据
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {selectedCategory
                ? `没有找到关于 "${selectedCategory}" 的链接`
                : "没有找到任何链接数据"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SimpleLayout leftSidebar={leftSidebar} layout="single-sidebar">
        <LinksContent
          items={filteredItems}
          selectedCategory={selectedCategory}
        />
      </SimpleLayout>
    </div>
  );
};
