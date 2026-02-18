/**
 * 博客应用环境配置类型
 */
export interface BlogEnvConfig {
	// 应用基本信息
	NEXT_PUBLIC_APP_NAME: string;
	NEXT_PUBLIC_APP_URL: string;
	PORT: number;

	// 博客核心功能
	NEXT_PUBLIC_ENABLE_COMMENTS: boolean;
	NEXT_PUBLIC_POSTS_PER_PAGE: number;

	// CMS 集成（可选）
	CMS_API_URL?: string;
	CMS_API_KEY?: string;
}

/**
 * 解析布尔值环境变量
 */
function parseBoolean(
	value: string | undefined,
	defaultValue: boolean,
): boolean {
	if (value === undefined) return defaultValue;
	return value === "true";
}

/**
 * 解析数字环境变量
 */
function parseNumber(
	value: string | undefined,
	defaultValue: number,
	min?: number,
	max?: number,
): number {
	if (value === undefined) return defaultValue;
	const parsed = Number.parseInt(value, 10);
	if (Number.isNaN(parsed)) return defaultValue;
	if (min !== undefined && parsed < min) return min;
	if (max !== undefined && parsed > max) return max;
	return parsed;
}

/**
 * 解析 URL 环境变量
 */
function parseUrl(value: string | undefined, defaultValue: string): string {
	if (value === undefined) return defaultValue;
	try {
		new URL(value);
		return value;
	} catch {
		return defaultValue;
	}
}

/**
 * 加载并验证博客应用环境变量
 */
export function loadBlogEnvConfig(): BlogEnvConfig {
	return {
		// 应用基本信息
		NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || "Blog App",
		NEXT_PUBLIC_APP_URL: parseUrl(
			process.env.NEXT_PUBLIC_APP_URL,
			"http://localhost:3000",
		),
		PORT: parseNumber(process.env.PORT, 3000, 1, 65535),

		// 博客核心功能
		NEXT_PUBLIC_ENABLE_COMMENTS: parseBoolean(
			process.env.NEXT_PUBLIC_ENABLE_COMMENTS,
			true,
		),
		NEXT_PUBLIC_POSTS_PER_PAGE: parseNumber(
			process.env.NEXT_PUBLIC_POSTS_PER_PAGE,
			10,
			1,
			50,
		),

		// CMS 集成（可选）
		CMS_API_URL: process.env.CMS_API_URL,
		CMS_API_KEY: process.env.CMS_API_KEY,
	};
}

/**
 * 获取博客应用的客户端配置
 */
export function getBlogClientEnv() {
	const env = loadBlogEnvConfig();

	return {
		appName: env.NEXT_PUBLIC_APP_NAME,
		appUrl: env.NEXT_PUBLIC_APP_URL,
		enableComments: env.NEXT_PUBLIC_ENABLE_COMMENTS,
		postsPerPage: env.NEXT_PUBLIC_POSTS_PER_PAGE,
	};
}
