/**
 * 博客应用缓存配置和策略
 * 针对博客内容优化的缓存机制
 */

// 缓存键前缀
export const CACHE_PREFIXES = {
  POST: "post",
  API: "api",
  STATIC: "static",
  SEARCH: "search",
  METADATA: "metadata",
} as const;

// 缓存过期时间（秒）
export const CACHE_TTL = {
  SHORT: 5 * 60, // 5分钟
  MEDIUM: 30 * 60, // 30分钟
  LONG: 2 * 60 * 60, // 2小时
  VERY_LONG: 24 * 60 * 60, // 24小时
  PERMANENT: 7 * 24 * 60 * 60, // 7天
} as const;

// 博客特定缓存策略
export const CACHE_STRATEGIES = {
  // 博客文章缓存策略
  BLOG_POSTS: {
    ttl: CACHE_TTL.VERY_LONG,
    staleWhileRevalidate: true,
    maxAge: CACHE_TTL.LONG,
    sMaxAge: CACHE_TTL.VERY_LONG,
  },

  // 博客列表缓存策略
  BLOG_LIST: {
    ttl: CACHE_TTL.MEDIUM,
    staleWhileRevalidate: true,
    maxAge: CACHE_TTL.SHORT,
    sMaxAge: CACHE_TTL.MEDIUM,
  },

  // 搜索结果缓存策略
  SEARCH_RESULTS: {
    ttl: CACHE_TTL.SHORT,
    staleWhileRevalidate: true,
    maxAge: CACHE_TTL.SHORT,
    sMaxAge: CACHE_TTL.SHORT,
  },

  // 静态资源缓存策略
  STATIC_ASSETS: {
    ttl: CACHE_TTL.PERMANENT,
    staleWhileRevalidate: true,
    maxAge: CACHE_TTL.PERMANENT,
    sMaxAge: CACHE_TTL.PERMANENT,
  },

  // API 响应缓存策略
  API_RESPONSES: {
    ttl: CACHE_TTL.MEDIUM,
    staleWhileRevalidate: true,
    maxAge: CACHE_TTL.SHORT,
    sMaxAge: CACHE_TTL.MEDIUM,
  },
} as const;

/**
 * 生成缓存键
 */
export function generateCacheKey(prefix: keyof typeof CACHE_PREFIXES, ...parts: string[]): string {
  return `${CACHE_PREFIXES[prefix]}:${parts.join(":")}`;
}

/**
 * 缓存控制头生成器
 */
export function generateCacheHeaders(
  strategy: keyof typeof CACHE_STRATEGIES
): Record<string, string> {
  const config = CACHE_STRATEGIES[strategy];

  const headers: Record<string, string> = {};

  if (config.staleWhileRevalidate) {
    headers["Cache-Control"] =
      `public, max-age=${config.maxAge}, s-maxage=${config.sMaxAge}, stale-while-revalidate=${config.ttl}`;
  } else {
    headers["Cache-Control"] = `public, max-age=${config.maxAge}, s-maxage=${config.sMaxAge}`;
  }

  // 添加 ETag 支持
  headers.ETag = `"${Date.now()}"`;

  return headers;
}

/**
 * MDX 内容缓存管理器
 */
const mdxCache = new Map<string, { content: unknown; lastModified: number; etag: string }>();

export const MDXCache = {
  set(path: string, content: unknown, lastModified: number): void {
    const etag = `"${path}-${lastModified}"`;
    mdxCache.set(path, { content, lastModified, etag });
  },

  get(path: string, lastModified: number): { content: unknown; etag: string } | null {
    const cached = mdxCache.get(path);

    if (!cached || cached.lastModified !== lastModified) {
      return null;
    }

    return {
      content: cached.content,
      etag: cached.etag,
    };
  },

  clear(): void {
    mdxCache.clear();
  },

  getSize(): number {
    return mdxCache.size;
  },
};

/**
 * 博客搜索缓存
 */
const searchCache = new Map<string, { results: unknown[]; timestamp: number }>();
const SEARCH_TTL = CACHE_TTL.SHORT * 1000; // 转换为毫秒

export const SearchCache = {
  set(query: string, results: unknown[]): void {
    searchCache.set(query.toLowerCase(), {
      results,
      timestamp: Date.now(),
    });
  },

  get(query: string): unknown[] | null {
    const cached = searchCache.get(query.toLowerCase());

    if (!cached || Date.now() - cached.timestamp > SEARCH_TTL) {
      if (cached) {
        searchCache.delete(query.toLowerCase());
      }
      return null;
    }

    return cached.results;
  },

  clear(): void {
    searchCache.clear();
  },

  cleanup(): void {
    const now = Date.now();
    for (const [key, value] of searchCache.entries()) {
      if (now - value.timestamp > SEARCH_TTL) {
        searchCache.delete(key);
      }
    }
  },
};

// 定期清理搜索缓存
if (typeof window === "undefined") {
  setInterval(
    () => {
      SearchCache.cleanup();
    },
    5 * 60 * 1000
  ); // 每5分钟清理一次
}
