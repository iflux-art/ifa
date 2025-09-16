/**
 * 异步操作相关类型定义
 */

// ==================== 异步状态类型 ====================

/** 异步操作状态 */
export type AsyncStatus = "idle" | "loading" | "success" | "error";

/** 异步操作基础状态接口 */
export interface AsyncState<T> {
  /** 数据 */
  data: T | null;
  /** 状态 */
  status: AsyncStatus;
  /** 错误信息 */
  error: string | null;
  /** 是否加载中 */
  loading: boolean;
}

/** 异步操作结果接口 */
export interface AsyncResult<T> {
  /** 数据 */
  data: T;
  /** 是否成功 */
  success: boolean;
  /** 错误信息 */
  error?: string;
}

/** 异步操作选项接口 */
export interface UseAsyncOptions<T> {
  /** 设置加载状态的函数 */
  setLoading?: (loading: boolean) => void;
  /** 设置错误信息的函数 */
  setError?: (error: string | null) => void;
  /** 成功回调函数 */
  onSuccess?: (data: T) => void;
  /** 错误回调函数 */
  onError?: (error: unknown) => void;
  /** 数据验证函数 */
  validator?: (data: T) => boolean;
  /** 内容类型 */
  contentType?: string;
  /** 内容标识 */
  contentId?: string;
}

/** 缓存选项接口 */
export interface CacheOptions<T> {
  /** 缓存前缀 */
  prefix?: string;
  /** 过期时间（毫秒） */
  expiry?: number;
  /** 是否使用内存缓存 */
  useMemoryCache?: boolean;
  /** 是否使用本地存储 */
  useLocalStorage?: boolean;
  /** 最大重试次数 */
  maxRetries?: number;
  /** 重试延迟（毫秒） */
  retryDelay?: number;
  /** 数据验证函数 */
  validator?: (data: T) => boolean;
}

// ==================== API 响应类型 ====================

/** API 响应基础接口 */
export interface BaseApiResponse<T> {
  /** 数据 */
  data: T;
  /** 状态码 */
  status: number;
  /** 消息 */
  message: string;
  /** 时间戳 */
  timestamp: string;
}

/** 分页 API 响应接口 */
export interface PaginatedApiResponse<T> extends BaseApiResponse<T[]> {
  /** 分页信息 */
  pagination: {
    /** 当前页 */
    page: number;
    /** 每页条数 */
    limit: number;
    /** 总数 */
    total: number;
    /** 总页数 */
    totalPages: number;
  };
}

// ==================== 内容加载类型 ====================

/** 内容加载参数接口 */
export interface ContentLoadParams {
  /** 内容类型 */
  contentType?: "docs" | "links";
  /** 内容标识 */
  contentId?: string;
  /** 查询参数 */
  query?: Record<string, string | number | boolean>;
}

/** 内容加载结果接口 */
export interface ContentLoadResult<T> {
  /** 内容数据 */
  content: T;
  /** 元数据 */
  metadata: {
    /** 最后修改时间 */
    lastModified?: string;
    /** 版本 */
    version?: string;
    /** 缓存键 */
    cacheKey?: string;
  };
}

// ==================== 搜索类型 ====================
// 已移动到 src/features/search/types/index.ts 中集中管理
// /** 搜索参数接口 */
// export interface SearchParams {
//   /** 搜索关键词 */
//   query: string;
//   /** 搜索类型 */
//   type: "all" | "docs" | "links";
//   /** 页码 */
//   page?: number;
//   /** 每页条数 */
//   limit?: number;
// }
//
// /** 搜索结果接口 */
// export interface SearchResult<T> {
//   /** 搜索结果 */
//   results: T[];
//   /** 总数 */
//   total: number;
//   /** 搜索关键词 */
//   query: string;
//   /** 搜索类型 */
//   type: string;
// }
