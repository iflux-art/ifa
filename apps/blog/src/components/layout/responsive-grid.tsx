import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useLayoutStore } from "@/stores";
import type { PageLayoutType, SidebarConfig } from "@/types";

// 侧边栏默认配置常量
const DEFAULT_SIDEBAR_CONFIG = {
  sticky: true,
  stickyTop: "80px",
  maxHeight: "calc(100vh - 5rem - env(safe-area-inset-bottom))",
  responsive: {
    hideOnMobile: true,
    hideOnTablet: false,
    hideOnDesktop: false,
  },
} as const;

// 响应式类名配置表
const RESPONSIVE_CLASS_MAP: Record<number, string> = {
  0: "block", // 000: 全部显示
  1: "lg:hidden xl:block", // 001: PC隐藏，移动端、平板和大屏显示
  2: "md:hidden xl:block", // 010: 平板隐藏，移动端和大屏显示
  3: "md:hidden", // 011: 平板和PC隐藏，移动端和大屏显示
  4: "hidden md:block", // 100: 移动端隐藏，平板及以上显示
  5: "hidden md:block lg:hidden xl:block", // 101: 移动端隐藏，平板显示，PC隐藏，大屏显示
  6: "hidden xl:block", // 110: 移动端和平板隐藏，大屏显示
  7: "hidden", // 111: 全部隐藏
};

/**
 * 响应式类名生成函数
 * 根据不同设备尺寸生成对应的显示/隐藏类名
 */
function getResponsiveClasses(
  mobile: boolean,
  tablet: boolean,
  desktop: boolean,
): string {
  // 使用位运算生成索引：移动端(bit 2) + 平板(bit 1) + PC(bit 0)
  const index =
    (mobile ? 0b100 : 0) | (tablet ? 0b010 : 0) | (desktop ? 0b001 : 0);
  return RESPONSIVE_CLASS_MAP[index] || "block";
}

/**
 * 侧边栏包装组件
 * 处理粘性定位和响应式显示
 */
const SidebarWrapper = ({
  children,
  config,
}: {
  children: ReactNode;
  config: SidebarConfig;
}) => {
  const {
    sticky = DEFAULT_SIDEBAR_CONFIG.sticky,
    stickyTop = DEFAULT_SIDEBAR_CONFIG.stickyTop,
    maxHeight = DEFAULT_SIDEBAR_CONFIG.maxHeight,
    responsive = DEFAULT_SIDEBAR_CONFIG.responsive,
  } = config;

  const {
    hideOnMobile = DEFAULT_SIDEBAR_CONFIG.responsive.hideOnMobile,
    hideOnTablet = DEFAULT_SIDEBAR_CONFIG.responsive.hideOnTablet,
    hideOnDesktop = DEFAULT_SIDEBAR_CONFIG.responsive.hideOnDesktop,
  } = responsive;

  const sidebarClasses = cn(
    "hide-scrollbar overflow-y-auto",
    sticky && "sticky",
    getResponsiveClasses(hideOnMobile, hideOnTablet, hideOnDesktop),
  );

  const sidebarStyle = sticky
    ? {
        top: stickyTop,
        maxHeight,
      }
    : {
        maxHeight,
      };

  return (
    <aside className={sidebarClasses} style={sidebarStyle}>
      <div className="space-y-4">{children}</div>
    </aside>
  );
};

interface ResponsiveGridProps {
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
 * 获取主内容区域的响应式类名
 * 只保留双侧栏布局：左右侧栏各占2列，主内容占8列
 */
function getMainContentClasses(_layout: PageLayoutType): string {
  const baseClasses = "min-w-0";

  // 只保留双侧栏布局：左右侧栏各占2列，主内容占8列
  return `${baseClasses} md:col-span-8 lg:col-span-8 xl:col-span-8 md:col-start-3 lg:col-start-3 xl:col-start-3`;
}

/**
 * 获取侧边栏的响应式类名
 * 根据侧边栏位置返回相应的类名
 */
function getSidebarClasses(
  position: "left" | "right",
  _layout: PageLayoutType,
): string {
  // 只保留双侧栏布局：左右侧栏各占2列
  if (position === "left") {
    return "md:col-span-2 lg:col-span-2 xl:col-span-2 md:col-start-1 lg:col-start-1 xl:col-start-1";
  }
  return "md:col-span-2 lg:col-span-2 xl:col-span-2 md:col-start-11 lg:col-start-11 xl:col-start-11";
}

/**
 * 响应式网格布局组件
 * 支持三种布局类型：
 * 1. narrow: 窄布局，主内容占8列
 * 2. double-sidebar: 双侧栏布局，左右侧栏各占2列，主内容占8列
 * 3. full-width: 宽布局，主内容占满12列
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
        layoutType === "narrow" ? "py-4 lg:py-6" : "py-6 lg:py-8",
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
