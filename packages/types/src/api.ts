/**
 * 通用API响应结构
 */
// biome-ignore lint/suspicious/noExplicitAny: 通用API响应可以包含任何数据类型
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ApiError;
  message?: string;
  timestamp: string;
}

/**
 * API错误结构
 */
export interface ApiError {
  code: string;
  message: string;
  // biome-ignore lint/suspicious/noExplicitAny: 错误详情可以包含任何类型的数据
  details?: Record<string, any>;
  field?: string;
}

/**
 * 分页参数
 */
export interface PaginationParams {
  page: number;
  limit: number;
  offset?: number;
}

/**
 * 分页元数据
 */
export interface PaginationMeta {
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
  meta: PaginationMeta;
}

/**
 * 排序参数
 */
export interface SortParams {
  field: string;
  order: "asc" | "desc";
}

/**
 * 过滤参数
 */
export interface FilterParams {
  [key: string]: string | number | boolean | string[] | number[] | undefined;
}

/**
 * 搜索参数
 */
export interface SearchParams extends PaginationParams {
  query?: string;
  sort?: SortParams[];
  filters?: FilterParams;
}

/**
 * HTTP方法
 */
export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

/**
 * API端点配置
 */
export interface ApiEndpoint {
  method: HttpMethod;
  path: string;
  authenticated?: boolean;
  rateLimit?: {
    requests: number;
    window: number; // 以秒为单位
  };
}

/**
 * 请求配置
 */
export interface RequestConfig {
  headers?: Record<string, string>;
  timeout?: number;
  retries?: number;
  cache?: boolean;
}

/**
 * 上传文件信息
 */
export interface FileUpload {
  file: File;
  fieldName: string;
  // biome-ignore lint/suspicious/noExplicitAny: 文件上传元数据可以包含任何类型的数据
  metadata?: Record<string, any>;
}

/**
 * 上传文件响应
 */
export interface UploadedFile {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  uploadedAt: string;
}
