/**
 * 链接分类功能模块导出
 */

// 类型导出
export type { LinkCategory } from "./categories";
// 工具函数导出
export {
  checkUrlExists,
  getCategoryDisplayName,
} from "./categories";
export type {
  CategoryId,
  LinksCategory,
  LinksSubCategory,
} from "./categories-types";

// Hooks 导出
export { useCategories } from "./use-categories";
