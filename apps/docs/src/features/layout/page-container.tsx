"use client";

import { useLayoutStore } from "./layout-store.standard";
import { getContainerClassName } from "./layout-utils";
import type { PageContainerProps, SidebarConfig } from "./layout-types";
import { cn } from "@/utils";
import { ResponsiveGrid } from "./responsive-grid";
import { useEffect } from "react";

/**
 * 通用页面容器组件
 * 只支持双侧栏布局：左右侧栏各占2列，中间主内容区占8列
 */
export const PageContainer = ({
  children,
  config = {},
  sidebars = [],
  className = "",
}: PageContainerProps) => {
  const { layout = "double-sidebar" } = config;
  const containerClassName = getContainerClassName(config);

  // 检查是否在客户端环境
  const isClient = typeof window !== "undefined";

  // 始终调用 Zustand store，但在服务端返回默认值
  const store = useLayoutStore();
  const layoutType = isClient ? store.layoutType : layout;
  const storedSidebars = isClient ? store.sidebars : sidebars;

  // 同步 props 到 store，只在客户端且必要时更新
  useEffect(() => {
    if (!(isClient && store)) return;

    const { setLayoutType, setSidebars } = store;

    if (layoutType !== layout) {
      setLayoutType(layout);
    }

    // 比较 sidebars 数组是否相等
    const sidebarsEqual =
      storedSidebars.length === sidebars.length &&
      storedSidebars.every(
        (sb: SidebarConfig, index: number) => sb.position === sidebars[index]?.position
      );

    if (!sidebarsEqual) {
      setSidebars(sidebars);
    }
  }, [isClient, store, layout, sidebars, layoutType, storedSidebars]);

  // 使用网格布局
  return (
    <div className={cn(containerClassName, className)}>
      <div className="container mx-auto px-4">
        <ResponsiveGrid sidebars={sidebars} layoutType={layout}>
          {children}
        </ResponsiveGrid>
      </div>
    </div>
  );
};

export type { PageContainerProps } from "./layout-types";

export default PageContainer;
