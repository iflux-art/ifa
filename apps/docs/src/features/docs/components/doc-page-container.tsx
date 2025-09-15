import { DocPagination } from '@/components'
import type { BreadcrumbItem } from '@/components/breadcrumb'
import { Breadcrumb } from '@/components/breadcrumb'
import { ContentDisplay } from '@/components/content-display'
import { TwikooComment } from '@/features/comment'
import { DocsSidebarCard } from '@/features/docs/components'
import { createDocBreadcrumbsServer } from '@/features/docs/lib'
import type { Heading, NavDocItem } from '@/features/docs/types'
import { ThreeColumnLayout } from '@/features/layout'
import { ClientMDXRenderer } from '@/features/mdx'
import { TableOfContentsCard } from '@/features/toc'

interface DocPageContainerProps {
  doc: {
    frontmatter: {
      title: string
      description?: string
    }
    content: string
    headings: Heading[]
    date?: string | null
    update?: string | null
    wordCount?: number
    prevDoc?: NavDocItem | null
    nextDoc?: NavDocItem | null
  }
  breadcrumbs?: BreadcrumbItem[]
  currentDocPath: string
  showSidebarHeader?: boolean
}

/**
 * 文档页面容器组件
 *
 * 用于包装文档页面内容，提供统一的布局和样式
 */
export function DocPageContainer({
  doc,
  breadcrumbs,
  currentDocPath,
  showSidebarHeader = true,
}: DocPageContainerProps) {
  // 生成面包屑导航
  const breadcrumbItems =
    breadcrumbs ?? createDocBreadcrumbsServer(currentDocPath.split('/'))

  // 左侧边栏内容 - 文档导航
  const leftSidebar = (
    <DocsSidebarCard
      currentDoc={currentDocPath}
      showHeader={showSidebarHeader}
    />
  )

  // 右侧边栏内容 - 目录导航
  const rightSidebar = (
    <TableOfContentsCard headings={doc.headings} className="prose-sm" />
  )

  return (
    <ThreeColumnLayout leftSidebar={leftSidebar} rightSidebar={rightSidebar}>
      {/* 面包屑导航 */}
      <Breadcrumb items={breadcrumbItems} className="mb-4" />

      {/* 文档主内容 */}
      <div className="space-y-6">
        {/* 文档内容展示 */}
        <ContentDisplay
          contentType="docs"
          title={doc.frontmatter.title}
          date={doc.date ?? undefined}
          updatedAt={doc.update ?? undefined}
          wordCount={doc.wordCount}
        >
          <ClientMDXRenderer content={doc.content} />
        </ContentDisplay>

        {/* 文档分页导航 */}
        <DocPagination prevDoc={doc.prevDoc} nextDoc={doc.nextDoc} />

        {/* 评论区 */}
        <TwikooComment />
      </div>
    </ThreeColumnLayout>
  )
}
