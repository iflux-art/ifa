import { z } from "zod";

/**
 * 博客应用特定的环境变量模式
 */
export const blogEnvSchema = z.object({
  // Base environment variables
  NODE_ENV: z.enum(["development", "production", "test", "staging"]).default("development"),
  PORT: z.string().transform(Number).pipe(z.number().min(1).max(65535)).default("3001"),

  // 博客应用特定变量
  NEXT_PUBLIC_APP_NAME: z.string().default("Blog App"),
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3001"),

  // 数据库配置（可选）
  DATABASE_URL: z.string().url().optional(),
  DB_HOST: z.string().optional(),
  DB_PORT: z.string().transform(Number).pipe(z.number().min(1).max(65535)).optional(),
  DB_NAME: z.string().optional(),
  DB_USER: z.string().optional(),
  DB_PASSWORD: z.string().optional(),

  // API 配置（可选）
  API_BASE_URL: z.string().url().optional(),
  API_TIMEOUT: z.string().transform(Number).pipe(z.number().min(1000)).optional(),
  API_RETRIES: z.string().transform(Number).pipe(z.number().min(0).max(10)).optional(),

  // 速率限制（可选）
  RATE_LIMIT_REQUESTS: z.string().transform(Number).pipe(z.number().min(1)).optional(),
  RATE_LIMIT_WINDOW: z.string().transform(Number).pipe(z.number().min(1)).optional(),

  // CORS 配置（可选）
  CORS_ORIGINS: z.string().optional(),
  CORS_CREDENTIALS: z.string().optional(),

  // 博客特定配置
  NEXT_PUBLIC_ENABLE_COMMENTS: z
    .string()
    .transform((val) => val === "true")
    .default("true"),
  NEXT_PUBLIC_ENABLE_SEARCH: z
    .string()
    .transform((val) => val === "true")
    .default("true"),
  NEXT_PUBLIC_ENABLE_TAGS: z
    .string()
    .transform((val) => val === "true")
    .default("true"),
  NEXT_PUBLIC_ENABLE_CATEGORIES: z
    .string()
    .transform((val) => val === "true")
    .default("true"),
  NEXT_PUBLIC_POSTS_PER_PAGE: z
    .string()
    .transform(Number)
    .pipe(z.number().min(1).max(50))
    .default("10"),

  // 内容管理系统
  CMS_API_URL: z.string().url().optional(),
  CMS_API_KEY: z.string().optional(),
  CONTENT_CACHE_TTL: z.string().transform(Number).pipe(z.number().min(0)).default("3600"),

  // SEO 配置
  NEXT_PUBLIC_SITE_NAME: z.string().default("Blog App"),
  NEXT_PUBLIC_SITE_DESCRIPTION: z.string().default("A modern blog application"),
  NEXT_PUBLIC_SITE_URL: z.string().url().default("http://localhost:3001"),
  NEXT_PUBLIC_DEFAULT_OG_IMAGE: z.string().default("/og-image.jpg"),

  // 社交媒体
  NEXT_PUBLIC_TWITTER_HANDLE: z.string().optional(),
  NEXT_PUBLIC_FACEBOOK_PAGE: z.string().optional(),

  // 分析统计
  NEXT_PUBLIC_GA_ID: z.string().optional(),
  NEXT_PUBLIC_GTM_ID: z.string().optional(),

  // ISR 配置
  ENABLE_ISR: z
    .string()
    .transform((val) => val === "true")
    .default("true"),

  // 功能标志
  NEXT_PUBLIC_ENABLE_REACT_COMPILER: z
    .string()
    .transform((val) => val === "true")
    .default("true"),
  NEXT_PUBLIC_ENABLE_PPR: z
    .string()
    .transform((val) => val === "true")
    .default("true"),
  NEXT_PUBLIC_ENABLE_TURBOPACK: z
    .string()
    .transform((val) => val === "true")
    .default("true"),
  NEXT_PUBLIC_ENABLE_DARK_MODE: z
    .string()
    .transform((val) => val === "true")
    .default("true"),
  NEXT_PUBLIC_ENABLE_ANIMATIONS: z
    .string()
    .transform((val) => val === "true")
    .default("true"),
  NEXT_PUBLIC_ENABLE_ACCESSIBILITY: z
    .string()
    .transform((val) => val === "true")
    .default("true"),
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
 * 获取博客应用特定的环境变量
 */
export function getBlogEnv<K extends keyof BlogEnvConfig>(
  key: K,
  fallback?: BlogEnvConfig[K]
): BlogEnvConfig[K] | undefined {
  const env = loadBlogEnvConfig();
  return env[key] ?? fallback;
}

/**
 * 验证必需的博客应用环境变量
 */
export function validateBlogRequiredEnv(keys: (keyof BlogEnvConfig)[]): void {
  const env = loadBlogEnvConfig();
  const missing = keys.filter((key) => !env[key]);

  if (missing.length > 0) {
    throw new Error(`缺少必需的博客应用环境变量: ${missing.join(", ")}`);
  }
}

/**
 * 获取博客应用的客户端安全环境变量
 */
export function getBlogClientEnv() {
  const env = loadBlogEnvConfig();

  return {
    NEXT_PUBLIC_APP_NAME: env.NEXT_PUBLIC_APP_NAME,
    NEXT_PUBLIC_APP_URL: env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_ENABLE_COMMENTS: env.NEXT_PUBLIC_ENABLE_COMMENTS,
    NEXT_PUBLIC_ENABLE_SEARCH: env.NEXT_PUBLIC_ENABLE_SEARCH,
    NEXT_PUBLIC_ENABLE_TAGS: env.NEXT_PUBLIC_ENABLE_TAGS,
    NEXT_PUBLIC_ENABLE_CATEGORIES: env.NEXT_PUBLIC_ENABLE_CATEGORIES,
    NEXT_PUBLIC_POSTS_PER_PAGE: env.NEXT_PUBLIC_POSTS_PER_PAGE,
    NEXT_PUBLIC_SITE_NAME: env.NEXT_PUBLIC_SITE_NAME,
    NEXT_PUBLIC_SITE_DESCRIPTION: env.NEXT_PUBLIC_SITE_DESCRIPTION,
    NEXT_PUBLIC_SITE_URL: env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_DEFAULT_OG_IMAGE: env.NEXT_PUBLIC_DEFAULT_OG_IMAGE,
    NEXT_PUBLIC_TWITTER_HANDLE: env.NEXT_PUBLIC_TWITTER_HANDLE,
    NEXT_PUBLIC_FACEBOOK_PAGE: env.NEXT_PUBLIC_FACEBOOK_PAGE,
    NEXT_PUBLIC_GA_ID: env.NEXT_PUBLIC_GA_ID,
    NEXT_PUBLIC_GTM_ID: env.NEXT_PUBLIC_GTM_ID,
    NEXT_PUBLIC_ENABLE_REACT_COMPILER: env.NEXT_PUBLIC_ENABLE_REACT_COMPILER,
    NEXT_PUBLIC_ENABLE_PPR: env.NEXT_PUBLIC_ENABLE_PPR,
    NEXT_PUBLIC_ENABLE_TURBOPACK: env.NEXT_PUBLIC_ENABLE_TURBOPACK,
    NEXT_PUBLIC_ENABLE_DARK_MODE: env.NEXT_PUBLIC_ENABLE_DARK_MODE,
    NEXT_PUBLIC_ENABLE_ANIMATIONS: env.NEXT_PUBLIC_ENABLE_ANIMATIONS,
    NEXT_PUBLIC_ENABLE_ACCESSIBILITY: env.NEXT_PUBLIC_ENABLE_ACCESSIBILITY,
  };
}
