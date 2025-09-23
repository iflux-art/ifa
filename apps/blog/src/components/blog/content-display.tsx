import type React from "react";
import { Breadcrumb } from "@/components/content-header/breadcrumb";
import { ContentMetadata } from "@/components/content-header/content-metadata";
import { cn } from "@/lib/utils";

/** 内容显示类型 */
export type ContentType = "blog" | "docs";

export interface ContentDisplayProps {
  contentType: ContentType;
  title: string;
  date?: string | null;
  updatedAt?: string | null;
  wordCount?: number;
  children?: React.ReactNode;
  className?: string;
  breadcrumbs?: { label: string; href?: string }[];
}

/**
 * 内容显示组件
 *
 * 用于显示博客文章或文档的主要内容，包括标题、元数据和正文
 *
 * @example
 * ```tsx
 * <ContentDisplay
 *   contentType="blog"
 *   title="Hello World"
 *   date="2023-01-01"
 *   wordCount={1000}
 * >
 *   <MDXContent />
 * </ContentDisplay>
 * ```
 */
export const ContentDisplay = ({
  title,
  date,
  updatedAt,
  wordCount = 0,
  children,
  className,
  breadcrumbs,
}: ContentDisplayProps) => {
  return (
    <article
      className={cn(
        "prose-container",
        // 添加卡片样式，与博客列表页的文章卡片保持一致
        "rounded-lg border bg-card text-card-foreground shadow-sm",
        // 响应式内边距，与博客卡片保持一致
        "p-3 sm:p-4 md:p-5 lg:p-6",
        className,
      )}
    >
      {/* 面包屑导航 */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <div className="mb-6">
          <Breadcrumb items={breadcrumbs} />
        </div>
      )}

      <header className="mb-8">
        <h1 className="mb-8 text-4xl font-bold tracking-tight sm:text-4xl">
          {title}
        </h1>
        <ContentMetadata
          date={date}
          updatedAt={updatedAt}
          wordCount={wordCount}
        />
      </header>

      <div className="prose max-w-none prose-zinc dark:prose-invert prose-img:rounded-xl">
        {children}
      </div>
    </article>
  );
};
