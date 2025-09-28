/**
 * 工具函数统一导出
 */

// 异步操作工具
export { executeAsyncOperation, executeWithRetry } from "@/lib/utils/async";
// 错误处理工具
export type { ErrorInfo, LogOptions } from "@/lib/utils/error";
export {
  classifyError,
  getUserFriendlyMessage,
  handleComponentError,
  handleContentError,
  handleNetworkError,
  logError,
} from "@/lib/utils/error";
// 状态管理工具
export {
  createConfigManager,
  createFilteredStateManager,
  createStandardStateActions,
} from "@/lib/utils/state";
// API工具
export {
  ApiErrors,
  createApiError,
  createApiSuccess,
  isValidUrl,
  validateRequiredFields,
} from "./api";
// 从 api-paths 导出
export {
  ANALYTICS_API_PATHS,
  API_PATHS,
  BLOG_API_PATHS,
  CONTENT_API_PATHS,
  FRIENDS_API_PATHS,
  NOTIFICATION_API_PATHS,
  SEARCH_API_PATHS,
  USER_API_PATHS,
} from "./api/api-paths";
// ==================== API工具函数 ====================
// 从简化版API工具导出类型定义
export type {
  ApiErrorResponse,
  ApiErrorType,
  ApiSuccessResponse,
} from "./api";
// ==================== 元数据和SEO工具函数 ====================
export {
  generateArticleMetadata,
  generateMetadata,
  generateProfileMetadata,
  generateViewport,
} from "./metadata/metadata";
export { generateSEOMetadata } from "./metadata/seo-utils";
