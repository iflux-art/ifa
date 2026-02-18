/**
 * API缓存工具函数
 * 使用 Next.js 最佳实践
 */

/**
 * 缓存策略配置
 * Next.js 15 推荐使用路由段配置，这里仅用于动态设置响应头
 */
export const CACHE_CONFIG = {
	// 静态内容缓存时间（秒）
	static: 24 * 60 * 60, // 24小时

	// 半静态内容缓存时间（秒）
	semiStatic: 5 * 60, // 5分钟

	// 动态内容缓存时间（秒）
	dynamic: 30, // 30秒

	// 不缓存
	noCache: 0,
} as const;

export type CacheStrategy = keyof typeof CACHE_CONFIG;

/**
 * 生成Cache-Control头值
 */
export function generateCacheControl(
	strategy: CacheStrategy,
	isPublic = true,
): string {
	const maxAge = CACHE_CONFIG[strategy];

	if (maxAge === 0) {
		return "no-store, max-age=0";
	}

	const directives = [
		isPublic ? "public" : "private",
		`max-age=${maxAge}`,
		`s-maxage=${maxAge * 2}`,
		`stale-while-revalidate=${maxAge * 10}`,
	];

	return directives.join(", ");
}

/**
 * 为API响应设置缓存头
 */
export function setCacheHeaders(
	strategy: CacheStrategy,
	isPublic = true,
): Headers {
	const headers = new Headers();
	headers.set("Cache-Control", generateCacheControl(strategy, isPublic));
	return headers;
}
