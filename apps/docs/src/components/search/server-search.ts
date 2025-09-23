/**
 * 服务端搜索工具函数
 * 仅用于 API routes 和其他服务端环境，不应在客户端导入
 */

import { promises as fs } from "node:fs";
import path from "node:path";
import { glob } from "fast-glob";
import matter from "gray-matter";
import type { SearchResult } from "@/components/search";

// 内存缓存
let contentCache: {
  docs: SearchResult[];
  timestamp: number;
} | null = null;

const CACHE_TTL = 5 * 60 * 1000; // 5分钟缓存

/**
 * 扫描内容文件（文档）
 */
async function scanContentFiles(): Promise<SearchResult[]> {
  const basePath = path.join(process.cwd(), "src/content/docs");
  const files = await glob("**/*.mdx", { cwd: basePath });
  const results: SearchResult[] = [];

  for (const file of files) {
    try {
      const filePath = path.join(basePath, file);
      const content = await fs.readFile(filePath, "utf-8");

      try {
        const { data: frontmatter } = matter(content);
        if (frontmatter?.title && typeof frontmatter.title === "string") {
          results.push({
            id: `doc-${file.replace(/\.mdx$/, "")}`,
            type: "doc",
            title: frontmatter.title,
            description:
              typeof frontmatter.description === "string"
                ? frontmatter.description
                : undefined,
            path: `/docs/${file.replace(/\.mdx$/, "")}`,
            tags: Array.isArray(frontmatter.tags)
              ? frontmatter.tags
              : undefined,
          });
        }
      } catch {
        // Skip files with invalid frontmatter format
      }
    } catch {
      // Skip files that cannot be read
    }
  }

  return results;
}

/**
 * 获取缓存的内容
 */
export async function getCachedContent() {
  const now = Date.now();
  if (contentCache && now - contentCache.timestamp < CACHE_TTL) {
    return contentCache;
  }

  const docs = await scanContentFiles();

  contentCache = { docs, timestamp: now };
  return contentCache;
}

/**
 * 执行服务端搜索
 */
export async function performServerSearch(
  query: string,
  type = "doc",
  limit = 10,
): Promise<{ results: SearchResult[]; total: number }> {
  if (!query.trim()) {
    return { results: [], total: 0 };
  }

  const { docs } = await getCachedContent();
  const results: SearchResult[] = [];
  const queryLower = query.toLowerCase();

  // 只搜索文档
  if (type === "all" || type === "doc") {
    const docResults = docs
      .filter((doc) => {
        const searchText = `${doc.title} ${doc.description}`.toLowerCase();
        return searchText.includes(queryLower);
      })
      .slice(0, limit);
    results.push(...docResults);
  }

  // 按匹配度排序
  results.sort((a, b) => {
    const aScore = a.title.toLowerCase().includes(queryLower) ? 1 : 0;
    const bScore = b.title.toLowerCase().includes(queryLower) ? 1 : 0;
    return bScore - aScore;
  });

  return {
    results: results.slice(0, limit),
    total: results.length,
  };
}
