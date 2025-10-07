/**
 * 服务端工具函数
 * 提供只能在服务端运行的功能
 */

import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import type { BlogPost, BlogSearchResult } from "@/components/posts/blog-types";

interface BlogPostInternal {
  title: string;
  description: string;
  content: string;
  url: string;
  date: string;
  slug: string;
}

interface Frontmatter {
  title?: string;
  description?: string;
  date?: string;
  [key: string]: unknown;
}

/**
 * 递归读取目录下的所有 .md 和 .mdx 文件
 */
async function getAllFiles(dirPath: string): Promise<string[]> {
  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    const files = await Promise.all(
      entries.map((entry) => {
        const res = path.resolve(dirPath, entry.name);
        return entry.isDirectory() ? getAllFiles(res) : res;
      }),
    );
    return files.flat().filter((file) => /\.(md|mdx)$/.test(file));
  } catch (error) {
    console.error("Error reading directory:", error);
    return [];
  }
}

/**
 * 读取博客内容
 */
export async function getBlogPosts(): Promise<BlogPost[]> {
  const blogDir = path.join(process.cwd(), "src/content");
  const files = await getAllFiles(blogDir);

  const posts = await Promise.all(
    files.map(async (file) => {
      try {
        const content = await fs.readFile(file, "utf-8");
        const { data } = matter(content);
        const frontmatter = data as Frontmatter;
        const relativePath = path.relative(blogDir, file);
        const _url = `/posts/${relativePath.replace(/\.(md|mdx)$/, "")}`;
        const slug = relativePath.replace(/\.(md|mdx)$/, "");

        return {
          id: slug,
          title: frontmatter.title ?? "",
          description: frontmatter.description ?? "",
          date: frontmatter.date ?? "",
          slug,
        } as BlogPost;
      } catch (error) {
        console.error("Error reading file:", file, error);
        return {
          id: "",
          title: "",
          description: "",
          date: "",
          slug: "",
        } as BlogPost;
      }
    }),
  );

  return posts;
}

/**
 * 搜索博客文章
 */
export async function searchBlogPosts(
  query: string,
  limit = 10,
): Promise<BlogSearchResult[]> {
  try {
    // 获取内部博客文章数据用于搜索
    const blogDir = path.join(process.cwd(), "src/content");
    const files = await getAllFiles(blogDir);

    const blogPostsInternal: BlogPostInternal[] = await Promise.all(
      files.map(async (file) => {
        try {
          const content = await fs.readFile(file, "utf-8");
          const { data, content: markdown } = matter(content);
          const frontmatter = data as Frontmatter;
          const relativePath = path.relative(blogDir, file);
          const url = `/posts/${relativePath.replace(/\.(md|mdx)$/, "")}`;
          const slug = relativePath.replace(/\.(md|mdx)$/, "");

          return {
            title: frontmatter.title ?? "",
            description: frontmatter.description ?? "",
            content: markdown,
            url,
            date: frontmatter.date ?? "",
            slug,
          };
        } catch (error) {
          console.error("Error reading file:", file, error);
          return {
            title: "",
            description: "",
            content: "",
            url: "",
            date: "",
            slug: "",
          };
        }
      }),
    );

    const searchResults = blogPostsInternal
      .filter((post) => {
        const searchContent =
          `${post.title} ${post.description} ${post.content}`.toLowerCase();
        return searchContent.includes(query.toLowerCase());
      })
      .map((post, index) => ({
        id: `search-result-${index}`, // 生成一个临时ID
        title: post.title,
        description: post.description,
        category: undefined, // 搜索结果中不包含分类信息
        tags: undefined, // 搜索结果中不包含标签信息
        date: post.date,
        url: post.url,
        score: 0, // TODO: 实现实际的评分算法
      }))
      .slice(0, limit);

    return searchResults;
  } catch (error) {
    console.error("Error searching blog posts:", error);
    return [];
  }
}
