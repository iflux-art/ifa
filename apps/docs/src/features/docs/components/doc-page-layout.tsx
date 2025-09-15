import type { ReactNode } from 'react'

export interface DocPageLayoutProps {
  children: ReactNode
  className?: string
}

/**
 * 文档页面布局组件
 * 封装文档页面的通用布局和样式
 */
export function DocPageLayout({
  children,
  className = '',
}: DocPageLayoutProps) {
  return (
    <div className={`min-h-screen bg-background ${className}`}>{children}</div>
  )
}
