"use client";

import { TwikooComment } from "@/components/comment";
import ClientMDXRenderer from "@/components/mdx/client-mdx-renderer";
import type { BlogFrontmatter } from "@/components/posts/blog-content";
import { Breadcrumb } from "@/components/posts/breadcrumb";
import { createBlogBreadcrumbs } from "@/components/posts/client-utils";
import { PostMeta } from "@/components/posts/post-meta";
import { BlogCategoryCard } from "@/components/sidebar/blog-category-card";
import { LatestPostsCard } from "@/components/sidebar/latest-posts-card";
import { RelatedPostsCard } from "@/components/sidebar/related-posts-card";
import { SidebarWrapper } from "@/components/sidebar/sidebar-wrapper";
import { TableOfContents } from "@/components/sidebar/table-of-contents";
import { TagCloudCard } from "@/components/sidebar/tag-cloud-card";
import { cn } from "@/lib/utils";

interface BlogPostPageProps {
  slug: string[];
  content: string;
  frontmatter: BlogFrontmatter;
  headings: {
    id: string;
    text: string;
    level: number;
  }[];
  relatedPosts: {
    title: string;
    href: string;
    category?: string;
    slug: string[];
  }[];
  latestPosts: {
    title: string;
    href: string;
    date?: string;
    category?: string;
  }[];
  allTags: {
    name: string;
    count: number;
  }[];
  allCategories: {
    name: string;
    count: number;
  }[];
}

/**
 * 计算预计阅读时间
 * 基于中文阅读速度约 300-400 字/分钟，英文约 200-250 词/分钟
 * 这里采用保守估计 250 字/分钟
 */
function _calculateReadingTime(wordCount: number): string {
  if (wordCount === 0) {
    return "0 分钟";
  }

  const wordsPerMinute = 250;
  const minutes = Math.ceil(wordCount / wordsPerMinute);

  if (minutes < 1) {
    return "1 分钟";
  }

  if (minutes < 60) {
    return `${minutes} 分钟`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) {
    return `${hours} 小时`;
  }

  return `${hours} 小时 ${remainingMinutes} 分钟`;
}

/**
 * 博客文章页面容器组件
 * 处理博客文章的展示逻辑
 */
export const BlogPostPageContainer = ({
  slug,
  content,
  frontmatter,
  headings,
  relatedPosts,
  latestPosts,
  allTags,
  allCategories,
}: BlogPostPageProps) => {
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

  // 获取当前文章的所有标签
  const currentTags = frontmatter.tags || [];

  // 左侧边栏内容（包含原来右侧边栏的内容）
  const leftSidebar = (
    <>
      <BlogCategoryCard
        categories={allCategories}
        selectedCategory={frontmatter.category}
        enableRouting
        showHeader={false}
      />
      <TagCloudCard allTags={allTags} selectedTags={currentTags} useDefaultRouting />
      <TableOfContents headings={headings} className="prose-sm" />
      <RelatedPostsCard posts={relatedPosts} currentSlug={slug.slice(1)} />
      <LatestPostsCard posts={latestPosts} currentSlug={slug.slice(1)} />
    </>
  );

  // 右侧边栏内容（现在为空）
  const _rightSidebar = null; // 保留变量但添加下划线前缀以避免未使用警告

  const breadcrumbs = createBlogBreadcrumbs({
    slug: slug.slice(1),
    title,
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-4">
        <div className="pb-8">
          <div className="grid grid-cols-12 gap-4 sm:gap-6">
            {/* 左侧空列 - 占2列，只在xl和2xl断点下显示 */}
            <div className="hidden xl:col-span-2 xl:block"></div>

            {/* 主内容区域 - 在小屏幕上占12列，在xl及以上占8列 */}
            <div className="col-span-12 xl:col-span-8">
              <div className="grid grid-cols-12 gap-4 sm:gap-6">
                {/* Sidebar - 占3列 */}
                <div className="col-span-12 md:col-span-3 lg:col-span-3 xl:col-span-3">
                  <SidebarWrapper
                    config={{
                      sticky: true,
                      stickyTop: "80px",
                      responsive: {
                        hideOnMobile: true,
                        hideOnTablet: false,
                        hideOnDesktop: false,
                      },
                    }}
                  >
                    <div className="space-y-6">{leftSidebar}</div>
                  </SidebarWrapper>
                </div>

                {/* 文章内容区域 - 占9列 */}
                <div className="col-span-12 md:col-span-9 lg:col-span-9 xl:col-span-9">
                  <article
                    className={cn(
                      "prose-container",
                      // 添加卡片样式，与博客列表页的文章卡片保持一致
                      "rounded-lg border bg-card text-card-foreground shadow-sm",
                      // 响应式内边距，与博客卡片保持一致
                      "p-3 sm:p-4 md:p-5 lg:p-6"
                    )}
                  >
                    {/* 面包屑导航 */}
                    {breadcrumbs && breadcrumbs.length > 0 && (
                      <div className="mb-6">
                        <Breadcrumb items={breadcrumbs} />
                      </div>
                    )}

                    <header className="mb-8">
                      <h1 className="mb-8 font-bold text-4xl tracking-tight sm:text-4xl">
                        {title}
                      </h1>
                      {/* 使用 PostMeta 组件显示文章元数据 */}
                      <PostMeta date={date} updatedAt={updatedAt} wordCount={content.length} />
                    </header>

                    <div className="prose prose-zinc dark:prose-invert max-w-none prose-img:rounded-xl">
                      <ClientMDXRenderer content={content} />
                    </div>
                  </article>
                  <TwikooComment />
                </div>
              </div>
            </div>

            {/* 右侧空列 - 占2列，只在xl和2xl断点下显示 */}
            <div className="hidden xl:col-span-2 xl:block"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPostPageContainer;
