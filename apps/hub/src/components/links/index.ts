/**
 * 链接功能模块导出
 */

// 组件导出
export { LinkCard } from "./link-card";
// 工具函数导出
export {
  clearAllCaches,
  clearCategoryCache,
  loadAllLinksData,
  preloadCriticalCategories,
} from "./links-lib";
// Hooks 导出
export { useFilterState } from "./use-filter-state";
// 移除了 useLinksDataState hook 导出，已移到 @/components/links-admin/components
export { useTagAnchors } from "./use-tag-anchors";

// Store 导出
// 移除了 useLinksDataStore，已移到 @/components/links-admin/components

// 类型导出
export type {
  LinksFormData,
  LinksItem,
} from "./links-types";

// 分类相关类型请从 @/components/link-categories 导入
// export type { CategoryId, LinksCategory, LinksSubCategory } from "./links-types";

// 工具函数导出
export {
  validateLinksFormData,
  validateLinksUpdate,
} from "./validation";
