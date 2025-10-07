/**
 * 工具函数统一导出
 */

// 异步操作工具
export { executeAsyncOperation, executeWithRetry } from "./utils/async";
// 错误处理工具
export type { ErrorInfo, LogOptions } from "./utils/error";
export {
  classifyError,
  getUserFriendlyMessage,
  handleComponentError,
  handleContentError,
  handleNetworkError,
  logError,
} from "./utils/error";
// API工具
export {
  createApiSuccess,
  isValidUrl,
  runMiddleware,
  validateRequiredFields,
  withErrorHandling,
  withPublicApi,
  withRateLimit,
  withValidation,
} from "./api";
// 从 api-middleware 导出
export type {
  LoggingOptions,
  MiddlewareResult,
  ValidationOptions,
} from "./api/api-middleware";
export {
  withCORS,
  withLogging,
  withValidation as apiWithValidation,
} from "./api/api-middleware";
// 从 api-paths 导出
export {
  ANALYTICS_API_PATHS,
  API_PATHS,
  BLOG_API_PATHS,
  CONTENT_API_PATHS,
  NOTIFICATION_API_PATHS,
  SEARCH_API_PATHS,
  USER_API_PATHS,
} from "./api/api-paths";
// ==================== API工具函数 ====================
// 从 api-utils 导出
export type {
  ApiErrorResponse,
  ApiErrorType,
  ApiSuccessResponse,
  CacheConfig,
} from "./api/api-utils";
export {
  ApiErrors,
  createApiError,
  withErrorHandling as apiWithErrorHandling,
} from "./api/api-utils";
// 布局工具
export { getContainerClassName } from "./layout/layout-utils";
// ==================== 元数据和SEO工具函数 ====================
// 移除了 generateMetadata 等工具函数，直接在 layout.tsx 中使用 SITE_METADATA 构建元数据
