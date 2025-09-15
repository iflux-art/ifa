import { DocPagination } from '@/components'
import type { BreadcrumbItem } from '@/components/breadcrumb'
import { Breadcrumb } from '@/components/breadcrumb'
import { ContentDisplay } from '@/components/content-display'
import {
  DocsSidebar,
  DocsSidebarCard,
  getAllDocsStructure,
} from '@/features/docs/components'
import type { NavDocItem } from '@/features/docs/types'
import { ThreeColumnLayout } from '@/features/layout'

interface DocsHomePageProps {
  firstDoc?: NavDocItem | null
}

/**
 * 文档首页组件
 *
 * 展示文档系统首页内容，包括导航和第一个文档内容
 */
export function DocsHomePage({ firstDoc }: DocsHomePageProps) {
  // 获取文档结构
  const structure = getAllDocsStructure()

  // 左侧边栏内容 - 文档导航
  const leftSidebar = <DocsSidebarCard currentDoc="" showHeader={true} />

  // 右侧边栏内容 - 空白占位
  const rightSidebar = <div className="h-full" />

  // 面包屑导航项
  const breadcrumbItems: BreadcrumbItem[] = [
    {
      label: '文档',
      href: '/docs',
    },
  ]

  return (
    <ThreeColumnLayout leftSidebar={leftSidebar} rightSidebar={rightSidebar}>
      {/* 面包屑导航 */}
      <Breadcrumb items={breadcrumbItems} className="mb-4" />

      {/* 文档主内容 */}
      <div className="space-y-6">
        {/* 文档内容展示 */}
        <ContentDisplay contentType="docs" title="文档中心">
          <div className="prose prose-gray dark:prose-invert">
            <p>
              欢迎来到斐流艺创文档中心，这里包含了项目的所有文档和使用指南。
            </p>
            <h2>开始使用</h2>
            <p>如果您是第一次使用斐流艺创，建议从以下文档开始：</p>
            <ul>
              <li>
                <a href="/getting-started">快速开始指南</a> -
                了解如何快速上手使用项目
              </li>
              <li>
                <a href="/project">项目介绍</a> - 了解项目的背景、目标和功能
              </li>
              <li>
                <a href="/features">核心功能模块</a> - 了解项目提供的核心功能
              </li>
            </ul>
            <h2>文档结构</h2>
            <p>文档按照以下分类组织：</p>
          </div>
        </ContentDisplay>

        {/* 文档结构展示 */}
        <DocsSidebar structure={structure} currentDoc="" />

        {/* 文档分页导航 */}
        <DocPagination nextDoc={firstDoc} />
      </div>
    </ThreeColumnLayout>
  )
}
