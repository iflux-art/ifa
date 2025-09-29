/**
 * 服务器端工具函数
 * 这些函数只能在服务器端运行，不能在客户端使用
 */

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { BlogFrontmatter } from "@/components/blog/types";

export function getAllBlogMeta(): {
  slug: string[];
  frontmatter: BlogFrontmatter;
}[] {
  const blogDir = path.join(process.cwd(), "src", "content");
  if (!fs.existsSync(blogDir)) return [];

  const files: string[] = [];

  const scanDirectory = (dir: string) => {
    const items = fs.readdirSync(dir, { withFileTypes: true });
    items.forEach((item) => {
      const itemPath = path.join(dir, item.name);
      if (item.isDirectory()) {
        scanDirectory(itemPath);
      } else if (
        item.isFile() &&
        (item.name.endsWith(".mdx") || item.name.endsWith(".md"))
      ) {
        files.push(itemPath);
      }
    });
  };

  scanDirectory(blogDir);

  const posts = files.map((filePath) => {
    const fileContent = fs.readFileSync(filePath, "utf8");
    const { data } = matter(fileContent);
    const relativePath = path.relative(blogDir, filePath);
    const slug = relativePath
      .replace(/\.(mdx|md)$/, "")
      .replace(/\\/g, "/")
      .split("/");

    return {
      slug,
      frontmatter: data as BlogFrontmatter,
    };
  });

  // 按日期倒序排序（最新的文章在前面）
  posts.sort((a, b) => {
    const dateA = a.frontmatter.date
      ? new Date(a.frontmatter.date).getTime()
      : 0;
    const dateB = b.frontmatter.date
      ? new Date(b.frontmatter.date).getTime()
      : 0;
    return dateB - dateA;
  });

  return posts;
}

export function getAllTagsWithCount(): { name: string; count: number }[] {
  const allMeta = getAllBlogMeta();
  const tagCounts: Record<string, number> = {};

  allMeta.forEach((item) => {
    if (item.frontmatter.tags) {
      item.frontmatter.tags.forEach((tag) => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    }
  });

  return Object.entries(tagCounts).map(([name, count]) => ({ name, count }));
}

export function getPostsByTag(tag: string): ReturnType<typeof getAllBlogMeta> {
  return getAllBlogMeta().filter((item) =>
    item.frontmatter.tags?.includes(tag),
  );
}

export function getPostsByYear(): Record<
  string,
  ReturnType<typeof getAllBlogMeta>
> {
  const allMeta = getAllBlogMeta();
  const postsByYear: Record<string, ReturnType<typeof getAllBlogMeta>> = {};

  allMeta.forEach((item) => {
    if (item.frontmatter.date) {
      const year = new Date(item.frontmatter.date).getFullYear().toString();
      if (!postsByYear[year]) {
        postsByYear[year] = [];
      }
      postsByYear[year].push(item);
    }
  });

  // 按年份排序
  return Object.keys(postsByYear)
    .sort((a, b) => parseInt(b, 10) - parseInt(a, 10))
    .reduce(
      (acc, year) => {
        acc[year] = postsByYear[year];
        return acc;
      },
      {} as Record<string, ReturnType<typeof getAllBlogMeta>>,
    );
}

// 添加获取单篇博客文章内容的函数
export function getBlogPostBySlug(slugArray: string[]): {
  slug: string[];
  content: string;
  frontmatter: BlogFrontmatter;
  headings: { level: number; text: string; id: string }[];
} | null {
  try {
    // 构建文件路径
    const contentDir = path.join(process.cwd(), "src", "content");
    const filePath = `${path.join(contentDir, ...slugArray)}.mdx`;
    const alternativePath = `${path.join(contentDir, ...slugArray)}.md`;

    // 检查文件是否存在
    let fullPath = "";
    if (fs.existsSync(filePath)) {
      fullPath = filePath;
    } else if (fs.existsSync(alternativePath)) {
      fullPath = alternativePath;
    } else {
      return null;
    }

    // 读取文件内容
    const fileContent = fs.readFileSync(fullPath, "utf8");
    const { content, data } = matter(fileContent);

    // 提取标题用于目录
    const headings = extractHeadings(content);

    return {
      slug: slugArray,
      content,
      frontmatter: data as BlogFrontmatter,
      headings,
    };
  } catch (error) {
    console.error("获取博客文章失败:", error);
    return null;
  }
}

// 提取标题用于目录
function extractHeadings(content: string) {
  const headingRegex = /^(#{1,6})\s+(.*?)$/gm;
  const headings = [];
  let match: RegExpExecArray | null = null;

  // biome-ignore lint/suspicious/noAssignInExpressions: 这是正则表达式匹配的标准写法，while循环中需要对match变量进行赋值操作
  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    // 生成ID（简单实现，实际项目中可能需要更复杂的逻辑）
    const id = text
      .toLowerCase()
      .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-")
      .replace(/^-+|-+$/g, "");

    headings.push({
      level,
      text,
      id,
    });
  }

  return headings;
}
