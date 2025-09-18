import type { ReactNode } from "react";
import { SidebarWrapper } from "@/features/sidebar";
import { cn } from "@/lib/utils";
import { useLayoutStore } from "./layout-store.standard";
import type { PageLayoutType, SidebarConfig } from "./layout-types";
import { getMainContentClasses, getSidebarClasses } from "./layout-utils";

export interface ResponsiveGridProps {
  /**
   * 网格内容
   */
  children: ReactNode;
  /**
   * 侧边栏配置
   */
  sidebars: SidebarConfig[];
  /**
   * 手动指定布局类型（可选）
   */
  layoutType?: PageLayoutType;
  /**
   * 自定义类名
   */
  className?: string;
}

/**
 * 响应式网格布局组件
 * 只支持双侧栏布局：左右侧栏各占2列，主内容占8列
 */
export const ResponsiveGrid = ({
  children,
  sidebars,
  layoutType: propLayoutType,
  className = "",
}: ResponsiveGridProps) => {
  const { layoutType: storeLayoutType } = useLayoutStore();

  // 优先使用传入的布局类型，否则使用 store 中的类型
  const layoutType = propLayoutType || storeLayoutType;

  const leftSidebars = sidebars.filter((s) => s.position === "left");
  const rightSidebars = sidebars.filter((s) => s.position === "right");

  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-12 md:gap-6 lg:gap-8 xl:gap-10",
        "py-6 lg:py-8", // 只保留双侧栏布局的内边距
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

// 为了向后兼容，保留ThreeColumnGrid的导出
export const ThreeColumnGrid = ResponsiveGrid;
