// 布局相关类型
export type {
  PageLayoutType,
  PageContainerConfig,
  SidebarConfig,
  NotFoundProps,
  PageProps,
  PageLayoutProps,
  AppGridProps,
  PageContainerProps,
  ThreeColumnLayoutProps,
  ThreeColumnGridProps,
  SidebarWrapperProps,
  GridColsMap,
  GridGapMap,
} from "@/features/layout/layout-types";

// 新增异步操作相关类型
export type { CacheOptions, UseAsyncOptions } from "./async-types";

// SEO相关类型
export type {
  IconConfig,
  VerificationConfig,
  JsonLdConfig,
  SocialConfig,
  GenerateMetadataOptions,
  SiteConfig,
  SEOPageOptions,
} from "./seo-types";

// 配置相关类型
export type { SiteMetadata, IosConfig, WindowsConfig } from "./config-types";

// ==================== 组件 Props 类型 ====================
// 已移除文档项目中不使用的通用组件Props类型定义
// TOC相关类型已移至 src/features/toc/types.ts
// 数据表格和用户信息相关类型已移除
// ProfileLink 类型已移除
