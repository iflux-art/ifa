import { type NextRequest, NextResponse } from "next/server";
import { setCacheHeaders } from "@/lib/api/cache-utils";
import { getAllBlogMeta, getBlogPostBySlug } from "@/lib/server-utils";

// 获取单篇博客文章内容
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const resolvedParams = await params;
    const slugPath = resolvedParams.slug;

    // 首先解码URL编码的slug
    const decodedSlug = decodeURIComponent(slugPath);

    // 处理可能包含逗号或斜杠的slug（这是Next.js动态路由的一个特殊情况）
    // 如果slug包含逗号，说明它实际上应该是一个路径数组
    let slugArray: string[];
    if (decodedSlug.includes(",")) {
      // 处理Next.js的特殊数组参数格式
      slugArray = decodedSlug.split(",");
    } else if (decodedSlug.includes("/")) {
      // 按斜杠分割
      slugArray = decodedSlug.split("/");
    } else if (decodedSlug.includes("%2F")) {
      // 处理URL编码的斜杠
      slugArray = decodedSlug.split("%2F");
    } else {
      // 单个slug段
      slugArray = [decodedSlug];
    }

    // 进一步处理可能仍然包含编码字符的slug段
    // 确保每个段都被正确解码
    const properlyDecodedSlugArray = slugArray.map(segment => {
      // 对每个段再次解码，处理可能的嵌套编码
      return decodeURIComponent(segment);
    });

    // 使用服务器端工具函数获取文章
    const post = getBlogPostBySlug(properlyDecodedSlugArray);

    if (!post) {
      return NextResponse.json({ error: "文章未找到" }, { status: 404 });
    }

    // 获取相关数据
    const allTags = getAllBlogMeta()
      .flatMap((item) => item.frontmatter.tags || [])
      .reduce(
        (acc, tag) => {
          acc[tag] = (acc[tag] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>,
      );

    const tagList = Object.entries(allTags).map(([name, count]) => ({
      name,
      count,
    }));

    // 获取最新文章
    const latestPosts = getAllBlogMeta()
      .sort((a, b) => {
        const dateA = a.frontmatter.date
          ? new Date(a.frontmatter.date).getTime()
          : 0;
        const dateB = b.frontmatter.date
          ? new Date(b.frontmatter.date).getTime()
          : 0;
        return dateB - dateA;
      })
      .slice(0, 5)
      .map((item) => ({
        title: item.frontmatter.title,
        href: `/posts/${item.slug.join("/")}`,
        date: item.frontmatter.date,
        category: item.frontmatter.category,
        slug: item.slug,
      }));

    // 获取相关文章（同标签的文章）
    const relatedPosts = getAllBlogMeta()
      .filter(
        (item) =>
          item.slug.join("/") !== properlyDecodedSlugArray.join("/") &&
          item.frontmatter.tags?.some((tag) =>
            post.frontmatter.tags?.includes(tag),
          ),
      )
      .slice(0, 5)
      .map((item) => ({
        title: item.frontmatter.title,
        href: `/posts/${item.slug.join("/")}`,
        category: item.frontmatter.category,
        slug: item.slug,
      }));

    const result = {
      slug: post.slug,
      content: post.content,
      frontmatter: post.frontmatter,
      headings: post.headings,
      relatedPosts,
      latestPosts,
      allTags: tagList,
      allCategories: [], // 如果需要分类数据可以在这里添加
    };

    // 设置缓存控制头
    const headers = setCacheHeaders("semiStatic");
    return NextResponse.json(result, { headers });
  } catch (error) {
    console.error("获取博客文章失败:", error);
    return NextResponse.json(
      {
        error: "获取博客文章失败",
        details: error instanceof Error ? error.message : "未知错误",
      },
      { status: 500 },
    );
  }
}
