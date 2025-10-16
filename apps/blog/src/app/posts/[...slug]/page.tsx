import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import { getBlogContent } from "@/components/features/posts/lib";
import { handleContentError } from "@/lib/utils/error";

interface BlogPostPageProps {
  params: Promise<{
    slug: string[];
  }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

// 动态导入博客文章页面容器组件
const BlogPostPageContainer = dynamic(
  () => import("@/components/layout/blog-post-page").then((mod) => mod.default),
  {
    ssr: true,
  }
);

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

    return (
      <BlogPostPageContainer
        slug={slug}
        content={content}
        frontmatter={frontmatter}
        headings={headings}
        relatedPosts={relatedPosts}
        latestPosts={latestPosts}
        allTags={allTags}
        allCategories={allCategories}
      />
    );
  } catch (error: unknown) {
    // 使用统一的错误处理工具记录错误信息
    handleContentError(error, "blog", slugParam.join("/"));

    // 统一使用 notFound() 处理所有 404 错误
    return notFound();
  }
}
