"use client";

import { gridColsMap, gridGapMap } from "@/lib/layout/responsive-utils";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

/**
 * AppGrid 相关类型定义
 */
interface AppGridProps {
  children?: ReactNode;
  className?: string;
  columns?: 1 | 2 | 3 | 4 | 5;
  gap?: "small" | "default" | "large";
  rowGap?: string; // 新增：行间距
  columnGap?: string; // 新增：列间距
}

/**
 * 通用网格布局组件
 * 用于创建响应式的网格布局
 *
 * 支持 1-5 列的配置，自动根据屏幕尺寸调整
 * - 1列：全尺寸下都是1列
 * - 2列：移动端1列，其他2列
 * - 3列：移动端1列，平板2列，桌面3列
 * - 4列：移动端1列，平板2列，桌面和大屏3列
 * - 5列：移动端1列，平板2列，桌面3列
 */
export const AppGrid = ({
  children,
  className,
  columns = 3,
  gap = "default",
  rowGap,
  columnGap,
}: AppGridProps) => {
  // 构建行列间距类
  const gapClasses =
    rowGap || columnGap
      ? cn(
          rowGap && `row-gap-${rowGap}`,
          columnGap && `column-gap-${columnGap}`,
        )
      : gridGapMap[gap];

  return (
    <div className={cn("grid", gridColsMap[columns], gapClasses, className)}>
      {children}
    </div>
  );
};
