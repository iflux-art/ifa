import type { ApiConfig } from "@repo/types";
import { z } from "zod";
import { loadEnvConfig } from "./env";

/**
 * API配置模式
 */
const apiConfigSchema = z.object({
  baseUrl: z.string().url(),
  timeout: z.number().min(1000).default(30000),
  retries: z.number().min(0).max(5).default(3),
  rateLimit: z.object({
    requests: z.number().min(1).default(100),
    window: z.number().min(1).default(900), // 15分钟（秒）
  }),
  cors: z.object({
    origin: z.union([z.string(), z.array(z.string())]).default("*"),
    credentials: z.boolean().default(true),
  }),
});

/**
 * 从环境变量加载API配置
 */
export function loadApiConfig(): ApiConfig {
  const env = loadEnvConfig();

  const baseUrl = env.API_BASE_URL || `http://${env.HOST}:${env.PORT}`;

  return apiConfigSchema.parse({
    baseUrl,
    timeout: env.API_TIMEOUT || 30000,
    retries: env.API_RETRIES ? Number(env.API_RETRIES) : 3,
    rateLimit: {
      requests: env.RATE_LIMIT_REQUESTS ? Number(env.RATE_LIMIT_REQUESTS) : 100,
      window: env.RATE_LIMIT_WINDOW ? Number(env.RATE_LIMIT_WINDOW) : 900,
    },
    cors: {
      origin: getCorsOrigins(),
      credentials: env.CORS_CREDENTIALS !== "false",
    },
  });
}

/**
 * 获取CORS源配置
 */
function getCorsOrigins(): string | string[] {
  const env = loadEnvConfig();

  if (env.CORS_ORIGINS) {
    return env.CORS_ORIGINS.split(",").map((origin) => origin.trim());
  }

  // 基于环境的默认CORS配置
  switch (env.NODE_ENV) {
    case "development":
      return [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:3002",
        "http://localhost:3003",
      ];

    case "production":
      return env.PRODUCTION_DOMAINS ? env.PRODUCTION_DOMAINS.split(",") : [];

    case "test":
      return ["http://localhost:3000"];

    default:
      return "*";
  }
}

/**
 * API端点配置
 */
export function getApiEndpoints() {
  const config = loadApiConfig();

  return {
    auth: {
      login: `${config.baseUrl}/auth/login`,
      register: `${config.baseUrl}/auth/register`,
      logout: `${config.baseUrl}/auth/logout`,
      refresh: `${config.baseUrl}/auth/refresh`,
      profile: `${config.baseUrl}/auth/profile`,
      forgotPassword: `${config.baseUrl}/auth/forgot-password`,
      resetPassword: `${config.baseUrl}/auth/reset-password`,
      verifyEmail: `${config.baseUrl}/auth/verify-email`,
    },
    users: {
      list: `${config.baseUrl}/users`,
      create: `${config.baseUrl}/users`,
      get: (id: string) => `${config.baseUrl}/users/${id}`,
      update: (id: string) => `${config.baseUrl}/users/${id}`,
      delete: (id: string) => `${config.baseUrl}/users/${id}`,
    },
    health: `${config.baseUrl}/health`,
    metrics: `${config.baseUrl}/metrics`,
  };
}

/**
 * 不同操作的请求超时配置
 */
export function getTimeoutConfig() {
  const config = loadApiConfig();

  return {
    default: config.timeout,
    upload: config.timeout * 3, // 文件上传3倍时间
    download: config.timeout * 2, // 下载2倍时间
    auth: config.timeout / 2, // 认证操作更快
    health: 5000, // 快速健康检查
  };
}

/**
 * 不同操作的重试配置
 */
export function getRetryConfig() {
  const config = loadApiConfig();

  return {
    default: {
      retries: config.retries,
      retryDelay: 1000,
      // biome-ignore lint/suspicious/noExplicitAny: 外部库的错误类型
      retryCondition: (error: any) => {
        return error.response?.status >= 500 || error.code === "NETWORK_ERROR";
      },
    },
    auth: {
      retries: 1, // 认证操作有限重试
      retryDelay: 500,
      // biome-ignore lint/suspicious/noExplicitAny: 外部库的错误类型
      retryCondition: (error: any) => {
        return error.response?.status >= 500;
      },
    },
    upload: {
      retries: config.retries + 2, // 上传更多重试
      retryDelay: 2000,
      // biome-ignore lint/suspicious/noExplicitAny: 外部库的错误类型
      retryCondition: (error: any) => {
        return error.response?.status >= 500 || error.code === "NETWORK_ERROR";
      },
    },
  };
}

/**
 * 不同端点的速率限制配置
 */
export function getRateLimitConfig() {
  const config = loadApiConfig();

  return {
    global: config.rateLimit,
    auth: {
      requests: 10,
      window: 900, // 15分钟
    },
    upload: {
      requests: 20,
      window: 3600, // 1小时
    },
    search: {
      requests: 50,
      window: 300, // 5分钟
    },
  };
}

/**
 * API安全头配置
 */
export function getSecurityHeaders() {
  const env = loadEnvConfig();

  return {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "X-XSS-Protection": "1; mode=block",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
    ...(env.NODE_ENV === "production" && {
      "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
    }),
  };
}

/**
 * API响应头配置
 */
export function getResponseHeaders() {
  return {
    "Content-Type": "application/json",
    "Cache-Control": "no-cache, no-store, must-revalidate",
    Pragma: "no-cache",
    Expires: "0",
  };
}

/**
 * 验证API配置
 */
export function validateApiConfig(config: ApiConfig): void {
  try {
    apiConfigSchema.parse(config);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors
        .map((err) => `${err.path.join(".")}: ${err.message}`)
        .join("\n");

      throw new Error(`API配置验证失败:\n${errorMessages}`);
    }
    throw error;
  }
}
