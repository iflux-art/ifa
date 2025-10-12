import { z } from "zod";

/**
 * Web 应用特定的环境变量模式
 */
export const webEnvSchema = z.object({
  // Base environment variables
  NODE_ENV: z.enum(["development", "production", "test", "staging"]).default("development"),
  PORT: z.string().transform(Number).pipe(z.number().min(1).max(65535)).default("3000"),

  // Web 应用特定变量
  NEXT_PUBLIC_APP_NAME: z.string().default("Web App"),
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),

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

  // Web 应用特定的功能标志
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
 * Web 应用环境配置类型
 */
export type WebEnvConfig = z.infer<typeof webEnvSchema>;

/**
 * 加载并验证 Web 应用环境变量
 */
export function loadWebEnvConfig(): WebEnvConfig {
  try {
    const webConfig = webEnvSchema.parse(process.env);
    return webConfig;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors
        .map((err) => `${err.path.join(".")}: ${err.message}`)
        .join("\n");

      throw new Error(`Web 应用环境变量验证失败:\n${errorMessages}`);
    }
    throw error;
  }
}

/**
 * 获取 Web 应用特定的环境变量
 */
export function getWebEnv<K extends keyof WebEnvConfig>(
  key: K,
  fallback?: WebEnvConfig[K]
): WebEnvConfig[K] | undefined {
  const env = loadWebEnvConfig();
  return env[key] ?? fallback;
}

/**
 * 验证必需的 Web 应用环境变量
 */
export function validateWebRequiredEnv(keys: (keyof WebEnvConfig)[]): void {
  const env = loadWebEnvConfig();
  const missing = keys.filter((key) => !env[key]);

  if (missing.length > 0) {
    throw new Error(`缺少必需的 Web 应用环境变量: ${missing.join(", ")}`);
  }
}

/**
 * 获取 Web 应用的客户端安全环境变量
 */
export function getWebClientEnv() {
  const env = loadWebEnvConfig();

  return {
    NEXT_PUBLIC_APP_NAME: env.NEXT_PUBLIC_APP_NAME,
    NEXT_PUBLIC_APP_URL: env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_ENABLE_REACT_COMPILER: env.NEXT_PUBLIC_ENABLE_REACT_COMPILER,
    NEXT_PUBLIC_ENABLE_PPR: env.NEXT_PUBLIC_ENABLE_PPR,
    NEXT_PUBLIC_ENABLE_TURBOPACK: env.NEXT_PUBLIC_ENABLE_TURBOPACK,
    NEXT_PUBLIC_ENABLE_DARK_MODE: env.NEXT_PUBLIC_ENABLE_DARK_MODE,
    NEXT_PUBLIC_ENABLE_ANIMATIONS: env.NEXT_PUBLIC_ENABLE_ANIMATIONS,
    NEXT_PUBLIC_ENABLE_ACCESSIBILITY: env.NEXT_PUBLIC_ENABLE_ACCESSIBILITY,
  };
}
