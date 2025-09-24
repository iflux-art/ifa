"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

// 定义布局类型
export type PageLayoutType =
  | "full-width" // 宽布局：占满12列
  | "narrow" // 窄布局：居中8列
  | "three-column" // 三栏布局：2 + 8 + 2列
  | "two-column"; // 双栏布局：2 + 10列

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
 * 移动优先设计：
 * - 默认（移动设备）：1列
 * - sm（小平板）：8列居中
 * - md（平板）：8列居中
 * - lg（PC）：根据布局类型调整
 * - xl（大屏）：根据布局类型调整
 */
export function getMainContentClasses(layout: PageLayoutType): string {
  const baseClasses = "min-w-0";

  switch (layout) {
    case "narrow":
      // 窄布局：移动端1列，平板及以上8列居中
      return `${baseClasses} col-span-1 sm:col-span-8 sm:col-start-3 md:col-span-8 md:col-start-3 lg:col-span-8 lg:col-start-3 xl:col-span-8 xl:col-start-3`;
    case "three-column":
      // 三栏布局：移动端1列，平板及以上8列居中
      return `${baseClasses} col-span-1 sm:col-span-8 sm:col-start-3 md:col-span-8 md:col-start-3 lg:col-span-8 lg:col-start-3 xl:col-span-8 xl:col-start-3`;
    case "two-column":
      // 双栏布局：移动端1列，平板及以上10列
      return `${baseClasses} col-span-1 sm:col-span-10 sm:col-start-2 md:col-span-10 md:col-start-2 lg:col-span-10 lg:col-start-2 xl:col-span-10 xl:col-start-2`;
    default:
      // 宽布局：移动端1列，平板及以上12列
      return `${baseClasses} col-span-1 sm:col-span-12 md:col-span-12 lg:col-span-12 xl:col-span-12`;
  }
}

/**
 * 获取侧边栏的响应式类名
 * 移动优先设计：
 * - 默认（移动设备）：隐藏
 * - sm（小平板）：根据布局类型显示
 * - md（平板）：根据布局类型显示
 * - lg（PC）：根据布局类型显示
 * - xl（大屏）：根据布局类型显示
 */
export function getSidebarClasses(
  position: SidebarPosition,
  layout: PageLayoutType,
): string {
  switch (layout) {
    case "narrow":
      // 窄布局不显示侧边栏
      return "hidden";
    case "three-column":
      // 三栏布局：移动端隐藏，平板及以上显示
      if (position === "left") {
        return "hidden sm:col-span-2 sm:col-start-1 md:col-span-2 md:col-start-1 lg:col-span-2 lg:col-start-1 xl:col-span-2 xl:col-start-1";
      } else {
        return "hidden sm:col-span-2 sm:col-start-11 md:col-span-2 md:col-start-11 lg:col-span-2 lg:col-start-11 xl:col-span-2 xl:col-start-11";
      }
    case "two-column":
      // 双栏布局：移动端隐藏，平板及以上显示
      if (position === "left") {
        return "hidden sm:col-span-2 sm:col-start-1 md:col-span-2 md:col-start-1 lg:col-span-2 lg:col-start-1 xl:col-span-2 xl:col-start-1";
      }
      // 右侧栏在双栏布局中不显示
      return "hidden";
    default:
      // 宽布局不显示侧边栏
      return "hidden";
  }
}

/**
 * 侧边栏包装组件
 */
const SidebarWrapper = ({
  config,
  children,
}: {
  config: SidebarConfig;
  children: ReactNode;
}) => {
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
    <div
      className={cn(
        "space-y-6",
        sticky && "sticky",
        sticky && `top-[${stickyTop}]`,
        maxHeight !== "none" && `max-h-[${maxHeight}]`,
        responsiveClasses,
      )}
    >
      {children}
    </div>
  );
};

/**
 * 统一网格布局组件
 * 支持四种布局类型：
 * 1. full-width: 宽布局，主内容占满12列
 * 2. narrow: 窄布局，主内容占8列，居中显示
 * 3. three-column: 三栏布局，左右侧栏各占2列，主内容占8列
 * 4. two-column: 双栏布局，左侧栏占2列，主内容占10列
 *
 * 响应式断点设计：
 * - 默认（移动设备）：< 640px
 * - sm（小平板）：≥ 640px
 * - md（平板）：≥ 768px
 * - lg（PC）：≥ 1024px
 * - xl（大屏）：≥ 1280px
 */
export const GridLayout = ({
  children,
  sidebars = [],
  layoutType = "full-width",
  className = "",
}: GridLayoutProps) => {
  const leftSidebars = sidebars.filter((s) => s.position === "left");
  const rightSidebars = sidebars.filter((s) => s.position === "right");

  return (
    <div
      className={cn(
        "container mx-auto grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-12 md:gap-6 lg:gap-8 xl:gap-10 px-4 py-6 lg:py-8",
        className,
      )}
    >
      {/* 左侧边栏区域 */}
      {leftSidebars.length > 0 && (
        <div className={getSidebarClasses("left", layoutType)}>
          {leftSidebars.map((sidebar, index) => (
            <SidebarWrapper
              key={sidebar.id || `left-${index}`}
              config={sidebar}
            >
              {sidebar.content}
            </SidebarWrapper>
          ))}
        </div>
      )}

      {/* 主内容区域 */}
      <main className={getMainContentClasses(layoutType)}>{children}</main>

      {/* 右侧边栏区域 */}
      {rightSidebars.length > 0 && (
        <div className={getSidebarClasses("right", layoutType)}>
          {rightSidebars.map((sidebar, index) => (
            <SidebarWrapper
              key={sidebar.id || `right-${index}`}
              config={sidebar}
            >
              {sidebar.content}
            </SidebarWrapper>
          ))}
        </div>
      )}
    </div>
  );
};
