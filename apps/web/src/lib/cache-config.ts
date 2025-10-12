/**
 * 缓存配置和策略
 * 实现智能的构建缓存和运行时缓存机制
 */

// 缓存键前缀
export const CACHE_PREFIXES = {
  API: "api",
  STATIC: "static",
  DYNAMIC: "dynamic",
  USER: "user",
  SYSTEM: "system",
} as const;

// 缓存过期时间（秒）
export const CACHE_TTL = {
  SHORT: 5 * 60, // 5分钟
  MEDIUM: 30 * 60, // 30分钟
  LONG: 2 * 60 * 60, // 2小时
  VERY_LONG: 24 * 60 * 60, // 24小时
  PERMANENT: 7 * 24 * 60 * 60, // 7天
} as const;

// 缓存策略配置
export const CACHE_STRATEGIES = {
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

  // 页面缓存策略
  PAGE_CACHE: {
    ttl: CACHE_TTL.LONG,
    staleWhileRevalidate: true,
    maxAge: CACHE_TTL.MEDIUM,
    sMaxAge: CACHE_TTL.LONG,
  },

  // 用户数据缓存策略
  USER_DATA: {
    ttl: CACHE_TTL.SHORT,
    staleWhileRevalidate: false,
    maxAge: 0,
    sMaxAge: CACHE_TTL.SHORT,
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
 * 内存缓存管理器
 */
export class MemoryCache {
  private cache = new Map<string, { data: unknown; expires: number; hits: number }>();
  private maxSize: number;
  private cleanupInterval: NodeJS.Timeout;

  constructor(maxSize = 1000) {
    this.maxSize = maxSize;

    // 定期清理过期缓存
    this.cleanupInterval = setInterval(
      () => {
        this.cleanup();
      },
      5 * 60 * 1000
    ); // 每5分钟清理一次
  }

  set(key: string, data: unknown, ttl: number): void {
    // 如果缓存已满，删除最少使用的项
    if (this.cache.size >= this.maxSize) {
      this.evictLeastUsed();
    }

    const expires = Date.now() + ttl * 1000;
    this.cache.set(key, { data, expires, hits: 0 });
  }

  get(key: string): unknown | null {
    const item = this.cache.get(key);

    if (!item) {
      return null;
    }

    // 检查是否过期
    if (Date.now() > item.expires) {
      this.cache.delete(key);
      return null;
    }

    // 增加命中次数
    item.hits++;

    return item.data;
  }

  has(key: string): boolean {
    const item = this.cache.get(key);
    return item !== undefined && Date.now() <= item.expires;
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expires) {
        this.cache.delete(key);
      }
    }
  }

  private evictLeastUsed(): void {
    let leastUsedKey = "";
    let leastHits = Infinity;

    for (const [key, item] of this.cache.entries()) {
      if (item.hits < leastHits) {
        leastHits = item.hits;
        leastUsedKey = key;
      }
    }

    if (leastUsedKey) {
      this.cache.delete(leastUsedKey);
    }
  }

  getStats(): { size: number; maxSize: number; hitRate: number } {
    const totalHits = Array.from(this.cache.values()).reduce((sum, item) => sum + item.hits, 0);
    const totalRequests = this.cache.size;

    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      hitRate: totalRequests > 0 ? totalHits / totalRequests : 0,
    };
  }

  destroy(): void {
    clearInterval(this.cleanupInterval);
    this.clear();
  }
}

// 全局内存缓存实例
export const memoryCache = new MemoryCache();

/**
 * 智能缓存装饰器
 */
export function cached(
  ttl: number = CACHE_TTL.MEDIUM,
  keyGenerator?: (...args: unknown[]) => string
) {
  return (_target: unknown, propertyName: string, descriptor: PropertyDescriptor) => {
    const method = descriptor.value;

    descriptor.value = async function (...args: unknown[]) {
      const cacheKey = keyGenerator
        ? keyGenerator(...args)
        : generateCacheKey("DYNAMIC", propertyName, JSON.stringify(args));

      // 尝试从缓存获取
      const cached = memoryCache.get(cacheKey);
      if (cached !== null) {
        return cached;
      }

      // 执行原方法
      const result = await method.apply(this, args);

      // 存储到缓存
      memoryCache.set(cacheKey, result, ttl);

      return result;
    };

    return descriptor;
  };
}

/**
 * 缓存预热器
 */
const warmupTasks: Array<() => Promise<void>> = [];

export const CacheWarmer = {
  addWarmupTask(task: () => Promise<void>): void {
    warmupTasks.push(task);
  },

  async warmup(): Promise<void> {
    console.log("🔥 开始缓存预热...");

    const results = await Promise.allSettled(warmupTasks.map((task) => task()));

    const successful = results.filter((r) => r.status === "fulfilled").length;
    const failed = results.filter((r) => r.status === "rejected").length;

    console.log(`✅ 缓存预热完成: ${successful} 成功, ${failed} 失败`);
  },
};

/**
 * 缓存性能监控
 */
const cacheMetrics = {
  hits: 0,
  misses: 0,
  errors: 0,
  totalRequests: 0,
};

export const CacheMonitor = {
  recordHit(): void {
    cacheMetrics.hits++;
    cacheMetrics.totalRequests++;
  },

  recordMiss(): void {
    cacheMetrics.misses++;
    cacheMetrics.totalRequests++;
  },

  recordError(): void {
    cacheMetrics.errors++;
  },

  getMetrics() {
    const hitRate =
      cacheMetrics.totalRequests > 0 ? cacheMetrics.hits / cacheMetrics.totalRequests : 0;

    return {
      ...cacheMetrics,
      hitRate: Math.round(hitRate * 100) / 100,
    };
  },

  reset(): void {
    cacheMetrics.hits = 0;
    cacheMetrics.misses = 0;
    cacheMetrics.errors = 0;
    cacheMetrics.totalRequests = 0;
  },
};
