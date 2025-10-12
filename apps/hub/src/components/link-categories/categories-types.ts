/**
 * 链接分类相关类型定义
 * 统一管理链接分类相关的类型定义
 */

export type CategoryId =
  // AI 分类
  | "ai"
  | "ai/api"
  | "ai/chat"
  | "ai/creative"
  | "ai/models"
  | "ai/platforms"
  | "ai/resources"
  | "ai/services"
  | "ai/tools"
  // 音频分类
  | "audio"
  | "audio/daw"
  | "audio/distribution"
  | "audio/processing"
  // 设计分类
  | "design"
  | "design/colors"
  | "design/fonts"
  | "design/image-processing"
  | "design/tools"
  // 开发分类
  | "development"
  | "development/apis"
  | "development/cloud"
  | "development/containers"
  | "development/databases"
  | "development/frameworks"
  | "development/git"
  | "development/hosting"
  | "development/monitoring"
  | "development/security"
  | "development/tools"
  // 办公分类
  | "office"
  | "office/documents"
  | "office/pdf"
  // 运营分类
  | "operation"
  | "operation/ecommerce"
  | "operation/marketing"
  // 效率分类
  | "productivity"
  | "productivity/browsers"
  | "productivity/cloud-storage"
  | "productivity/email"
  | "productivity/search"
  | "productivity/system-tools"
  // 视频分类
  | "video"
  | "video/editing";

/** 链接子分类 */
export interface LinksSubCategory {
  id: CategoryId;
  name: string;
  description?: string;
  icon?: string;
  order?: number;
}

/** 链接分类 */
export interface LinksCategory {
  id: CategoryId;
  name: string;
  description?: string;
  icon?: string;
  order?: number;
  collapsible?: boolean; // 是否支持折叠
  children?: LinksSubCategory[]; // 子分类
}
