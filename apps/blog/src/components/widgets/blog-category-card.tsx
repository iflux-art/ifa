"use client";

import { Folder } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// 内联 CategoryWithCount 类型定义
export interface CategoryWithCount {
  name: string;
  count: number;
}

import { cn } from "@/lib/utils";

export interface BlogCategoryCardProps {
  // 原有的分类列表方式
  categories?: CategoryWithCount[];
  selectedCategory?: string;
  onCategoryClick?: (category: string | null) => void;

  // 单个分类显示方式（用于文章页面）
  category?: string;
  title?: string;
  // description?: string;
  // href?: string;

  className?: string;
  /**
   * 是否启用路由功能
   * @default false
   */
  enableRouting?: boolean;
  /**
   * 是否显示标题栏
   * @default true
   */
  showHeader?: boolean;
}

/**
 * 博客分类卡片组件
 *
 * 以卡片形式显示博客分类，支持两种模式：
 * 1. 分类列表模式：显示所有分类，支持点击筛选
 * 2. 单个分类模式：显示当前文章的分类
 */
export const BlogCategoryCard = ({
  // 分类列表模式参数
  categories = [],
  selectedCategory,
  onCategoryClick,

  // 单个分类模式参数
  category,
  title,
  // 移除未使用的参数
  // description,
  // href,

  className,
  enableRouting = false,
  showHeader = true,
}: BlogCategoryCardProps) => {
  const router = useRouter();

  // 判断使用哪种模式
  const isSingleCategoryMode = !!category;

  // 分类列表模式：按文章数量降序排列分类
  const sortedCategories = React.useMemo(
    () => [...categories].sort((a, b) => b.count - a.count),
    [categories],
  );

  const handleClick = (category: string | null) => {
    if (enableRouting) {
      if (category) {
        router.push(`/posts?category=${encodeURIComponent(category)}`);
      } else {
        router.push("/posts");
      }
    }
    onCategoryClick?.(category);
  };

  return (
    <Card className={cn("w-full", className)}>
      {showHeader && (
        <CardHeader className="pt-4 pb-2">
          <CardTitle className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Folder className="h-3.5 w-3.5 text-primary" />
            {isSingleCategoryMode ? title || "分类" : "分类"}
          </CardTitle>
        </CardHeader>
      )}
      <CardContent className={showHeader ? "pt-0 pb-4" : "py-4"}>
        {isSingleCategoryMode ? (
          // 单个分类模式
          <div className="flex min-h-[44px] items-center gap-2 rounded-md bg-primary px-3 py-2.5 text-primary-foreground sm:min-h-[44px]">
            <Folder className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="flex-1 font-medium truncate">{category}</span>
          </div>
        ) : (
          // 分类列表模式
          <div className="hide-scrollbar max-h-[250px] space-y-1.5 overflow-y-auto sm:max-h-[300px] sm:space-y-2">
            {sortedCategories.map((categoryItem) => {
              const isSelected = selectedCategory === categoryItem.name;
              return (
                <button
                  key={categoryItem.name}
                  type="button"
                  onClick={() =>
                    handleClick(isSelected ? null : categoryItem.name)
                  }
                  className={cn(
                    "flex min-h-[44px] w-full touch-manipulation items-center gap-2 rounded-md px-2.5 py-2.5 text-left text-sm transition-colors sm:min-h-[36px] sm:px-3 sm:py-2",
                    isSelected
                      ? "bg-primary font-medium text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground active:bg-muted/80",
                  )}
                >
                  <Folder className="h-3.5 w-3.5" />
                  <span className="flex-1">
                    {categoryItem.name}{" "}
                    <span className="text-xs opacity-70">
                      ({categoryItem.count})
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
