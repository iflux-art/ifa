/**
 * 全局共享 Hooks 统一导出
 * 仅导出位于 src/hooks 目录下的共享 hooks
 * 功能特定的 hooks 应从各自的功能模块导出
 */

// ==================== 缓存相关 Hooks ====================
export { useCache } from "./use-cache";
export type {
  ContentLoadOptions,
  HookResult,
} from "./use-content-data";
// ==================== 内容数据 Hooks ====================
export { useContentData } from "./use-content-data";
// ==================== 标题观察 Hooks ====================
// useHeadingObserver 已移除，因为未被使用

export type { ErrorReport, ErrorTrackingOptions } from "./use-error-tracking";
// ==================== 错误追踪 Hooks ====================
export {
  useErrorBoundaryTracking,
  useErrorTracking,
} from "./use-error-tracking";
