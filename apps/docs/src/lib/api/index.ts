/**
 * 简化版API工具函数导出
 */

// 从 utils/validation 导出
export { isValidUrl, validateRequiredFields } from "@/lib/utils/validation";

// 从 api-paths 导出
export {
  API_PATHS,
  CONTENT_API_PATHS,
  SEARCH_API_PATHS,
} from "./api-paths";

// 从 cache-utils 导出
export {
  CACHE_CONFIG,
  generateCacheControl,
  getCacheStrategy,
  setCacheHeaders,
} from "./cache-utils";

// 从简化版API工具导出
export {
  ApiErrors,
  apiRequest,
  createApiError,
  createApiSuccess,
  del,
  get,
  patch,
  post,
  put,
} from "./simple-api";

// 从简化版API工具导出类型定义
export type {
  ApiErrorResponse,
  ApiErrorType,
  ApiSuccessResponse,
} from "./simple-api";
