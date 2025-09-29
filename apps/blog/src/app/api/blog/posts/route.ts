import { NextResponse } from "next/server";
import { getAllBlogMeta } from "@/lib/server-utils";
import { setCacheHeaders } from "@/lib/api/cache-utils";

/**
 * 获取博客文章列表的 API 路由
 *
 * @returns 包含所有博客文章元数据的数组
 */
export function GET() {
  try {
    // 使用服务器端工具函数获取所有文章元数据
    const allPosts = getAllBlogMeta();

    // 转换数据格式以匹配前端期望的结构
    const posts = allPosts.map((item) => ({
      slug: item.slug,
      title: item.frontmatter.title,
      description: item.frontmatter.description || "",
      tags: item.frontmatter.tags || [],
      date: item.frontmatter.date,
      category: item.frontmatter.category,
      author: item.frontmatter.author,
      published: item.frontmatter.published ?? true,
      excerpt: "", // excerpt 不在 BlogFrontmatter 中定义
      featured: false, // featured 不在 BlogFrontmatter 中定义
      image: item.frontmatter.image,
      readingTime: undefined, // readingTime 不在 BlogFrontmatter 中定义
      views: item.frontmatter.sticky ? 0 : undefined, // views 不在 BlogFrontmatter 中定义，但 sticky 存在
      likes: undefined, // likes 不在 BlogFrontmatter 中定义
    }));

    // 设置缓存控制头
    const headers = setCacheHeaders("semiStatic");
    return NextResponse.json(posts, { headers });
  } catch (error) {
    console.error("获取博客文章列表失败:", error);
    return NextResponse.json(
      { error: "获取博客文章列表失败" },
      { status: 500 },
    );
  }
}
