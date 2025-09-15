/**
 * Sidebar 类型定义
 */

import type { ReactNode } from 'react'

// ==================== 侧边栏相关类型 ====================

/** 侧边栏项目 */
export interface SidebarItem {
  id: string
  title: string
  href?: string
  children?: SidebarItem[]
  isActive?: boolean
  isExternal?: boolean
  description?: string
  icon?: ReactNode
}

/** 侧边栏属性 */
export interface SidebarProps {
  /** 侧边栏项目列表 */
  items: SidebarItem[]
  /** 当前选中的项目ID */
  currentItem?: string
  /** 项目点击回调 */
  onItemClick?: (itemId: string) => void
  /** 自定义类名 */
  className?: string
  /** 本地存储键前缀 */
  storageKey?: string
  /** 是否显示全部选项 */
  showAllOption?: boolean
  /** 全部选项的标题 */
  allOptionTitle?: string
}

/** 侧边栏包装组件属性接口 */
export interface SidebarWrapperProps {
  children: ReactNode
  config: SidebarConfig
}

// ==================== 布局相关类型 ====================

/**
 * 侧边栏配置接口
 * 简化版本，只支持两种布局类型
 */
export interface SidebarConfig {
  /**
   * 侧边栏唯一标识符（可选）
   */
  id?: string
  /**
   * 侧边栏内容
   */
  content: ReactNode
  /**
   * 侧边栏位置
   */
  position: 'left' | 'right'
  /**
   * 是否粘性定位
   */
  sticky?: boolean
  /**
   * 粘性定位的top值
   */
  stickyTop?: string
  /**
   * 最大高度
   */
  maxHeight?: string
  /**
   * 响应式显示设置
   */
  responsive?: {
    hideOnMobile?: boolean
    hideOnTablet?: boolean
    hideOnDesktop?: boolean
  }
}
