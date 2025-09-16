import type { ReactNode } from "react";
import type { SidebarConfig } from "./layout-types";
import { THREE_COLUMN_LAYOUT_CONFIG } from "./layout-utils";
import { PageContainer } from "./page-container";

export interface ThreeColumnLayoutProps {
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
   * 自定义类名
   */
  className?: string;
}

/**
 * 三栏布局组件
 * 提供默认的三栏布局：左右侧栏各占3列，中间主内容区占6列
 */
export const ThreeColumnLayout = ({
  leftSidebar,
  children,
  rightSidebar,
  className = "",
}: ThreeColumnLayoutProps) => {
  const sidebars: SidebarConfig[] = [];

  // 左侧边栏配置
  if (leftSidebar) {
    sidebars.push({
      content: leftSidebar,
      position: "left",
      ...THREE_COLUMN_LAYOUT_CONFIG.leftSidebar,
    });
  }

  // 右侧边栏配置
  if (rightSidebar) {
    sidebars.push({
      content: rightSidebar,
      position: "right",
      ...THREE_COLUMN_LAYOUT_CONFIG.rightSidebar,
    });
  }

  return (
    <PageContainer
      config={{ layout: "double-sidebar" }}
      sidebars={sidebars}
      className={className}
    >
      {children}
    </PageContainer>
  );
};
