/**
 * Hub应用类型定义
 * 统一管理应用中使用的类型定义
 */

// ==================== 基础类型 ====================

/**
 * 应用配置类型
 */
export interface AppConfig {
  name: string;
  version: string;
  environment: "development" | "production" | "test";
  description?: string;
  url?: string;
}

/**
 * 通用响应类型
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * 分页参数类型
 */
export interface PaginationParams {
  page: number;
  pageSize: number;
  total?: number;
}

/**
 * 排序参数类型
 */
export interface SortParams {
  field: string;
  order: "asc" | "desc";
}

/**
 * 过滤参数类型
 */
export interface FilterParams {
  [key: string]: string | number | boolean | undefined;
}

// ==================== 状态管理类型 ====================

/**
 * 加载状态类型
 */
export interface LoadingState {
  isLoading: boolean;
  message?: string;
}

/**
 * 错误状态类型
 */
export interface ErrorState {
  error: string | null;
  errorCode?: string;
  timestamp?: number;
}

/**
 * 异步操作状态类型
 */
export interface AsyncState<T = unknown> extends LoadingState, ErrorState {
  data: T | null;
  lastUpdated?: number;
}

// ==================== UI 组件类型 ====================

/**
 * 基础组件属性类型
 */
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

/**
 * 按钮变体类型
 */
export type ButtonVariant = "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";

/**
 * 按钮尺寸类型
 */
export type ButtonSize = "default" | "sm" | "lg" | "icon";

/**
 * 对话框状态类型
 */
export interface DialogState {
  isOpen: boolean;
  title?: string;
  content?: React.ReactNode;
}

// ==================== 数据模型类型 ====================

/**
 * 基础实体类型
 */
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * 用户信息类型
 */
export interface UserInfo extends BaseEntity {
  email: string;
  name?: string;
  avatar?: string;
  role: "admin" | "user";
}

/**
 * 文件信息类型
 */
export interface FileInfo {
  name: string;
  size: number;
  type: string;
  url?: string;
  lastModified?: number;
}

// ==================== 事件类型 ====================

/**
 * 自定义事件类型
 */
export interface CustomEvent<T = unknown> {
  type: string;
  payload: T;
  timestamp: number;
}

/**
 * 错误事件类型
 */
export interface ErrorEvent extends CustomEvent<ErrorState> {
  type: "error";
  source?: string;
}

// ==================== 工具类型 ====================

/**
 * 可选属性类型
 */
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

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

/**
 * 提取数组元素类型
 */
export type ArrayElement<T> = T extends (infer U)[] ? U : never;

// ==================== 布局相关类型 ====================

/**
 * 布局配置类型
 */
export interface LayoutConfig {
  sidebar: {
    isOpen: boolean;
    width: number;
  };
  header: {
    height: number;
    isFixed: boolean;
  };
  footer: {
    height: number;
    isVisible: boolean;
  };
}
