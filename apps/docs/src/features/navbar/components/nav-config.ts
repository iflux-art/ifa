import { FileText, Link, type LucideIcon, MapPin, PenTool } from 'lucide-react'
import type { BaseNavItem } from '@/features/navbar/types'

/**
 * 导航配置项接口
 */
export interface NavConfigItem extends BaseNavItem {
  /** 描述文本 */
  description: string
  /** 是否在特定场景下隐藏 */
  hidden?: boolean
  /** 子菜单项 */
  children?: readonly NavConfigItem[]
  /** 图标 */
  icon?: LucideIcon
}

export const NAV_ITEMS = [
  {
    key: 'blog',
    label: '博客',
    description: '查看我们的技术博客，了解最新动态和深度文章',
    icon: PenTool,
    href: 'https://blog.iflux.art/',
    external: true,
  },
  {
    key: 'docs',
    label: '文档',
    description: '查看详细的文档和指南，了解如何使用我们的产品和服务',
    icon: FileText,
    href: '/', // 修改为指向首页
  },
  {
    key: 'nav',
    label: '导航',
    description: '查看网站导航和资源聚合',
    icon: MapPin,
    href: 'https://nav.iflux.art/',
    external: true,
  },
  {
    key: 'friends',
    label: '友链',
    description: '探索我们的合作伙伴和友情链接，发现更多优质资源',
    icon: Link,
    href: 'https://blog.iflux.art/friends/',
    external: true,
  },
] as const

// 扁平化所有导航项（包括子项）以便路径映射
const flattenNavItems = (items: readonly NavConfigItem[]): NavConfigItem[] => {
  const result: NavConfigItem[] = []
  items.forEach(item => {
    result.push(item)
    if (item.children) {
      result.push(...item.children)
    }
  })
  return result
}

const FLAT_NAV_ITEMS: NavConfigItem[] = flattenNavItems(NAV_ITEMS)

export const NAV_PATHS: Record<string, string> = {
  docs: '/', // 修改为指向首页
} as const

/**
 * 检查导航配置完整性
 */
// Navigation configuration validation removed for production

export const NAV_DESCRIPTIONS = Object.fromEntries(
  FLAT_NAV_ITEMS.map(item => [item.key, item.description])
) as Record<string, string>
