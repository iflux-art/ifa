import { z } from "zod";

/**
 * 博客应用环境变量模式 - 只保留必需配置
 */
export const blogEnvSchema = z.object({
	// 应用基本信息
	NEXT_PUBLIC_APP_NAME: z.string().default("Blog App"),
	NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
	PORT: z
		.string()
		.transform(Number)
		.pipe(z.number().min(1).max(65535))
		.default("3000"),

	// 博客核心功能
	NEXT_PUBLIC_ENABLE_COMMENTS: z
		.string()
		.transform((val) => val === "true")
		.default("true"),
	NEXT_PUBLIC_POSTS_PER_PAGE: z
		.string()
		.transform(Number)
		.pipe(z.number().min(1).max(50))
		.default("10"),

	// CMS 集成（可选）
	CMS_API_URL: z.string().url().optional(),
	CMS_API_KEY: z.string().optional(),
});

/**
 * 博客应用环境配置类型
 */
export type BlogEnvConfig = z.infer<typeof blogEnvSchema>;

/**
 * 加载并验证博客应用环境变量
 */
export function loadBlogEnvConfig(): BlogEnvConfig {
	try {
		const blogConfig = blogEnvSchema.parse(process.env);
		return blogConfig;
	} catch (error) {
		if (error instanceof z.ZodError) {
			const errorMessages = error.errors
				.map((err) => `${err.path.join(".")}: ${err.message}`)
				.join("\n");

			throw new Error(`博客应用环境变量验证失败:\n${errorMessages}`);
		}
		throw error;
	}
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
