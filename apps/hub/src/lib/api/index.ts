/**
 * 简化版API工具函数导出
 */

// 从 api-paths 导出
export {
  ANALYTICS_API_PATHS,
  API_PATHS,
  BLOG_API_PATHS,
  CONTENT_API_PATHS,
  NOTIFICATION_API_PATHS,
  SEARCH_API_PATHS,
  USER_API_PATHS,
} from "./api-paths";

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
