import type { Environment, LogLevel } from "@repo/types";
import { z } from "zod";

/**
 * 带验证的环境变量模式
 */
export const envSchema = z.object({
  // 基本应用配置
  NODE_ENV: z.enum(["development", "production", "test", "staging"]).default("development"),
  PORT: z.string().transform(Number).pipe(z.number().min(1).max(65535)).default("3000"),
  HOST: z.string().default("localhost"),
  LOG_LEVEL: z.enum(["error", "warn", "info", "debug", "trace"]).default("info"),

  // 数据库配置
  DATABASE_URL: z.string().url().optional(),
  DB_HOST: z.string().optional(),
  DB_PORT: z.string().transform(Number).pipe(z.number().min(1).max(65535)).optional(),
  DB_NAME: z.string().optional(),
  DB_USER: z.string().optional(),
  DB_PASSWORD: z.string().optional(),

  // 数据库连接池配置
  DB_POOL_SIZE: z.string().transform(Number).pipe(z.number().min(1).max(100)).optional(),
  DB_TIMEOUT: z.string().transform(Number).pipe(z.number().min(1000)).optional(),
  DB_POOL_MIN: z.string().transform(Number).pipe(z.number().min(0)).optional(),
  DB_POOL_MAX: z.string().transform(Number).pipe(z.number().min(1)).optional(),
  DB_ACQUIRE_TIMEOUT: z.string().transform(Number).pipe(z.number().min(1000)).optional(),
  DB_CREATE_TIMEOUT: z.string().transform(Number).pipe(z.number().min(1000)).optional(),
  DB_DESTROY_TIMEOUT: z.string().transform(Number).pipe(z.number().min(1000)).optional(),
  DB_IDLE_TIMEOUT: z.string().transform(Number).pipe(z.number().min(1000)).optional(),
  DB_REAP_INTERVAL: z.string().transform(Number).pipe(z.number().min(1000)).optional(),
  DB_RETRY_INTERVAL: z.string().transform(Number).pipe(z.number().min(100)).optional(),

  // Redis配置
  REDIS_URL: z.string().url().optional(),
  REDIS_HOST: z.string().optional(),
  REDIS_PORT: z.string().transform(Number).pipe(z.number().min(1).max(65535)).optional(),
  REDIS_PASSWORD: z.string().optional(),

  // 认证
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRATION: z.string().default("1h"),
  REFRESH_TOKEN_EXPIRATION: z.string().default("7d"),
  BCRYPT_ROUNDS: z.string().transform(Number).pipe(z.number().min(10).max(15)).optional(),
  SESSION_TIMEOUT: z.string().transform(Number).pipe(z.number().min(300)).optional(),
  MAX_LOGIN_ATTEMPTS: z.string().transform(Number).pipe(z.number().min(3).max(10)).optional(),
  LOCKOUT_DURATION: z.string().transform(Number).pipe(z.number().min(300)).optional(),

  // OAuth提供商
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GOOGLE_REDIRECT_URI: z.string().optional(),
  ENABLE_GOOGLE_AUTH: z.string().optional(),

  GITHUB_CLIENT_ID: z.string().optional(),
  GITHUB_CLIENT_SECRET: z.string().optional(),
  GITHUB_REDIRECT_URI: z.string().optional(),
  ENABLE_GITHUB_AUTH: z.string().optional(),

  MICROSOFT_CLIENT_ID: z.string().optional(),
  MICROSOFT_CLIENT_SECRET: z.string().optional(),
  MICROSOFT_REDIRECT_URI: z.string().optional(),
  ENABLE_MICROSOFT_AUTH: z.string().optional(),

  // 外部API
  API_BASE_URL: z.string().url().optional(),
  API_TIMEOUT: z.string().transform(Number).pipe(z.number().min(1000)).optional(),
  API_RETRIES: z.string().transform(Number).pipe(z.number().min(0).max(10)).optional(),

  // 速率限制
  RATE_LIMIT_REQUESTS: z.string().transform(Number).pipe(z.number().min(1)).optional(),
  RATE_LIMIT_WINDOW: z.string().transform(Number).pipe(z.number().min(1)).optional(),

  // CORS
  CORS_ORIGINS: z.string().optional(),
  CORS_CREDENTIALS: z.string().optional(),
  PRODUCTION_DOMAINS: z.string().optional(),

  // 存储配置
  STORAGE_PROVIDER: z.enum(["local", "s3", "gcs", "azure"]).optional(),
  S3_BUCKET: z.string().optional(),
  S3_REGION: z.string().optional(),
  S3_ACCESS_KEY: z.string().optional(),
  S3_SECRET_KEY: z.string().optional(),

  // 监控
  SENTRY_DSN: z.string().url().optional(),
  DATADOG_API_KEY: z.string().optional(),

  // 功能标志
  ENABLE_REACT_COMPILER: z
    .string()
    .transform((val) => val === "true")
    .default("true"),
  ENABLE_PPR: z
    .string()
    .transform((val) => val === "true")
    .default("true"),
  ENABLE_TURBOPACK: z
    .string()
    .transform((val) => val === "true")
    .default("true"),
  ENABLE_CACHING: z
    .string()
    .transform((val) => val === "true")
    .default("true"),
  ENABLE_COMPRESSION: z
    .string()
    .transform((val) => val === "true")
    .default("true"),
  ENABLE_HOT_RELOAD: z
    .string()
    .transform((val) => val === "true")
    .default("true"),
  ENABLE_SOURCE_MAP: z
    .string()
    .transform((val) => val === "true")
    .default("true"),
  ENABLE_TYPE_CHECKING: z
    .string()
    .transform((val) => val === "true")
    .default("true"),

  // UI功能
  ENABLE_DARK_MODE: z
    .string()
    .transform((val) => val === "true")
    .default("true"),
  ENABLE_ANIMATIONS: z
    .string()
    .transform((val) => val === "true")
    .default("true"),
  ENABLE_ACCESSIBILITY: z
    .string()
    .transform((val) => val === "true")
    .default("true"),
});

/**
 * 验证后的环境变量
 */
export type EnvConfig = z.infer<typeof envSchema>;

/**
 * 加载并验证环境变量
 */
export function loadEnvConfig(): EnvConfig {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors
        .map((err) => `${err.path.join(".")}: ${err.message}`)
        .join("\n");

      throw new Error(`环境变量验证失败:\n${errorMessages}`);
    }
    throw error;
  }
}

/**
 * 获取环境变量，带默认值
 */
// biome-ignore lint/suspicious/noExplicitAny: 通用工具函数需要any以获得灵活性
export function getEnv(key: keyof EnvConfig, fallback?: any): any {
  const env = loadEnvConfig();
  return env[key] ?? fallback;
}

/**
 * 检查是否在开发环境中运行
 */
export function isDevelopment(): boolean {
  return getEnv("NODE_ENV") === "development";
}

/**
 * 检查是否在生产环境中运行
 */
export function isProduction(): boolean {
  return getEnv("NODE_ENV") === "production";
}

/**
 * 检查是否在测试环境中运行
 */
export function isTest(): boolean {
  return getEnv("NODE_ENV") === "test";
}

/**
 * 获取当前环境
 */
export function getEnvironment(): Environment {
  return getEnv("NODE_ENV") as Environment;
}

/**
 * 获取日志级别
 */
export function getLogLevel(): LogLevel {
  return getEnv("LOG_LEVEL") as LogLevel;
}

/**
 * 验证必需的环境变量
 */
export function validateRequiredEnv(keys: (keyof EnvConfig)[]): void {
  const env = loadEnvConfig();
  const missing = keys.filter((key) => !env[key]);

  if (missing.length > 0) {
    throw new Error(`缺少必需的环境变量: ${missing.join(", ")}`);
  }
}
