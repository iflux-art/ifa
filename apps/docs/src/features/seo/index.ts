/**
 * SEO 功能模块统一导出
 * 集中管理所有 SEO 和元数据相关的工具函数
 */

// 基础元数据生成工具
export {
  generateArticleMetadata,
  generateMetadata,
  generateProfileMetadata,
  generateViewport,
} from './metadata'

// SEO 工具函数
export { generateDocsMetadata, generateSEOMetadata } from './seo-utils'
