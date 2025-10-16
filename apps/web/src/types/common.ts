/**
 * 通用类型定义
 * 统一管理常用的基础类型，减少重复定义
 */

import type React from "react";

// ==================== 基础类型 ====================

/**
 * 基础组件 Props 接口
 */
export interface BaseProps {
  className?: string;
  children?: React.ReactNode;
  "data-testid"?: string;
}

/**
 * 可选属性类型
 */
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * 严格的 Omit 类型
 */
export type StrictOmit<T, K extends keyof T> = Omit<T, K>;

/**
 * 深度只读类型
 */
export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

/**
 * 非空类型
 */
export type NonNullable<T> = T extends null | undefined ? never : T;

// ==================== 尺寸类型 ====================

/**
 * 标准尺寸类型
 */
export type Size = "sm" | "md" | "lg" | "xl";

/**
 * 按钮尺寸类型
 */
export type ButtonSize = "sm" | "md" | "lg" | "icon";

/**
 * 图标尺寸类型
 */
export type IconSize = "sm" | "md" | "lg" | "xl";

// ==================== 主题类型 ====================

/**
 * 主题类型
 */
export type Theme = "light" | "dark" | "system";

/**
 * 颜色变体类型
 */
export type ColorVariant =
  | "default"
  | "primary"
  | "secondary"
  | "destructive"
  | "outline"
  | "ghost"
  | "link";

// ==================== 状态类型 ====================

/**
 * 加载状态类型
 */
export type LoadingState = "idle" | "loading" | "success" | "error";

/**
 * 可见性状态类型
 */
export type VisibilityState = "visible" | "hidden" | "collapsed";

// ==================== 事件类型 ====================

/**
 * 点击事件处理器类型
 */
export type ClickHandler = (event: React.MouseEvent<HTMLElement>) => void;

/**
 * 键盘事件处理器类型
 */
export type KeyboardHandler = (event: React.KeyboardEvent<HTMLElement>) => void;

/**
 * 表单事件处理器类型
 */
export type FormHandler = (event: React.FormEvent<HTMLFormElement>) => void;

// ==================== 布局类型 ====================

/**
 * 对齐方式类型
 */
export type Alignment = "left" | "center" | "right" | "justify";

/**
 * 方向类型
 */
export type Direction = "horizontal" | "vertical";

/**
 * 断点类型
 */
export type Breakpoint = "sm" | "md" | "lg" | "xl" | "2xl";

// ==================== 数据类型 ====================

/**
 * ID 类型
 */
export type ID = string | number;

/**
 * 时间戳类型
 */
export type Timestamp = number;

/**
 * URL 类型
 */
export type URL = string;

// ==================== 组件类型 ====================

/**
 * 组件引用类型
 */
export type ComponentRef<T = HTMLElement> = React.RefObject<T>;

/**
 * 组件工厂类型
 */
export type ComponentFactory<T extends React.ComponentType<unknown>> = () => Promise<{
  default: T;
}>;

/**
 * 懒加载组件 Props 类型
 */
export type LazyComponentProps<T extends React.ComponentType<unknown>> =
  T extends React.ComponentType<infer P> ? P : never;
