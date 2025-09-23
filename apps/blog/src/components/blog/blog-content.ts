// 移除Node.js模块导入，这些功能现在通过API路由提供
// import fs from "node:fs";
// import path from "node:path";
// import matter from "gray-matter";
import type { BlogFrontmatter } from "./types";

// 更新函数签名，明确表示这是一个应该通过API调用的函数
export async function getBlogContent(_slug: string[]): Promise<{
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
}> {
  // 这个函数现在应该通过API路由获取数据
  // 在客户端使用时，需要通过API调用来获取数据
  throw new Error("This function should be called through API routes");
}
