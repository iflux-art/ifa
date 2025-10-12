import type { ReactNode } from "react";

/**
 * 通用UI组件属性
 */
export interface BaseComponentProps {
  className?: string;
  children?: ReactNode;
  id?: string;
  "data-testid"?: string;
}

/**
 * 组件尺寸变体
 */
export type Size = "xs" | "sm" | "md" | "lg" | "xl";

/**
 * 组件颜色变体
 */
export type ColorVariant =
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "error"
  | "info"
  | "neutral";

/**
 * 按钮变体
 */
export type ButtonVariant = "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";

/**
 * 加载状态
 */
export interface LoadingState {
  isLoading: boolean;
  loadingText?: string;
}

/**
 * 错误状态
 */
export interface ErrorState {
  hasError: boolean;
  error?: Error | string;
  errorMessage?: string;
}

/**
 * 表单字段状态
 */
export interface FieldState {
  // biome-ignore lint/suspicious/noExplicitAny: 表单字段值可以是任何类型
  value: any;
  error?: string;
  touched: boolean;
  dirty: boolean;
  valid: boolean;
}

/**
 * 表单验证规则
 */
export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  // biome-ignore lint/suspicious/noExplicitAny: 自定义验证可以接受任何值类型
  custom?: (value: any) => string | undefined;
}

/**
 * 表单字段配置
 */
export interface FormField {
  name: string;
  label: string;
  type:
    | "text"
    | "email"
    | "password"
    | "number"
    | "tel"
    | "url"
    | "textarea"
    | "select"
    | "checkbox"
    | "radio";
  placeholder?: string;
  // biome-ignore lint/suspicious/noExplicitAny: 表单字段默认值可以是任何类型
  defaultValue?: any;
  validation?: ValidationRule;
  // biome-ignore lint/suspicious/noExplicitAny: 表单字段选项值可以是任何类型
  options?: Array<{ label: string; value: any }>;
  disabled?: boolean;
  required?: boolean;
}

/**
 * 模态框配置
 */
export interface ModalConfig {
  title?: string;
  size?: Size;
  closable?: boolean;
  maskClosable?: boolean;
  keyboard?: boolean;
  centered?: boolean;
  destroyOnClose?: boolean;
}

/**
 * Toast通知类型
 */
export type ToastType = "success" | "error" | "warning" | "info";

/**
 * Toast通知配置
 */
export interface ToastConfig {
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
  closable?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

/**
 * 表格列配置
 */
// biome-ignore lint/suspicious/noExplicitAny: 通用表格列可以处理任何数据类型
export interface TableColumn<T = any> {
  key: string;
  title: string;
  dataIndex?: keyof T;
  width?: number | string;
  align?: "left" | "center" | "right";
  sortable?: boolean;
  filterable?: boolean;
  // biome-ignore lint/suspicious/noExplicitAny: 表格单元格值可以是任何类型
  render?: (value: any, record: T, index: number) => ReactNode;
  fixed?: "left" | "right";
}

/**
 * 表格配置
 */
// biome-ignore lint/suspicious/noExplicitAny: 通用表格配置可以处理任何数据类型
export interface TableConfig<T = any> {
  columns: TableColumn<T>[];
  dataSource: T[];
  rowKey: string | ((record: T) => string);
  pagination?: {
    current: number;
    pageSize: number;
    total: number;
    showSizeChanger?: boolean;
    showQuickJumper?: boolean;
  };
  loading?: boolean;
  selection?: {
    type: "checkbox" | "radio";
    selectedRowKeys: string[];
    onChange: (selectedRowKeys: string[], selectedRows: T[]) => void;
  };
}

/**
 * 导航项
 */
export interface NavItem {
  key: string;
  label: string;
  icon?: ReactNode;
  href?: string;
  onClick?: () => void;
  children?: NavItem[];
  disabled?: boolean;
  badge?: string | number;
}

/**
 * 面包屑项
 */
export interface BreadcrumbItem {
  title: string;
  href?: string;
  onClick?: () => void;
}

/**
 * 主题配置
 */
export interface ThemeConfig {
  mode: "light" | "dark" | "system";
  primaryColor: string;
  borderRadius: number;
  fontFamily: string;
  fontSize: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
}

/**
 * 响应式断点
 */
export interface Breakpoints {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  "2xl": number;
}

/**
 * 动画配置
 */
export interface AnimationConfig {
  duration: {
    fast: number;
    normal: number;
    slow: number;
  };
  easing: {
    ease: string;
    easeIn: string;
    easeOut: string;
    easeInOut: string;
  };
}
