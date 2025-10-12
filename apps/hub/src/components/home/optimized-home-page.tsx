/**
 * 优化的主页面组件
 * 实现了图标懒加载、分批加载、代码分割等优化
 */

"use client";

import { memo, useEffect, useMemo, useState, useCallback } from "react";
import type { Category, LinksItem } from "./types";
import { LinksContent } from "./links-content";
import { Sidebar } from "./sidebar";
import { useFilterState } from "@/components/links/use-filter-state";
import { useCategories } from "@/components/link-categories";
import { loadAllLinksData } from "@/components/links/links-lib";

// 定义组件属性类型
interface OptimizedHomePageProps {
  initialData?: {
    items: LinksItem[];
    categories: Category[];
    totalItems: number;
    totalCategories: number;
  };
}

export const OptimizedHomePage = memo(({ initialData }: OptimizedHomePageProps) => {
  // 状态管理
  const [items, setItems] = useState<LinksItem[]>(initialData?.items || []);
  const [loading, setLoading] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);

  // 使用共享的分类数据 hook
  const { getFilteredCategories, getCategoryName } = useCategories();

  // 转换分类数据格式
  const categories: Category[] = useMemo(() => {
    // 如果有初始数据，优先使用初始数据中的分类
    if (initialData?.categories && initialData.categories.length > 0) {
      return initialData.categories as unknown as Category[];
    }

    // 使用与管理页面相同的分类逻辑
    const filteredCategories = getFilteredCategories();
    return filteredCategories.map((cat) => ({
      id: cat.id,
      name: getCategoryName(cat.id) || cat.name, // 使用 getCategoryName 获取显示名称
      children: cat.children?.map((child) => ({
        id: child.id,
        name: getCategoryName(child.id) || child.name, // 使用 getCategoryName 获取显示名称
      })),
    }));
  }, [getFilteredCategories, getCategoryName, initialData?.categories]);

  // 使用过滤后的数据进行状态管理
  const {
    filteredItems: categoryFilteredItems,
    selectedCategory,
    handleCategoryChange,
  } = useFilterState(items);

  // 处理分类点击事件
  const handleCategoryClick = (categoryId: string) => {
    console.log("处理分类点击事件:", categoryId);
    handleCategoryChange(categoryId);
  };

  // 分批加载数据 - 使用 useCallback 确保函数引用稳定
  const loadMoreData = useCallback(async () => {
    if (loading || !hasMoreData) {
      return;
    }

    try {
      setLoading(true);
      // 加载剩余的数据
      const allItems = await loadAllLinksData();

      // 如果初始数据存在，合并初始数据和新加载的数据
      if (initialData?.items && initialData.items.length > 0) {
        // 合并并去重
        const mergedItems = [...initialData.items, ...allItems];
        const uniqueItems = Array.from(
          new Map(mergedItems.map((item) => [item.id, item])).values()
        );
        setItems(uniqueItems);
      } else {
        setItems(allItems);
      }

      setHasMoreData(false);
    } catch (err) {
      console.error("数据加载失败:", err);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMoreData, initialData?.items]);

  // 在初始数据不足时自动加载更多数据
  useEffect(() => {
    if (initialData && initialData.totalItems > initialData.items.length) {
      // 如果初始数据不足，加载剩余数据
      loadMoreData();
    } else if (!initialData || initialData.items.length === 0) {
      // 如果没有初始数据，加载所有数据
      loadMoreData();
    }
  }, [initialData, loadMoreData]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4">
        {/* 12列网格布局 */}
        <div className="grid grid-cols-12 gap-4 sm:gap-6">
          {/* 左侧空列 */}
          <div className="hidden xl:col-span-2 xl:block"></div>

          {/* 主内容区域 */}
          <div className="col-span-12 xl:col-span-8">
            <div className="grid grid-cols-8 gap-4 sm:gap-6">
              {/* 左侧边栏 */}
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

              {/* 链接卡片区域 */}
              <div className="col-span-8 xl:col-span-6">
                <LinksContent items={categoryFilteredItems} selectedCategory={selectedCategory} />
              </div>
            </div>
          </div>

          {/* 右侧空列 */}
          <div className="hidden xl:col-span-2 xl:block"></div>
        </div>
      </div>
    </div>
  );
});

OptimizedHomePage.displayName = "OptimizedHomePage";
