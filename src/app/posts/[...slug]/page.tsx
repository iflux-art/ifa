import { notFound } from "next/navigation";
import { getBlogContent } from "@/components/features/posts/blog-content";
import { BlogPostPageContainer } from "@/components/layout/blog-post-page";
import { handleContentError } from "@/lib/utils/error";

interface BlogPostPageProps {
	params: Promise<{
		slug: string[];
	}>;
	searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

/**
 * 静态生成所有博客文章路径
 * 启用 SSG (Static Site Generation)
 */
export async function generateStaticParams() {
	const { getBlogCache } = await import("@/components/features/posts/lib");
	const cache = await getBlogCache();

	return cache.posts.map((post) => ({
		slug: post.slug.split("/"),
	}));
}

/**
 * ISR: 每小时重新验证一次
 */
export const revalidate = 3600;

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
