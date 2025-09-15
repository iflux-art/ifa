/**
 * 工具函数统一导出
 */

// 异步操作工具
export { executeAsyncOperation, executeWithRetry } from '@/utils/async'
// 状态管理工具
export {
  createConfigManager,
  createFilteredStateManager,
  createStandardStateActions,
} from '@/utils/state'
// API工具
export {
  createApiSuccess,
  isValidUrl,
  runMiddleware,
  validateRequiredFields,
  withErrorHandling,
  withRateLimit,
  withValidation,
} from './api'
// 从 api-middleware 导出
export type {
  LoggingOptions,
  MiddlewareResult,
  ValidationOptions,
} from './api/api-middleware'
export {
  withLogging,
  withValidation as apiWithValidation,
} from './api/api-middleware'
// 从 api-paths 导出
export {
  API_PATHS,
  // BLOG_API_PATHS,  // 已移除 blog 版块
  CONTENT_API_PATHS,
  SEARCH_API_PATHS,
} from './api/api-paths'
// ==================== API工具函数 ====================
// 从 api-utils 导出
export type {
  ApiErrorResponse,
  ApiErrorType,
  ApiSuccessResponse,
  CacheConfig,
} from './api/api-utils'
export {
  ApiErrors,
  createApiError,
  withErrorHandling as apiWithErrorHandling,
} from './api/api-utils'
// 错误处理工具
export type { ErrorInfo, LogOptions } from './error'
export {
  classifyError,
  getUserFriendlyMessage,
  handleComponentError,
  handleContentError,
  handleNetworkError,
  logError,
} from './error'
