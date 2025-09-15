// 布局相关类型
export type {
  AppGridProps,
  GridColsMap,
  GridGapMap,
  NotFoundProps,
  PageContainerConfig,
  PageContainerProps,
  PageLayoutProps,
  PageLayoutType,
  PageProps,
  SidebarConfig,
  SidebarWrapperProps,
  ThreeColumnGridProps,
  ThreeColumnLayoutProps,
} from '@/features/layout/layout-types'

// 新增异步操作相关类型
export type { CacheOptions, UseAsyncOptions } from './async-types'
// 配置相关类型
export type { IosConfig, SiteMetadata, WindowsConfig } from './config-types'
// SEO相关类型
export type {
  GenerateMetadataOptions,
  IconConfig,
  JsonLdConfig,
  SEOPageOptions,
  SiteConfig,
  SocialConfig,
  VerificationConfig,
} from './seo-types'

// ==================== 组件 Props 类型 ====================
// 已移除文档项目中不使用的通用组件Props类型定义
// TOC相关类型已移至 src/features/toc/types.ts
// 数据表格和用户信息相关类型已移除
// ProfileLink 类型已移除
