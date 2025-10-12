/**
 * 通用工具函数导出
 * 集中导出所有通用工具函数，便于引用
 */

// API 相关工具函数
export {
  API_PATHS,
  // 移除不存在的类型导出
} from "@/lib/api/api-paths";

// API 缓存工具函数
export {
  setCacheHeaders,
  // 移除不存在的类型导出
} from "@/lib/api/cache-utils";

// 错误处理工具函数
export {
  handleContentError,
  handleNetworkError,
  // 移除不存在的导出
} from "@/lib/utils/error";

// Store 工具函数
export { createResetFunction } from "@/lib/utils/store";

// URL 工具函数 - 文件不存在，移除导入

// 通用工具函数
export {
  cn,
  debounceSync,
  filterUndefinedValues,
} from "@/lib/utils";

// 验证工具函数
export {
  isValidUrl,
  validateRequiredFields,
} from "@/lib/utils/validation";

// 布局工具函数 - 已移除未使用的导出
