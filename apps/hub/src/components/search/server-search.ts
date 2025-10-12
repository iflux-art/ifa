/**
 * 服务端搜索工具函数
 * 仅用于 API routes 和其他服务端环境，不应在客户端导入
 */

import { promises as fs } from "node:fs";
import path from "node:path";
import type { SearchResult } from "./hub-search-types";

interface LinkItem {
  title: string;
  description?: string;
  url?: string;
  tags?: string[];
}

// 内存缓存
let contentCache: {
  links: SearchResult[];
  timestamp: number;
} | null = null;

const CACHE_TTL = 5 * 60 * 1000; // 5分钟缓存

/**
 * 扫描链接文件
 */
async function scanLinkFiles(): Promise<SearchResult[]> {
  const results: SearchResult[] = [];

  try {
    // 直接从 links-data.json 读取数据
    const linksFilePath = path.join(process.cwd(), "src/components/links/links-data.json");
    const fileContent = await fs.readFile(linksFilePath, "utf8");
    const items: LinkItem[] = JSON.parse(fileContent);

    items.forEach((item) => {
      results.push({
        type: "link",
        title: item.title,
        description: item.description,
        url: item.url,
        tags: item.tags,
      });
    });
  } catch (error) {
    console.error("Error scanning link files:", error);
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

  const links = await scanLinkFiles();

  contentCache = { links, timestamp: now };
  return contentCache;
}

/**
 * 执行服务端搜索
 */
export async function performServerSearch(
  query: string,
  type = "all",
  limit = 10
): Promise<{ results: SearchResult[]; total: number }> {
  if (!query.trim()) {
    return { results: [], total: 0 };
  }

  const { links } = await getCachedContent();
  const results: SearchResult[] = [];
  const queryLower = query.toLowerCase();

  // 搜索链接
  if (type === "all" || type === "links") {
    const linkResults = links
      .filter((link) => {
        const searchText =
          `${link.title} ${link.description} ${link.tags?.join(" ")}`.toLowerCase();
        return searchText.includes(queryLower);
      })
      .slice(0, limit);
    results.push(...linkResults);
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
