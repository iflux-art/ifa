/**
 * Hub 应用缓存配置和策略
 * 针对用户数据和管理功能优化的缓存机制
 */

// 缓存键前缀
export const CACHE_PREFIXES = {
  USER: "user",
  ADMIN: "admin",
  API: "api",
  STATIC: "static",
  SESSION: "session",
  LINKS: "links",
} as const;

// 缓存过期时间（秒）
export const CACHE_TTL = {
  VERY_SHORT: 1 * 60, // 1分钟
  SHORT: 5 * 60, // 5分钟
  MEDIUM: 30 * 60, // 30分钟
  LONG: 2 * 60 * 60, // 2小时
  VERY_LONG: 24 * 60 * 60, // 24小时
  PERMANENT: 7 * 24 * 60 * 60, // 7天
} as const;

// Hub 特定缓存策略
export const CACHE_STRATEGIES = {
  // 用户数据缓存策略（敏感数据，短期缓存）
  USER_DATA: {
    ttl: CACHE_TTL.SHORT,
    staleWhileRevalidate: false,
    maxAge: 0,
    sMaxAge: CACHE_TTL.VERY_SHORT,
  },

  // 管理员数据缓存策略
  ADMIN_DATA: {
    ttl: CACHE_TTL.VERY_SHORT,
    staleWhileRevalidate: false,
    maxAge: 0,
    sMaxAge: 0,
  },

  // 链接数据缓存策略
  LINKS_DATA: {
    ttl: CACHE_TTL.MEDIUM,
    staleWhileRevalidate: true,
    maxAge: CACHE_TTL.SHORT,
    sMaxAge: CACHE_TTL.MEDIUM,
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
    ttl: CACHE_TTL.SHORT,
    staleWhileRevalidate: true,
    maxAge: CACHE_TTL.VERY_SHORT,
    sMaxAge: CACHE_TTL.SHORT,
  },

  // 会话数据缓存策略
  SESSION_DATA: {
    ttl: CACHE_TTL.MEDIUM,
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
    headers["Cache-Control"] =
      `private, max-age=${config.maxAge}, s-maxage=${config.sMaxAge}, no-cache`;
  }

  // 添加 ETag 支持
  headers.ETag = `"${Date.now()}"`;

  return headers;
}

/**
 * 用户会话缓存管理器
 */
const sessionCache = new Map<string, { data: unknown; expires: number; userId: string }>();

export const SessionCache = {
  set(sessionId: string, data: unknown, userId: string, ttl: number = CACHE_TTL.MEDIUM): void {
    const expires = Date.now() + ttl * 1000;
    sessionCache.set(sessionId, { data, expires, userId });
  },

  get(sessionId: string): unknown | null {
    const session = sessionCache.get(sessionId);

    if (!session || Date.now() > session.expires) {
      if (session) {
        sessionCache.delete(sessionId);
      }
      return null;
    }

    return session.data;
  },

  invalidateUser(userId: string): void {
    for (const [sessionId, session] of sessionCache.entries()) {
      if (session.userId === userId) {
        sessionCache.delete(sessionId);
      }
    }
  },

  cleanup(): void {
    const now = Date.now();
    for (const [sessionId, session] of sessionCache.entries()) {
      if (now > session.expires) {
        sessionCache.delete(sessionId);
      }
    }
  },

  clear(): void {
    sessionCache.clear();
  },
};

/**
 * 链接数据缓存管理器
 */
const linksCache = new Map<string, { links: unknown[]; timestamp: number; userId?: string }>();
const LINKS_TTL = CACHE_TTL.MEDIUM * 1000;

export const LinksCache = {
  set(key: string, links: unknown[], userId?: string): void {
    linksCache.set(key, {
      links,
      timestamp: Date.now(),
      userId,
    });
  },

  get(key: string): unknown[] | null {
    const cached = linksCache.get(key);

    if (!cached || Date.now() - cached.timestamp > LINKS_TTL) {
      if (cached) {
        linksCache.delete(key);
      }
      return null;
    }

    return cached.links;
  },

  invalidateUser(userId: string): void {
    for (const [key, cached] of linksCache.entries()) {
      if (cached.userId === userId) {
        linksCache.delete(key);
      }
    }
  },

  clear(): void {
    linksCache.clear();
  },
};

/**
 * 安全缓存装饰器 - 用于敏感数据
 */
export function secureCache(_ttl: number = CACHE_TTL.VERY_SHORT, userSpecific: boolean = true) {
  return (_target: unknown, propertyName: string, descriptor: PropertyDescriptor) => {
    const method = descriptor.value;

    descriptor.value = async function (...args: unknown[]) {
      // 对于用户特定的数据，包含用户ID在缓存键中
      const userId = userSpecific
        ? (args[0] as { userId?: string })?.userId || "anonymous"
        : "global";
      const _cacheKey = generateCacheKey("USER", propertyName, userId, JSON.stringify(args));

      // 敏感数据使用更短的缓存时间
      const result = await method.apply(this, args);

      // 不缓存敏感数据到内存，直接返回
      return result;
    };

    return descriptor;
  };
}

// 定期清理缓存
if (typeof window === "undefined") {
  setInterval(
    () => {
      SessionCache.cleanup();
    },
    5 * 60 * 1000
  ); // 每5分钟清理一次
}
