import { z } from "zod";

/**
 * Hub 应用特定的环境变量模式
 */
export const hubEnvSchema = z.object({
  // Base environment variables
  NODE_ENV: z.enum(["development", "production", "test", "staging"]).default("development"),
  PORT: z.string().transform(Number).pipe(z.number().min(1).max(65535)).default("3002"),

  // Hub 应用特定变量
  NEXT_PUBLIC_APP_NAME: z.string().default("Hub App"),
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3002"),

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

  // Redis 配置（可选）
  REDIS_URL: z.string().url().optional(),
  REDIS_HOST: z.string().optional(),
  REDIS_PORT: z.string().transform(Number).pipe(z.number().min(1).max(65535)).optional(),
  REDIS_PASSWORD: z.string().optional(),

  // 监控（可选）
  SENTRY_DSN: z.string().url().optional(),
  DATADOG_API_KEY: z.string().optional(),

  // Clerk 认证
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string(),
  CLERK_SECRET_KEY: z.string(),
  NEXT_PUBLIC_CLERK_SIGN_IN_URL: z.string().default("/sign-in"),
  NEXT_PUBLIC_CLERK_SIGN_UP_URL: z.string().default("/sign-up"),
  NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL: z.string().default("/dashboard"),
  NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL: z.string().default("/dashboard"),

  // Hub 特定功能
  NEXT_PUBLIC_ENABLE_ADMIN_PANEL: z
    .string()
    .transform((val) => val === "true")
    .default("true"),
  NEXT_PUBLIC_ENABLE_USER_MANAGEMENT: z
    .string()
    .transform((val) => val === "true")
    .default("true"),
  NEXT_PUBLIC_ENABLE_ANALYTICS_DASHBOARD: z
    .string()
    .transform((val) => val === "true")
    .default("true"),
  NEXT_PUBLIC_ENABLE_NOTIFICATIONS: z
    .string()
    .transform((val) => val === "true")
    .default("true"),

  // 文件上传配置
  STORAGE_PROVIDER: z.enum(["local", "s3", "gcs", "azure"]).default("local"),
  MAX_FILE_SIZE: z.string().transform(Number).pipe(z.number().min(1024)).default("10485760"), // 10MB
  ALLOWED_FILE_TYPES: z.string().default("image/jpeg,image/png,image/gif,application/pdf"),

  // Webhook 配置
  WEBHOOK_SECRET: z.string().optional(),
  WEBHOOK_TIMEOUT: z.string().transform(Number).pipe(z.number().min(1000)).default("5000"),

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
 * Hub 应用环境配置类型
 */
export type HubEnvConfig = z.infer<typeof hubEnvSchema>;

/**
 * 加载并验证 Hub 应用环境变量
 */
export function loadHubEnvConfig(): HubEnvConfig {
  try {
    const hubConfig = hubEnvSchema.parse(process.env);
    return hubConfig;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors
        .map((err) => `${err.path.join(".")}: ${err.message}`)
        .join("\n");

      throw new Error(`Hub 应用环境变量验证失败:\n${errorMessages}`);
    }
    throw error;
  }
}

/**
 * 获取 Hub 应用特定的环境变量
 */
export function getHubEnv<K extends keyof HubEnvConfig>(
  key: K,
  fallback?: HubEnvConfig[K]
): HubEnvConfig[K] | undefined {
  const env = loadHubEnvConfig();
  return env[key] ?? fallback;
}

/**
 * 验证必需的 Hub 应用环境变量
 */
export function validateHubRequiredEnv(keys: (keyof HubEnvConfig)[]): void {
  const env = loadHubEnvConfig();
  const missing = keys.filter((key) => !env[key]);

  if (missing.length > 0) {
    throw new Error(`缺少必需的 Hub 应用环境变量: ${missing.join(", ")}`);
  }
}

/**
 * 获取 Hub 应用的客户端安全环境变量
 */
export function getHubClientEnv() {
  const env = loadHubEnvConfig();

  return {
    NEXT_PUBLIC_APP_NAME: env.NEXT_PUBLIC_APP_NAME,
    NEXT_PUBLIC_APP_URL: env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    NEXT_PUBLIC_CLERK_SIGN_IN_URL: env.NEXT_PUBLIC_CLERK_SIGN_IN_URL,
    NEXT_PUBLIC_CLERK_SIGN_UP_URL: env.NEXT_PUBLIC_CLERK_SIGN_UP_URL,
    NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL: env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL,
    NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL: env.NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL,
    NEXT_PUBLIC_ENABLE_ADMIN_PANEL: env.NEXT_PUBLIC_ENABLE_ADMIN_PANEL,
    NEXT_PUBLIC_ENABLE_USER_MANAGEMENT: env.NEXT_PUBLIC_ENABLE_USER_MANAGEMENT,
    NEXT_PUBLIC_ENABLE_ANALYTICS_DASHBOARD: env.NEXT_PUBLIC_ENABLE_ANALYTICS_DASHBOARD,
    NEXT_PUBLIC_ENABLE_NOTIFICATIONS: env.NEXT_PUBLIC_ENABLE_NOTIFICATIONS,
    NEXT_PUBLIC_ENABLE_REACT_COMPILER: env.NEXT_PUBLIC_ENABLE_REACT_COMPILER,
    NEXT_PUBLIC_ENABLE_PPR: env.NEXT_PUBLIC_ENABLE_PPR,
    NEXT_PUBLIC_ENABLE_TURBOPACK: env.NEXT_PUBLIC_ENABLE_TURBOPACK,
    NEXT_PUBLIC_ENABLE_DARK_MODE: env.NEXT_PUBLIC_ENABLE_DARK_MODE,
    NEXT_PUBLIC_ENABLE_ANIMATIONS: env.NEXT_PUBLIC_ENABLE_ANIMATIONS,
    NEXT_PUBLIC_ENABLE_ACCESSIBILITY: env.NEXT_PUBLIC_ENABLE_ACCESSIBILITY,
  };
}
