/**
 * CSS 辅助工具
 * 提供常用的 CSS 类组合，减少重复代码
 */

import { cn } from "./core";

/**
 * 布局相关的 CSS 类组合
 */
export const layoutClasses = {
  container: "container mx-auto px-4",
  flexCenter: "flex items-center justify-center",
  gridResponsive: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
  section: "py-16",
  card: "p-4",
  content: "p-6",
} as const;

/**
 * 动画相关的 CSS 类组合
 */
export const animationClasses = {
  spin: "animate-spin",
  pulse: "animate-pulse",
  transition: "transition-all duration-300",
  hoverScale: "hover:scale-[1.01]",
  hoverBorder: "hover:border-primary/50",
} as const;

/**
 * 图标相关的 CSS 类组合
 */
export const iconClasses = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
  xl: "h-12 w-12",
} as const;

/**
 * 按钮相关的 CSS 类组合
 */
export const buttonClasses = {
  icon: "h-9 w-9",
  sm: "h-8",
  md: "h-9",
  lg: "h-10",
} as const;

/**
 * 文本相关的 CSS 类组合
 */
export const textClasses = {
  muted: "text-muted-foreground",
  primary: "text-primary",
  foreground: "text-foreground",
  sm: "text-sm",
  lg: "text-lg",
  truncate: "truncate",
  center: "text-center",
} as const;

/**
 * 间距相关的 CSS 类组合
 */
export const spacingClasses = {
  p4: "p-4",
  p6: "p-6",
  px4: "px-4",
  py4: "py-4",
  py16: "py-16",
  mb1: "mb-1",
  mb2: "mb-2",
  mb3: "mb-3",
  mb4: "mb-4",
  mr2: "mr-2",
  mr4: "mr-4",
  mt2: "mt-2",
  gap2: "gap-2",
  gap6: "gap-6",
} as const;

/**
 * 组合常用的卡片样式
 */
export const cardStyles = {
  base: cn("rounded-lg border bg-card text-card-foreground shadow-xs", animationClasses.transition),
  hover: cn(animationClasses.hoverScale, animationClasses.hoverBorder),
  content: cn("flex h-full items-center", spacingClasses.p4),
} as const;

/**
 * 组合常用的加载样式
 */
export const loadingStyles = {
  spinner: cn("rounded-full border-primary border-b-2", animationClasses.spin),
  skeleton: cn("rounded bg-muted", animationClasses.pulse),
} as const;

/**
 * 组合常用的布局样式
 */
export const layoutStyles = {
  page: "min-h-screen bg-background",
  section: cn(layoutClasses.container, layoutClasses.section),
  grid: cn(layoutClasses.gridResponsive, spacingClasses.gap6),
  flexCol: "flex flex-col",
  flexRow: "flex flex-row",
  itemsCenter: "items-center",
  justifyCenter: "justify-center",
  justifyBetween: "justify-between",
} as const;
