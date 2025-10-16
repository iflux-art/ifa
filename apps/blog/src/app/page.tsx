import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { getAllPosts, getAllTagsWithCount } from "@/components/features/posts/lib";

export const metadata: Metadata = {
  title: "博客",
};

// 动态导入博客页面容器组件
const BlogPageContainer = dynamic(
  () => import("@/components/layout/blog-page").then((mod) => mod.BlogPageContainer),
  {
    ssr: true,
  }
);

// 服务端获取所有需要的数据
async function getBlogPageData() {
  try {
    // 获取所有文章
    const allPosts = await getAllPosts();

    // 获取所有标签及其计数
    const tagsWithCount = getAllTagsWithCount();
    const allTags = Object.entries(tagsWithCount)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    // 获取所有分类及其计数
    const allCategories: Record<string, number> = {};
    allPosts.forEach((post) => {
      if (post.category) {
        allCategories[post.category] = (allCategories[post.category] || 0) + 1;
      }
    });
    const categories = Object.entries(allCategories)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    // 获取最新文章（前5篇）
    const latestPosts = allPosts
      .filter((post) => post.date)
      .sort((a, b) => {
        // 安全地处理日期，避免非空断言
        const dateA = a.date ? new Date(a.date).getTime() : 0;
        const dateB = b.date ? new Date(b.date).getTime() : 0;
        return dateB - dateA;
      })
      .slice(0, 5)
      .map((post) => ({
        title: post.title ?? post.slug,
        href: `/posts/${post.slug}`,
        date: post.date,
        category: post.category,
      }));

    // 获取相关文章（这里我们选择最新的10篇文章作为相关文章）
    const relatedPosts = allPosts.slice(0, 10).map((post) => ({
      title: post.title ?? post.slug,
      href: `/posts/${post.slug}`,
      category: post.category,
      slug: post.slug.split("/"),
    }));

    return {
      allPosts,
      allTags,
      categories,
      latestPosts,
      relatedPosts,
    };
  } catch (error) {
    console.error("获取博客页面数据失败:", error);
    return {
      allPosts: [],
      allTags: [],
      categories: [],
      latestPosts: [],
      relatedPosts: [],
    };
  }
}

export default async function Home() {
  const { allPosts, allTags, categories, latestPosts, relatedPosts } = await getBlogPageData();

  return (
    <BlogPageContainer
      initialPosts={allPosts}
      allTags={allTags}
      categories={categories}
      latestPosts={latestPosts}
      relatedPosts={relatedPosts}
    />
  );
}
