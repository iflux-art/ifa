/**
 * 工具函数统一导出
 */

// 从 utils 导出
export { cn } from "@/lib/utils/core";
export { classifyError, logError } from "@/lib/utils/error";
export {
  debounce,
  debounceSync,
  filterUndefinedValues,
} from "@/lib/utils/helpers";
export {
  isValidCategory,
  isValidUrl,
  normalizeUrl,
  validateRequiredFields,
} from "@/lib/utils/validation";

// 从 api 导出
export type { ApiResponse } from "./api/api-client";
export {
  apiRequest,
  del,
  get,
  post,
  put,
} from "./api/api-client";
export type { MiddlewareResult } from "./api/api-middleware";
export { withCORS } from "./api/api-middleware";
export {
  CONTENT_API_PATHS,
  SEARCH_API_PATHS,
} from "./api/api-paths";
export type {
  ApiErrorResponse,
  ApiErrorType,
  ApiSuccessResponse,
  CacheConfig,
} from "./api/api-utils";
export {
  ApiErrors,
  createApiError,
  createApiSuccess,
} from "./api/api-utils";

// ==================== 元数据和SEO工具函数 ====================
// 移除了 generateMetadata 等工具函数，直接在 layout.tsx 中使用 SITE_METADATA 构建元数据
