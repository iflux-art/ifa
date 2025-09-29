"use client";

import type { ReactNode } from "react";
import { memo, useMemo } from "react";
import { cn } from "@/lib/utils";

// 定义布局类型
export type PageLayoutType =
  | "full-width" // 全宽布局：占满12列
  | "centered" // 居中布局：居中8列
  | "three-column" // 三栏布局：2 + 8 + 2列
  | "sidebar-left" // 左侧边栏布局：2 + 10列
  | "sidebar-right" // 右侧边栏布局：0 + 10 + 2列
  | "asymmetric" // 不对称布局：3 + 6 + 3列或其他非对称组合
  | "full-screen"; // 全屏布局：占满整个视口

// 侧边栏位置
export type SidebarPosition = "left" | "right";

// 侧边栏配置
export interface SidebarConfig {
  /**
   * 侧边栏唯一标识符（可选）
   */
  id?: string;
  /**
   * 侧边栏内容
   */
  content: ReactNode;
  /**
   * 侧边栏位置
   */
  position: SidebarPosition;
  /**
   * 是否粘性定位
   */
  sticky?: boolean;
  /**
   * 粘性定位的top值
   */
  stickyTop?: string;
  /**
   * 最大高度
   */
  maxHeight?: string;
  /**
   * 响应式显示设置
   */
  responsive?: {
    hideOnMobile?: boolean;
    hideOnTablet?: boolean;
    hideOnDesktop?: boolean;
    hideOnLargeScreen?: boolean;
  };
}

// 网格布局组件属性
export interface GridLayoutProps {
  /**
   * 网格内容
   */
  children: ReactNode;
  /**
   * 侧边栏配置
   */
  sidebars?: SidebarConfig[];
  /**
   * 布局类型
   */
  layoutType?: PageLayoutType;
  /**
   * 自定义类名
   */
  className?: string;
}

/**
 * 获取主内容区域的响应式类名
 * 移动优先设计，符合2025年主流设备尺寸：
 * - xs（超小设备）：≥ 475px
 * - 默认（移动设备）：< 640px
 * - sm（小平板）：≥ 640px
 * - md（平板）：≥ 768px
 * - lg（PC）：≥ 1024px
 * - xl（大屏）：≥ 1280px
 * - 2xl（超大屏）：≥ 1536px
 */
export function getMainContentClasses(layout: PageLayoutType): string {
  const baseClasses = "min-w-0";

  switch (layout) {
    case "centered":
      // 居中布局：移动端1列，平板及以上8列居中
      return `${baseClasses} col-span-1 xs:col-span-1 sm:col-span-8 sm:col-start-3 md:col-span-8 md:col-start-3 lg:col-span-8 lg:col-start-3 xl:col-span-8 xl:col-start-3 2xl:col-span-8 2xl:col-start-3`;
    case "three-column":
      // 三栏布局：移动端1列，平板及以上8列居中
      return `${baseClasses} col-span-1 xs:col-span-1 sm:col-span-8 sm:col-start-3 md:col-span-8 md:col-start-3 lg:col-span-8 lg:col-start-3 xl:col-span-8 xl:col-start-3 2xl:col-span-8 2xl:col-start-3`;
    case "sidebar-right":
      // 右侧边栏：移动端1列，平板及以上10列（从第1列开始）
      return `${baseClasses} col-span-1 xs:col-span-1 sm:col-span-10 md:col-span-10 lg:col-span-10 xl:col-span-10 2xl:col-span-10`;
    case "sidebar-left":
      // 左侧边栏：移动端1列，平板及以上10列
      return `${baseClasses} col-span-1 xs:col-span-1 sm:col-span-10 sm:col-start-2 md:col-span-10 md:col-start-2 lg:col-span-10 lg:col-start-2 xl:col-span-10 xl:col-start-2 2xl:col-span-10 2xl:col-start-2`;
    case "asymmetric":
      // 不对称布局：移动端1列，平板及以上8列（从第2列开始）
      return `${baseClasses} col-span-1 xs:col-span-1 sm:col-span-8 sm:col-start-2 md:col-span-8 md:col-start-2 lg:col-span-6 lg:col-start-4 xl:col-span-6 xl:col-start-4 2xl:col-span-6 2xl:col-start-4`;
    case "full-screen":
      // 全屏布局：占满整个视口
      return `${baseClasses} col-span-1 xs:col-span-1 sm:col-span-12 md:col-span-12 lg:col-span-12 xl:col-span-12 2xl:col-span-12 w-full h-screen`;
    default:
      // 全宽布局：移动端1列，平板及以上12列
      return `${baseClasses} col-span-1 xs:col-span-1 sm:col-span-12 md:col-span-12 lg:col-span-12 xl:col-span-12 2xl:col-span-12`;
  }
}

/**
 * 获取侧边栏的响应式类名
 * 移动优先设计，符合2025年主流设备尺寸：
 * - xs（超小设备）：≥ 475px
 * - 默认（移动设备）：< 640px
 * - sm（小平板）：≥ 640px
 * - md（平板）：≥ 768px
 * - lg（PC）：≥ 1024px
 * - xl（大屏）：≥ 1280px
 * - 2xl（超大屏）：≥ 1536px
 */
export function getSidebarClasses(
  position: SidebarPosition,
  layout: PageLayoutType,
): string {
  switch (layout) {
    case "centered":
      // 居中布局不显示侧边栏
      return "hidden";
    case "three-column":
      // 三栏布局：移动端隐藏，平板及以上显示
      if (position === "left") {
        return "hidden xs:hidden sm:col-span-2 sm:col-start-1 md:col-span-2 md:col-start-1 lg:col-span-2 lg:col-start-1 xl:col-span-2 xl:col-start-1 2xl:col-span-2 2xl:col-start-1";
      } else {
        return "hidden xs:hidden sm:col-span-2 sm:col-start-11 md:col-span-2 md:col-start-11 lg:col-span-2 lg:col-start-11 xl:col-span-2 xl:col-start-11 2xl:col-span-2 2xl:col-start-11";
      }
    case "sidebar-right":
      // 右侧边栏：只显示右侧边栏
      if (position === "left") {
        // 左侧边栏不显示
        return "hidden";
      } else {
        // 右侧边栏：移动端隐藏，平板及以上显示，从第11列开始
        return "hidden xs:hidden sm:col-span-2 sm:col-start-11 md:col-span-2 md:col-start-11 lg:col-span-2 lg:col-start-11 xl:col-span-2 xl:col-start-11 2xl:col-span-2 2xl:col-start-11";
      }
    case "sidebar-left":
      // 左侧边栏：移动端隐藏，平板及以上显示
      if (position === "left") {
        return "hidden xs:hidden sm:col-span-2 sm:col-start-1 md:col-span-2 md:col-start-1 lg:col-span-2 lg:col-start-1 xl:col-span-2 xl:col-start-1 2xl:col-span-2 2xl:col-start-1";
      }
      // 右侧栏在左侧边栏布局中不显示
      return "hidden";
    case "asymmetric":
      // 不对称布局：移动端隐藏，平板及以上显示
      if (position === "left") {
        return "hidden xs:hidden sm:col-span-1 sm:col-start-1 md:col-span-1 md:col-start-1 lg:col-span-3 lg:col-start-1 xl:col-span-3 xl:col-start-1 2xl:col-span-3 2xl:col-start-1";
      } else {
        return "hidden xs:hidden sm:col-span-1 sm:col-start-11 md:col-span-1 md:col-start-11 lg:col-span-3 lg:col-start-11 xl:col-span-3 xl:col-start-11 2xl:col-span-3 2xl:col-start-11";
      }
    case "full-screen":
      // 全屏布局不显示侧边栏
      return "hidden";
    default:
      // 全宽布局不显示侧边栏
      return "hidden";
  }
}

/**
 * 侧边栏包装组件
 */
const SidebarWrapper = memo(
  ({ config, children }: { config: SidebarConfig; children: ReactNode }) => {
    const {
      sticky = false,
      stickyTop = "0px",
      maxHeight = "none",
      responsive,
    } = config;

    // 响应式类名
    let responsiveClasses = "";
    if (responsive) {
      const { hideOnMobile, hideOnTablet, hideOnDesktop, hideOnLargeScreen } =
        responsive;
      if (hideOnMobile) responsiveClasses += " max-sm:hidden";
      if (hideOnTablet) responsiveClasses += " sm:max-md:hidden";
      if (hideOnDesktop) responsiveClasses += " md:max-lg:hidden";
      if (hideOnLargeScreen) responsiveClasses += " lg:max-xl:hidden";
    }

    return (
      <aside
        className={cn(
          "space-y-6",
          sticky && "sticky",
          sticky && `top-[${stickyTop}]`,
          maxHeight !== "none" && `max-h-[${maxHeight}]`,
          responsiveClasses,
        )}
      >
        {children}
      </aside>
    );
  },
);

// 为 memo 添加显示名称
SidebarWrapper.displayName = "SidebarWrapper";

/**
 * 统一网格布局组件
 * 支持七种布局类型：
 * 1. full-width: 全宽布局，主内容占满12列
 * 2. centered: 居中布局，主内容占8列，居中显示
 * 3. three-column: 三栏布局，左右侧栏各占2列，主内容占8列
 * 4. sidebar-left: 左侧边栏布局，左侧栏占2列，主内容占10列
 * 5. sidebar-right: 右侧边栏布局，主内容占10列，右侧栏占2列
 * 6. asymmetric: 不对称布局，左右侧栏各占3列，主内容占6列，创造视觉层次
 * 7. full-screen: 全屏布局，占满整个视口，适合展示型页面
 *
 * 响应式断点设计（符合2025年主流设备尺寸）：
 * - 默认（移动设备）：< 640px
 * - sm（小平板）：≥ 640px
 * - md（平板）：≥ 768px
 * - lg（PC）：≥ 1024px
 * - xl（大屏）：≥ 1280px
 * - 2xl（超大屏）：≥ 1536px
 *
 * 垂直内边距规范：
 * - 基础为py-6
 * - lg及以上断点为lg:py-8
 * - 确保不同布局在各尺寸下的视觉一致性
 *
 * 2025年设计趋势适配：
 * - 支持不对称网格布局，创造视觉层次
 * - 支持全屏布局，充分利用屏幕空间
 * - 响应式设计适配各种屏幕尺寸
 * - 语义化标签提升可访问性
 */
export const GridLayout = ({
  children,
  sidebars = [],
  layoutType = "full-width",
  className = "",
}: GridLayoutProps) => {
  // 类型保护
  const validLayoutType = [
    "full-width",
    "centered",
    "three-column",
    "sidebar-left",
    "sidebar-right",
    "asymmetric",
    "full-screen",
  ].includes(layoutType)
    ? layoutType
    : "full-width";

  const leftSidebars = sidebars.filter((s) => s.position === "left");
  const rightSidebars = sidebars.filter((s) => s.position === "right");

  // 使用 useMemo 优化类名计算
  // 优化间距系统：gap-4 (默认) → sm:gap-6 → md:gap-6 → lg:gap-8 → xl:gap-10 → 2xl:gap-12
  const containerClasses = useMemo(
    () =>
      cn(
        "container mx-auto grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-12 md:gap-6 lg:gap-8 xl:gap-10 2xl:gap-12 px-4 py-6 lg:py-8",
        className,
      ),
    [className],
  );

  // 使用 useMemo 优化主内容区域类名计算
  const mainContentClasses = useMemo(
    () => getMainContentClasses(validLayoutType),
    [validLayoutType],
  );

  // 使用 useMemo 优化侧边栏类名计算
  const leftSidebarClasses = useMemo(
    () => getSidebarClasses("left", validLayoutType),
    [validLayoutType],
  );
  const rightSidebarClasses = useMemo(
    () => getSidebarClasses("right", validLayoutType),
    [validLayoutType],
  );

  return (
    <div className={containerClasses}>
      {/* 左侧边栏区域 - 使用语义化的<aside>标签提升可访问性 */}
      {leftSidebars.length > 0 && (
        <aside className={leftSidebarClasses} aria-label="左侧边栏">
          {leftSidebars.map((sidebar, index) => (
            <SidebarWrapper
              key={sidebar.id || `left-${index}`}
              config={sidebar}
            >
              {sidebar.content}
            </SidebarWrapper>
          ))}
        </aside>
      )}

      {/* 主内容区域 - 使用语义化的<main>标签提升可访问性 */}
      <main className={mainContentClasses}>{children}</main>

      {/* 右侧边栏区域 - 使用语义化的<aside>标签提升可访问性 */}
      {rightSidebars.length > 0 && (
        <aside className={rightSidebarClasses} aria-label="右侧边栏">
          {rightSidebars.map((sidebar, index) => (
            <SidebarWrapper
              key={sidebar.id || `right-${index}`}
              config={sidebar}
            >
              {sidebar.content}
            </SidebarWrapper>
          ))}
        </aside>
      )}
    </div>
  );
};
