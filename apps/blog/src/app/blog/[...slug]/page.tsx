/**
 * 博客文章详情页面
 *
 * 此文件使用Next.js的动态路由功能来处理所有博客文章页面
 * [...slug] 表示捕获所有路径段，例如：
 * - /blog/my-first-post → slug = ['my-first-post']
 * - /blog/category/subcategory/my-post → slug = ['category', 'subcategory', 'my-post']
 *
 * 文件名[...slug]是Next.js动态路由的标准命名方式，不能更改
 */

import { notFound } from "next/navigation";
import { BlogCategoryCard, ContentDisplay } from "@/components/blog";
import { TwikooComment } from "@/components/comment";
import { LayoutContainer } from "@/components/layout";
import ClientMDXRenderer from "@/components/mdx/client-mdx-renderer";
// 移除直接导入，改为通过API调用获取数据
// import { getBlogContent } from "@/components/blog";
import { LatestPostsCard } from "@/components/widgets/latest-posts-card";
import { RelatedPostsCard } from "@/components/widgets/related-posts-card";
import { TableOfContentsCard } from "@/components/widgets/table-of-contents-card";
import { TagCloudCard } from "@/components/widgets/tag-cloud-card";
import { handleContentError } from "@/lib/utils/error";

interface BlogPostPageProps {
  params: Promise<{
    slug: string[];
  }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

// 定义文章数据接口
interface BlogPostData {
  slug: string[];
  content: string;
  frontmatter: {
    title: string;
    date?: string;
    category?: string;
    tags?: string[];
    description?: string;
    author?: string;
    published?: boolean;
    image?: string;
    sticky?: boolean;
  };
  headings: { level: number; text: string; id: string }[];
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
    slug: string[]; // 添加slug字段
  }[];
  allTags: { name: string; count: number }[];
  allCategories: { name: string; count: number }[];
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug: slugParam } = await params;

  // Validate slug parameter
  if (!Array.isArray(slugParam) || slugParam.length === 0) {
    return notFound();
  }

  try {
    const resolvedParams = { slug: slugParam };

    // 通过API路由获取文章数据
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/blog/posts/${encodeURIComponent(slugParam.join("/"))}`,
      {
        next: {
          revalidate: 60, // 60秒重新验证
        },
      },
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch blog post: ${response.status} ${response.statusText}`,
      );
    }

    const {
      slug,
      content,
      frontmatter,
      headings,
      relatedPosts,
      latestPosts,
      allTags,
      // 修复Biome警告：未使用的变量
      // allCategories,
    }: BlogPostData = await response.json();

    const title = frontmatter.title ?? slug; // 使用字符串而不是数组
    const date = frontmatter.date
      ? new Date(frontmatter.date).toLocaleDateString("zh-CN", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : undefined;
    const updatedAt =
      frontmatter.date && typeof frontmatter.date === "string"
        ? new Date(frontmatter.date).toLocaleDateString("zh-CN", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        : undefined;
    // 左侧边栏内容
    const leftSidebar = (
      <>
        <BlogCategoryCard
          title={frontmatter.category || "未分类"}
          category={frontmatter.category}
        />
        <TagCloudCard
          allTags={allTags}
          selectedTag={undefined}
          useDefaultRouting
        />
      </>
    );

    // 右侧边栏内容
    const rightSidebar = (
      <>
        <TableOfContentsCard headings={headings} className="prose-sm" />
        <LatestPostsCard
          posts={latestPosts}
          currentSlug={resolvedParams.slug}
        />
        <RelatedPostsCard
          posts={relatedPosts}
          currentSlug={resolvedParams.slug}
        />
      </>
    );

    return (
      <div className="min-h-screen bg-background">
        <LayoutContainer
          leftSidebar={leftSidebar}
          rightSidebar={rightSidebar}
          layout="double-sidebar"
        >
          <ContentDisplay
            contentType="blog"
            title={title}
            date={date}
            updatedAt={updatedAt}
            wordCount={content.length}
            breadcrumbs={[]}
          >
            <ClientMDXRenderer content={content} />
          </ContentDisplay>
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
