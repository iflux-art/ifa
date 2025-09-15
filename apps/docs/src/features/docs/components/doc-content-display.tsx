import { DocPagination } from '@/components'
import type { BreadcrumbItem } from '@/components/breadcrumb'
import { ContentDisplay } from '@/components/content-display'
import { TwikooComment } from '@/features/comment'
import { DocsSidebarCard } from '@/features/docs/components'
import type { Heading, NavDocItem } from '@/features/docs/types'
import { ThreeColumnLayout } from '@/features/layout'
import { ClientMDXRenderer } from '@/features/mdx'
import { TableOfContentsCard } from '@/features/toc'

interface DocContentDisplayProps {
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
 * 通用文档内容展示组件
 *
 * 提取自页面组件的共享逻辑，用于显示文档内容
 */
export function DocContentDisplay({
  doc,
  breadcrumbs,
  currentDocPath,
  showSidebarHeader = true,
}: DocContentDisplayProps) {
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
      {/* 文档主内容 */}
      <div className="space-y-6">
        {/* 文档内容展示 */}
        <ContentDisplay
          contentType="docs"
          title={doc.frontmatter.title}
          date={doc.date ?? undefined}
          updatedAt={doc.update ?? undefined}
          wordCount={doc.wordCount}
          breadcrumbs={breadcrumbs}
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
