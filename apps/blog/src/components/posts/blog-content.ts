import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { extractHeadings } from "@/components/posts/lib";

// 内联 BlogFrontmatter 类型定义
export interface BlogFrontmatter {
  /** 文章标题 */
  title: string;
  /** 文章描述 */
  description?: string;
  /** 文章分类 */
  category?: string;
  /** 文章标签 */
  tags?: string[];
  /** 文章创建日期 */
  date?: string;
  /** 文章更新日期 */
  update?: string;
  /** 文章作者 */
  author?: string;
  /** 文章封面图片 */
  cover?: string;
  /** 文章状态 */
  status?: "draft" | "published" | "archived";
  /** 文章访问权限 */
  access?: "public" | "private" | "protected";
  /** 允许任意其他属性 */
  [key: string]: unknown;
}

export function getBlogContent(slug: string[]): {
  slug: string[];
  content: string;
  frontmatter: BlogFrontmatter;
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
  }[];
  allTags: { name: string; count: number }[];
  allCategories: { name: string; count: number }[];
} {
  const filePath = findBlogFile(slug);
  if (!filePath) {
    throw new Error(`未找到博客: ${slug.join("/")}. 请求的博客文章不存在或已被删除。`);
  }
  const fileContent = fs.readFileSync(filePath, "utf8");
  const { content, data } = matter(fileContent);
  const safeFrontmatter = data as BlogFrontmatter;
  const { headings } = extractHeadings(content);

  const allMeta = getAllBlogMeta();
  const currentTags = safeFrontmatter.tags ?? [];
  const currentCategory = safeFrontmatter.category;
  const currentSlugStr = slug.join("/");

  // 计算相关文章
  const candidates = allMeta.filter((item) => item.slug.join("/") !== currentSlugStr);
  let related = candidates.filter((item) => {
    if (!item.frontmatter.tags) {
      return false;
    }
    return item.frontmatter.tags.some((tag: string) => currentTags.includes(tag));
  });

  if (related.length < 10 && currentCategory) {
    const more = candidates.filter((item) => item.frontmatter.category === currentCategory);
    related = related.concat(more);
  }

  if (related.length < 10) {
    const more = candidates.slice(0, 10 - related.length);
    related = related.concat(more);
  }

  const relatedPosts = related.slice(0, 10).map((item) => ({
    title: item.frontmatter.title ?? item.slug.join("/"),
    href: `/posts/${item.slug.join("/")}`,
    category: item.frontmatter.category,
    slug: item.slug,
  }));

  // 计算最新文章
  const latestPosts = candidates
    .filter((item) => item.frontmatter.date)
    .sort((a, b) => {
      const dateA = a.frontmatter.date ? new Date(a.frontmatter.date).getTime() : 0;
      const dateB = b.frontmatter.date ? new Date(b.frontmatter.date).getTime() : 0;
      return dateB - dateA;
    })
    .slice(0, 5)
    .map((item) => ({
      title: item.frontmatter.title ?? item.slug.join("/"),
      href: `/posts/${item.slug.join("/")}`,
      date: item.frontmatter.date?.toString(),
      category: item.frontmatter.category,
    }));

  // 计算所有标签
  const tagCounts: Record<string, number> = {};
  allMeta.forEach((item) => {
    item.frontmatter.tags?.forEach((tag: string) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });
  const allTags = Object.entries(tagCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  // 计算所有分类
  const categoryCounts: Record<string, number> = {};
  allMeta.forEach((item) => {
    if (item.frontmatter.category) {
      categoryCounts[item.frontmatter.category] =
        (categoryCounts[item.frontmatter.category] || 0) + 1;
    }
  });
  const allCategories = Object.entries(categoryCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  return {
    slug,
    content,
    frontmatter: safeFrontmatter,
    headings,
    relatedPosts,
    latestPosts,
    allTags,
    allCategories,
  };
}

function findBlogFile(slug: string[]): string | null {
  const blogDir = path.join(process.cwd(), "src", "content");
  const relativePath = path.join(...slug);

  // 检查直接文件匹配
  const mdxPath = path.join(blogDir, `${relativePath}.mdx`);
  if (fs.existsSync(mdxPath)) {
    return mdxPath;
  }

  const mdPath = path.join(blogDir, `${relativePath}.md`);
  if (fs.existsSync(mdPath)) {
    return mdPath;
  }

  // 检查目录中的索引文件
  const indexMdx = path.join(blogDir, relativePath, "index.mdx");
  if (fs.existsSync(indexMdx)) {
    return indexMdx;
  }

  const indexMd = path.join(blogDir, relativePath, "index.md");
  if (fs.existsSync(indexMd)) {
    return indexMd;
  }

  return null;
}

export function getAllBlogMeta(): {
  slug: string[];
  frontmatter: BlogFrontmatter;
}[] {
  const blogDir = path.join(process.cwd(), "src", "content");
  if (!fs.existsSync(blogDir)) {
    return [];
  }

  const files: string[] = [];

  const scanDirectory = (dir: string) => {
    const items = fs.readdirSync(dir, { withFileTypes: true });
    items.forEach((item) => {
      const itemPath = path.join(dir, item.name);
      if (item.isDirectory()) {
        scanDirectory(itemPath);
      } else if (item.isFile() && (item.name.endsWith(".mdx") || item.name.endsWith(".md"))) {
        files.push(itemPath);
      }
    });
  };

  scanDirectory(blogDir);

  return files.map((filePath) => {
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
}
