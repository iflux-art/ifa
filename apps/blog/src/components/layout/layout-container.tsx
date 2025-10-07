"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";
import { getContainerClassName } from "@/lib/layout/layout-utils";
import { useLayoutStore } from "@/components/layout/layout-store";
import { cn } from "@/lib/utils";
import { SidebarWrapper } from "@/components/sidebar";
import {
  getMainContentClasses,
  getSidebarClasses,
} from "@/lib/layout/layout-utils";
import { THREE_COLUMN_LAYOUT_CONFIG } from "@/lib/layout/layout-utils";

/**
 * 页面布局类型枚举
 */
type PageLayoutType =
  | "narrow" // 窄布局：占中间的8列（友链、关于页面）
  | "double-sidebar" // 双侧栏布局：左右侧栏各占2列，中间主内容区占8列（博客列表、博客详情、文档详情页、导航页面）
  | "full-width"; // 宽布局：占满全部的12列（首页）

/**
 * 侧边栏配置接口
 */
interface SidebarConfig {
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
  position: "left" | "right";
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
  };
}

interface LayoutContainerProps {
  /**
   * 左侧边栏内容
   */
  leftSidebar?: ReactNode;
  /**
   * 主内容
   */
  children: ReactNode;
  /**
   * 右侧边栏内容
   */
  rightSidebar?: ReactNode;
  /**
   * 布局类型
   */
  layout?: PageLayoutType;
  /**
   * 自定义类名
   */
  className?: string;
}

/**
 * 统一布局容器组件
 * 提供三种不同的布局选项:
 *
 * 1. narrow: 窄布局，占中间的8列（友链、关于页面）
 * 2. double-sidebar: 双侧栏布局，左右侧栏各占2列，中间主内容区占8列（博客列表、博客详情、文档详情页、导航页面）
 * 3. full-width: 宽布局，占满全部的12列（首页）
 *
 * 使用示例:
 * ```tsx
 * <LayoutContainer
 *   leftSidebar={<LeftSidebar />}
 *   rightSidebar={<RightSidebar />}
 *   layout="double-sidebar"
 * >
 *   <MainContent />
 * </LayoutContainer>
 * ```
 */
export const LayoutContainer = ({
  leftSidebar,
  children,
  rightSidebar,
  layout = "double-sidebar",
  className = "",
}: LayoutContainerProps) => {
  // 检查是否在客户端环境
  const isClient = typeof window !== "undefined";

  // 始终调用 Zustand store，但在服务端返回默认值
  const store = useLayoutStore();

  // 修复水合不匹配问题：在服务端和客户端始终使用相同的 layout 值
  const layoutType = layout;

  // 同步 props 到 store，只在客户端且必要时更新
  useEffect(() => {
    if (!(isClient && store)) return;

    const { setLayoutType } = store;

    if (store.layoutType !== layout) {
      setLayoutType(layout);
    }
  }, [isClient, store, layout]);

  const containerClassName = getContainerClassName({ layout });

  // 根据布局类型渲染不同的容器
  if (layout === "full-width" && !leftSidebar && !rightSidebar) {
    // 宽布局：适用于首页
    return (
      <div className={cn(containerClassName, "w-full", className)}>
        <div className="container mx-auto px-4 py-4">{children}</div>
      </div>
    );
  }

  // 构建侧边栏配置
  const sidebars: SidebarConfig[] = [];

  // 左侧边栏配置 - 只在双侧栏布局中添加
  if (leftSidebar && layout === "double-sidebar") {
    sidebars.push({
      content: leftSidebar,
      position: "left",
      ...THREE_COLUMN_LAYOUT_CONFIG.leftSidebar,
    });
  }

  // 右侧边栏配置 - 只在双侧栏布局中添加
  if (rightSidebar && layout === "double-sidebar") {
    sidebars.push({
      content: rightSidebar,
      position: "right",
      ...THREE_COLUMN_LAYOUT_CONFIG.rightSidebar,
    });
  }

  const leftSidebars = sidebars.filter((s) => s.position === "left");
  const rightSidebars = sidebars.filter((s) => s.position === "right");

  return (
    <div className={cn(containerClassName, className)}>
      <div className="container mx-auto px-4">
        <div
          className={cn(
            "grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-12 md:gap-6 lg:gap-8 xl:gap-10",
            layoutType === "narrow" ? "py-4 lg:py-6" : "py-6 lg:py-8",
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
      </div>
    </div>
  );
};

export type { LayoutContainerProps };
export default LayoutContainer;
