/**
 * API工具函数导出
 */

// 从 utils/validation 导出
export { isValidUrl, validateRequiredFields } from "@/utils/validation";
// 从 api-client 导出
// 导出便捷函数
export {
  ApiClient,
  apiClient,
  deleteRequest,
  get,
  patch,
  post,
  put,
} from "./api-client";

// 从 api-middleware 导出
export type {
  LoggingOptions,
  MiddlewareResult,
  ValidationOptions,
} from "./api-middleware";
export {
  runMiddleware,
  withRateLimit,
  withValidation,
} from "./api-middleware";

// 从 api-paths 导出
// API路径常量
export {
  API_PATHS,
  CONTENT_API_PATHS,
  SEARCH_API_PATHS,
} from "./api-paths";
// 从 api-utils 导出
export type {
  ApiErrorResponse,
  ApiErrorType,
  ApiSuccessResponse,
  CacheConfig,
} from "./api-utils";
export {
  ApiErrors,
  createApiError,
  createApiSuccess,
  withErrorHandling,
} from "./api-utils";
// 从 cache-utils 导出
export {
  CACHE_CONFIG,
  generateCacheControl,
  getCacheStrategy,
  setCacheHeaders,
} from "./cache-utils";
