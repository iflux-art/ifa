import { notFound } from "next/navigation";
import { LayoutContainer } from "@/components/layout";
import {
  LatestPostsCard,
  RelatedPostsCard,
  TagCloudCard,
  BlogCategoryCard,
} from "@/components/sidebar";
import ClientMDXRenderer from "@/components/mdx/client-mdx-renderer";
import { createBlogBreadcrumbs, getBlogContent } from "@/components/posts/lib";
import { TwikooComment } from "@/components/comment";
import { TableOfContents } from "@/components/sidebar";
import { handleContentError } from "@/lib/utils/error";
import { Breadcrumb } from "@/components/posts/breadcrumb";
import { PostMeta } from "@/components/posts/post-meta";
import { cn } from "@/lib/utils";

interface BlogPostPageProps {
  params: Promise<{
    slug: string[];
  }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

/**
 * 计算预计阅读时间
 * 基于中文阅读速度约 300-400 字/分钟，英文约 200-250 词/分钟
 * 这里采用保守估计 250 字/分钟
 */
function _calculateReadingTime(wordCount: number): string {
  if (wordCount === 0) return "0 分钟";

  const wordsPerMinute = 250;
  const minutes = Math.ceil(wordCount / wordsPerMinute);

  if (minutes < 1) return "1 分钟";
  if (minutes < 60) return `${minutes} 分钟`;

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) return `${hours} 小时`;
  return `${hours} 小时 ${remainingMinutes} 分钟`;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug: slugParam } = await params;

  // Validate slug parameter
  if (!Array.isArray(slugParam) || slugParam.length === 0) {
    return notFound();
  }

  try {
    const resolvedParams = { slug: slugParam };
    const {
      slug,
      content,
      frontmatter,
      headings,
      relatedPosts,
      latestPosts,
      allTags,
      allCategories,
    } = await getBlogContent(resolvedParams.slug);
    const title = frontmatter.title ?? slug.join("/");
    const date = frontmatter.date
      ? new Date(frontmatter.date).toLocaleDateString("zh-CN", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : undefined;
    const updatedAt = frontmatter.update
      ? new Date(frontmatter.update).toLocaleDateString("zh-CN", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : undefined;
    // 左侧边栏内容（现在为空）
    const leftSidebar = null;

    // 右侧边栏内容（包含原来左侧边栏的内容）
    const rightSidebar = (
      <>
        <BlogCategoryCard
          categories={allCategories}
          selectedCategory={frontmatter.category}
          enableRouting
          showHeader={false}
        />
        <TagCloudCard
          allTags={allTags}
          selectedTag={undefined}
          useDefaultRouting
        />
        <TableOfContents headings={headings} className="prose-sm" />
        <RelatedPostsCard posts={relatedPosts} currentSlug={slug.slice(1)} />
        <LatestPostsCard posts={latestPosts} currentSlug={slug.slice(1)} />
      </>
    );

    const breadcrumbs = createBlogBreadcrumbs({
      slug: slug.slice(1),
      title,
    });

    return (
      <div className="min-h-screen bg-background">
        <LayoutContainer
          leftSidebar={leftSidebar}
          rightSidebar={rightSidebar}
          layout="double-sidebar"
        >
          <article
            className={cn(
              "prose-container",
              // 添加卡片样式，与博客列表页的文章卡片保持一致
              "rounded-lg border bg-card text-card-foreground shadow-sm",
              // 响应式内边距，与博客卡片保持一致
              "p-3 sm:p-4 md:p-5 lg:p-6",
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
              {/* 使用 PostMeta 组件显示文章元数据 */}
              <PostMeta
                date={date}
                updatedAt={updatedAt}
                wordCount={content.length}
              />
            </header>

            <div className="prose max-w-none prose-zinc dark:prose-invert prose-img:rounded-xl">
              <ClientMDXRenderer content={content} />
            </div>
          </article>
          <TwikooComment />
        </LayoutContainer>
      </div>
    );
  } catch (error: unknown) {
    // 使用统一的错误处理工具记录错误信息
    handleContentError(error, "blog", slugParam.join("/"));

    // 统一使用 notFound() 处理所有 404 错误
    return notFound();
  }
}
