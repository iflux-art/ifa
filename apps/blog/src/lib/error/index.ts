/**
 * 错误处理工具函数导出
 */

export type { ErrorInfo, LogOptions } from "./error-utils";
export {
  classifyError,
  getUserFriendlyMessage,
  handleComponentError,
  handleContentError,
  handleNetworkError,
  logError,
} from "./error-utils";
