// Export type definitions from this file
export type AppConfig = {
  name: string;
  version: string;
  environment: "development" | "production" | "test";
};

// ==================== 基础组件类型 ====================

/**
 * 基础组件 Props 接口
 */
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
  "data-testid"?: string;
}

/**
 * 扩展组件 Props 接口
 */
export interface ExtendedComponentProps extends BaseComponentProps {
  variant?: string;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
}

/**
 * 响应式布局 Props 接口
 */
export interface ResponsiveLayoutProps extends BaseComponentProps {
  breakpoint?: "sm" | "md" | "lg" | "xl";
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
  description: string;
  keywords: string[];
  image?: string;
  url?: string;
}

// ==================== API 响应类型 ====================

/**
 * 标准 API 响应格式
 */
export interface ApiResponse<T = unknown> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
  timestamp?: string;
}

/**
 * 分页信息接口
 */
export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

/**
 * 分页响应接口
 */
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: PaginationInfo;
}

/**
 * API 错误接口
 */
export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
  timestamp: Date;
  path?: string;
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

// ==================== 性能监控类型 ====================

/**
 * 性能指标接口
 */
export interface PerformanceMetrics {
  /** First Contentful Paint */
  fcp: number;
  /** Largest Contentful Paint */
  lcp: number;
  /** First Input Delay */
  fid: number;
  /** Cumulative Layout Shift */
  cls: number;
  /** Time to First Byte */
  ttfb: number;
}

/**
 * 错误日志接口
 */
export interface ErrorLog {
  id: string;
  timestamp: Date;
  level: "error" | "warn" | "info";
  message: string;
  stack?: string;
  userAgent: string;
  url: string;
  userId?: string;
}

// ==================== 懒加载组件类型 ====================

/**
 * 懒加载组件工厂函数类型
 */
export type LazyComponentFactory<T extends React.ComponentType<unknown>> = () => Promise<{
  default: T;
}>;

/**
 * 懒加载组件 Props 类型
 */
export type LazyComponentProps<T extends React.ComponentType<unknown>> =
  T extends React.ComponentType<infer P> ? P : never;

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
 * 主题类型
 */
export type Theme = "light" | "dark" | "system";

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

// ==================== API 类型导出 ====================
export * from "./api";
export * from "./config";
