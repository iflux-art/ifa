// ==================== 通用类型导出 ====================
export * from "./common";
import type { BaseProps, Size, Breakpoint, Theme, ComponentFactory } from "./common";

// ==================== 应用配置类型 ====================
export type AppConfig = {
  name: string;
  version: string;
  environment: "development" | "production" | "test";
};

// ==================== 基础组件类型 ====================

/**
 * 扩展组件 Props 接口
 */
export interface ExtendedComponentProps extends BaseProps {
  variant?: string;
  size?: Size;
  disabled?: boolean;
}

/**
 * 响应式布局 Props 接口
 */
export interface ResponsiveLayoutProps extends BaseProps {
  breakpoint?: Breakpoint;
  sidebar?: React.ReactNode;
  showNavbar?: boolean;
  showFooter?: boolean;
}

// ==================== UI 状态类型 ====================

/**
 * 用户界面状态
 */
export interface UIState {
  theme: "light" | "dark" | "system";
  sidebarOpen: boolean;
  loading: boolean;
}

/**
 * 导航项目接口
 */
export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  external?: boolean;
  description?: string;
}

/**
 * 页面元数据接口
 */
export interface PageMetadata {
  title: string;
  description?: string;
}

// ==================== 数据模型类型 ====================

/**
 * 个人资料链接接口
 */
export interface ProfileLink {
  id: string;
  title: string;
  url: string;
  description?: string;
  category?: string;
  tags?: string[];
  icon?: string;
  iconType?: "image" | "text";
  iconLazy?: boolean;
}

/**
 * 链接卡片 Props 接口
 */
export interface LinkCardProps {
  /** 链接标题 */
  title: string;
  /** 链接描述 */
  description?: string;
  /** 链接URL */
  href: string;
  /** 链接图标 */
  icon?: React.ReactNode | string;
  /** 图标类型 */
  iconType?: "image" | "text";
  /** 是否为外部链接 */
  isExternal?: boolean;
  /** 主题色 */
  color?: string;
  /** 自定义类名 */
  className?: string;
  /** 子元素 */
  children?: React.ReactNode;
}

// ==================== 懒加载组件类型 ====================

/**
 * 懒加载组件工厂函数类型
 */
export type LazyComponentFactory<T extends React.ComponentType<unknown>> = ComponentFactory<T>;

/**
 * 预加载选项接口
 */
export interface PreloadOptions {
  /** 预加载延迟时间（毫秒） */
  delay?: number;
  /** 是否在空闲时间预加载 */
  useIdleCallback?: boolean;
  /** Intersection Observer 选项 */
  intersectionOptions?: IntersectionObserverInit;
}

// ==================== 主题相关类型 ====================

/**
 * 主题提供者 Props 接口
 */
export interface ThemeProviderProps {
  children: React.ReactNode;
  attribute?: string;
  defaultTheme?: Theme;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
}

// ==================== 表单相关类型 ====================

/**
 * 表单字段状态
 */
export interface FormFieldState {
  value: string;
  error?: string;
  touched: boolean;
  dirty: boolean;
}

/**
 * 表单验证规则
 */
export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: string) => string | undefined;
}

// ==================== 工具类型 ====================
// 已通过 common.ts 导出

// ==================== API 类型导出 ====================
// Web 子应用作为静态展示站点，不需要 API 相关的类型导出
export * from "./config";
