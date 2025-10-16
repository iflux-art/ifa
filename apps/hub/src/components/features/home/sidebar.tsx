/**
 * 侧边栏组件
 * 重构并优化的分类导航组件，提升渲染性能
 */

"use client";

import { ChevronRight, Folder } from "lucide-react";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { SidebarProps } from "./types";

export const Sidebar = memo(({ categories, selectedCategory, onCategoryChange }: SidebarProps) => {
  // 管理折叠状态
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({});

  // 初始化折叠状态 - 默认展开所有有子分类的分类
  useEffect(() => {
    const initialState: Record<string, boolean> = {};
    categories.forEach((category) => {
      if (category.children && category.children.length > 0) {
        initialState[category.id] = true;
      }
    });
    setOpenCategories(initialState);
  }, [categories]);

  // 处理折叠状态切换
  const handleToggle = useCallback((categoryId: string) => {
    setOpenCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  }, []);

  // 处理分类点击
  const handleCategoryClick = useCallback(
    (categoryId: string) => {
      // 如果点击的是当前选中的分类，则取消选择
      if (selectedCategory === categoryId) {
        onCategoryChange("");
      } else {
        onCategoryChange(categoryId);
      }
    },
    [selectedCategory, onCategoryChange]
  );

  // 处理显示全部
  const handleShowAll = useCallback(() => {
    onCategoryChange("");
  }, [onCategoryChange]);

  // 渲染分类项
  const renderCategoryItem = useCallback(
    (category: (typeof categories)[0]) => {
      const hasChildren = category.children && category.children.length > 0;
      const isSelected = selectedCategory === category.id;
      const isOpen = openCategories[category.id] ?? true;

      return (
        <div key={category.id}>
          <button
            type="button"
            onClick={() => {
              if (hasChildren) {
                handleToggle(category.id);
              } else {
                handleCategoryClick(category.id);
              }
            }}
            className={cn(
              "flex min-h-[44px] w-full touch-manipulation items-center gap-2 rounded-md px-2.5 py-2.5 text-left text-sm transition-colors sm:min-h-[36px] sm:px-3 sm:py-2",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              isSelected
                ? "bg-primary font-medium text-primary-foreground"
                : "text-muted-foreground hover:bg-muted/60 hover:text-foreground active:bg-muted/80"
            )}
          >
            <Folder className="h-3.5 w-3.5" />
            <span className="flex-1">{category.name}</span>
            {hasChildren && (
              <ChevronRight
                className={cn(
                  "h-3.5 w-3.5 transition-transform duration-200",
                  isOpen && "rotate-90"
                )}
              />
            )}
          </button>

          {/* 子分类 */}
          {hasChildren && isOpen && (
            <div className="mt-1 ml-4 space-y-1 border-border border-l pl-3">
              {category.children?.map((subCategory) => (
                <button
                  key={subCategory.id}
                  type="button"
                  onClick={() => handleCategoryClick(subCategory.id)}
                  className={cn(
                    "flex min-h-[36px] w-full touch-manipulation items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-muted-foreground text-sm transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    selectedCategory === subCategory.id
                      ? "bg-primary font-medium text-primary-foreground"
                      : "hover:bg-muted/60 hover:text-foreground active:bg-muted/80"
                  )}
                >
                  <span className="flex-1">{subCategory.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      );
    },
    [selectedCategory, openCategories, handleToggle, handleCategoryClick]
  );

  // 使用 useMemo 缓存渲染结果
  const categoryItems = useMemo(() => {
    return categories.map(renderCategoryItem);
  }, [categories, renderCategoryItem]);

  return (
    <Card className="w-full transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10">
      <CardContent className="pt-4 pb-4">
        <div className="hide-scrollbar max-h-[calc(100vh-12rem)] space-y-1.5 overflow-y-auto sm:max-h-[calc(100vh-12rem)] sm:space-y-2">
          {/* 全部分类选项 */}
          <button
            type="button"
            onClick={handleShowAll}
            className={cn(
              "flex min-h-[44px] w-full touch-manipulation items-center gap-2 rounded-md px-2.5 py-2.5 text-left text-sm transition-colors sm:min-h-[36px] sm:px-3 sm:py-2",
              selectedCategory
                ? "text-muted-foreground hover:bg-muted/60 hover:text-foreground active:bg-muted/80"
                : "bg-primary font-medium text-primary-foreground"
            )}
          >
            <Folder className="h-3.5 w-3.5" />
            <span className="flex-1">全部分类</span>
          </button>

          {/* 分类列表 */}
          {categoryItems}
        </div>
      </CardContent>
    </Card>
  );
});

Sidebar.displayName = "Sidebar";
