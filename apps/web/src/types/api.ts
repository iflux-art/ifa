/**
 * API 相关类型定义
 */

// ==================== 基础 API 类型 ====================

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
 * API 错误响应
 */
export interface ApiErrorResponse {
  error: string;
  details?: unknown;
  status: number;
  timestamp: string;
}

/**
 * 分页信息
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
 * 分页响应
 */
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: PaginationInfo;
}

// ==================== Analytics API 类型 ====================

/**
 * 客户端信息
 */
export interface ClientInfo {
  userAgent: string;
  language: string;
  platform: string;
  screenWidth: number;
  screenHeight: number;
  timezone?: string;
  cookieEnabled?: boolean;
}

/**
 * 页面浏览数据
 */
export interface PageViewData {
  url: string;
  referrer: string;
  title: string;
  sessionId: string;
  timestamp?: number;
  userId?: string;
}

/**
 * 事件数据
 */
export interface EventData {
  name: string;
  category: string;
  label?: string;
  value?: number;
  sessionId: string;
  timestamp?: number;
  userId?: string;
  properties?: Record<string, unknown>;
}

/**
 * 错误数据
 */
export interface ErrorData {
  message: string;
  stack: string;
  url: string;
  sessionId: string;
  timestamp?: number;
  userId?: string;
  severity?: "low" | "medium" | "high" | "critical";
}

/**
 * 长任务数据
 */
export interface LongTaskData {
  duration: number;
  sessionId: string;
  timestamp?: number;
  taskName?: string;
  startTime?: number;
}

/**
 * 慢资源数据
 */
export interface SlowResourceData {
  name: string;
  duration: number;
  size?: number;
  sessionId: string;
  timestamp?: number;
  resourceType?: string;
  initiatorType?: string;
}

/**
 * Analytics 事件类型
 */
export type AnalyticsEventType = "page-view" | "event" | "error" | "long-task" | "slow-resource";

/**
 * Analytics 事件数据联合类型
 */
export type AnalyticsEventData =
  | PageViewData
  | EventData
  | ErrorData
  | LongTaskData
  | SlowResourceData;

/**
 * Analytics API 请求体
 */
export interface AnalyticsRequest {
  type: AnalyticsEventType;
  data: AnalyticsEventData;
  clientInfo: ClientInfo;
}

/**
 * Analytics API 响应
 */
export interface AnalyticsResponse extends ApiResponse<null> {
  eventId?: string;
}

// ==================== 性能监控类型 ====================

/**
 * 性能指标
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
  /** Total Blocking Time */
  tbt?: number;
  /** Speed Index */
  si?: number;
}

/**
 * 资源性能数据
 */
export interface ResourcePerformance {
  name: string;
  duration: number;
  size: number;
  type: string;
  initiatorType: string;
  transferSize: number;
  encodedBodySize: number;
  decodedBodySize: number;
}

/**
 * 导航性能数据
 */
export interface NavigationPerformance {
  domContentLoaded: number;
  loadComplete: number;
  firstPaint: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  firstInputDelay: number;
  cumulativeLayoutShift: number;
}

// ==================== 用户相关 API 类型 ====================

/**
 * 用户信息
 */
export interface UserInfo {
  id: string;
  email?: string;
  name?: string;
  avatar?: string;
  role?: string;
  preferences?: UserPreferences;
  createdAt: string;
  updatedAt: string;
}

/**
 * 用户偏好设置
 */
export interface UserPreferences {
  theme: "light" | "dark" | "system";
  language: string;
  timezone: string;
  notifications: NotificationSettings;
}

/**
 * 通知设置
 */
export interface NotificationSettings {
  email: boolean;
  push: boolean;
  sms: boolean;
  categories: {
    updates: boolean;
    marketing: boolean;
    security: boolean;
  };
}

// ==================== 内容相关 API 类型 ====================

/**
 * 文章/博客文章
 */
export interface Article {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  slug: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  tags: string[];
  categories: string[];
  publishedAt: string;
  updatedAt: string;
  status: "draft" | "published" | "archived";
  metadata: {
    readTime: number;
    wordCount: number;
    views: number;
    likes: number;
  };
}

/**
 * 评论
 */
export interface Comment {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  articleId: string;
  parentId?: string;
  replies?: Comment[];
  createdAt: string;
  updatedAt: string;
  status: "pending" | "approved" | "rejected";
}

// ==================== 搜索相关 API 类型 ====================

/**
 * 搜索请求
 */
export interface SearchRequest {
  query: string;
  filters?: SearchFilters;
  sort?: SearchSort;
  pagination?: {
    page: number;
    limit: number;
  };
}

/**
 * 搜索过滤器
 */
export interface SearchFilters {
  categories?: string[];
  tags?: string[];
  dateRange?: {
    from: string;
    to: string;
  };
  author?: string;
  status?: string;
}

/**
 * 搜索排序
 */
export interface SearchSort {
  field: string;
  order: "asc" | "desc";
}

/**
 * 搜索结果
 */
export interface SearchResult<T = unknown> {
  items: T[];
  total: number;
  facets?: SearchFacets;
  suggestions?: string[];
  query: string;
  took: number;
}

/**
 * 搜索分面
 */
export interface SearchFacets {
  categories: Array<{
    name: string;
    count: number;
  }>;
  tags: Array<{
    name: string;
    count: number;
  }>;
  authors: Array<{
    name: string;
    count: number;
  }>;
}

// ==================== 文件上传相关类型 ====================

/**
 * 文件上传请求
 */
export interface FileUploadRequest {
  file: File;
  category?: string;
  metadata?: Record<string, unknown>;
}

/**
 * 文件信息
 */
export interface FileInfo {
  id: string;
  name: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  thumbnailUrl?: string;
  category?: string;
  metadata?: Record<string, unknown>;
  uploadedAt: string;
  uploadedBy: string;
}

/**
 * 文件上传响应
 */
export interface FileUploadResponse extends ApiResponse<FileInfo> {
  uploadId: string;
}

// ==================== 通用工具类型 ====================

/**
 * API 请求配置
 */
export interface ApiRequestConfig {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: Record<string, string>;
  params?: Record<string, unknown>;
  timeout?: number;
  retries?: number;
  cache?: boolean;
}

/**
 * API 客户端接口
 */
export interface ApiClient {
  get<T>(url: string, config?: ApiRequestConfig): Promise<ApiResponse<T>>;
  post<T>(url: string, data?: unknown, config?: ApiRequestConfig): Promise<ApiResponse<T>>;
  put<T>(url: string, data?: unknown, config?: ApiRequestConfig): Promise<ApiResponse<T>>;
  delete<T>(url: string, config?: ApiRequestConfig): Promise<ApiResponse<T>>;
  patch<T>(url: string, data?: unknown, config?: ApiRequestConfig): Promise<ApiResponse<T>>;
}

/**
 * API 错误类
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: ApiErrorResponse
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * 网络错误类
 */
export class NetworkError extends Error {
  constructor(
    message: string,
    public originalError?: Error
  ) {
    super(message);
    this.name = "NetworkError";
  }
}

/**
 * 超时错误类
 */
export class TimeoutError extends Error {
  constructor(
    message: string,
    public timeout: number
  ) {
    super(message);
    this.name = "TimeoutError";
  }
}
