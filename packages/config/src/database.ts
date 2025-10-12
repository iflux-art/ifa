import type { DatabaseConfig, PoolConfig } from "@repo/types";
import { z } from "zod";
import { loadEnvConfig } from "./env";

/**
 * 数据库配置模式
 */
const databaseConfigSchema = z.object({
  host: z.string(),
  port: z.number().min(1).max(65535),
  database: z.string(),
  username: z.string(),
  password: z.string(),
  ssl: z.boolean().optional(),
  poolSize: z.number().min(1).max(100).optional(),
  timeout: z.number().min(1000).optional(),
});

/**
 * 连接池配置模式
 */
const poolConfigSchema = z.object({
  min: z.number().min(0).default(2),
  max: z.number().min(1).default(10),
  acquireTimeoutMillis: z.number().min(1000).default(60000),
  createTimeoutMillis: z.number().min(1000).default(30000),
  destroyTimeoutMillis: z.number().min(1000).default(5000),
  idleTimeoutMillis: z.number().min(1000).default(30000),
  reapIntervalMillis: z.number().min(1000).default(1000),
  createRetryIntervalMillis: z.number().min(100).default(200),
});

/**
 * 从环境变量加载数据库配置
 */
export function loadDatabaseConfig(): DatabaseConfig {
  const env = loadEnvConfig();

  // 如果提供了DATABASE_URL，则解析它
  if (env.DATABASE_URL) {
    const url = new URL(env.DATABASE_URL);

    return databaseConfigSchema.parse({
      host: url.hostname,
      port: Number(url.port) || 5432,
      database: url.pathname.slice(1), // 移除前导斜杠
      username: url.username,
      password: url.password,
      ssl: url.searchParams.get("ssl") === "true" || url.protocol === "postgres:",
      poolSize: env.DB_POOL_SIZE ? Number(env.DB_POOL_SIZE) : undefined,
      timeout: env.DB_TIMEOUT ? Number(env.DB_TIMEOUT) : undefined,
    });
  }

  // 否则，使用单独的环境变量
  if (!(env.DB_HOST && env.DB_NAME && env.DB_USER && env.DB_PASSWORD)) {
    throw new Error("数据库配置不完整。请提供DATABASE_URL或DB_HOST、DB_NAME、DB_USER和DB_PASSWORD");
  }

  return databaseConfigSchema.parse({
    host: env.DB_HOST,
    port: env.DB_PORT || 5432,
    database: env.DB_NAME,
    username: env.DB_USER,
    password: env.DB_PASSWORD,
    ssl: env.NODE_ENV === "production",
    poolSize: 10,
    timeout: 30000,
  });
}

/**
 * 加载数据库连接池配置
 */
export function loadPoolConfig(): PoolConfig {
  const env = loadEnvConfig();

  return poolConfigSchema.parse({
    min: env.DB_POOL_MIN ? Number(env.DB_POOL_MIN) : 2,
    max: env.DB_POOL_MAX ? Number(env.DB_POOL_MAX) : 10,
    acquireTimeoutMillis: env.DB_ACQUIRE_TIMEOUT ? Number(env.DB_ACQUIRE_TIMEOUT) : 60000,
    createTimeoutMillis: env.DB_CREATE_TIMEOUT ? Number(env.DB_CREATE_TIMEOUT) : 30000,
    destroyTimeoutMillis: env.DB_DESTROY_TIMEOUT ? Number(env.DB_DESTROY_TIMEOUT) : 5000,
    idleTimeoutMillis: env.DB_IDLE_TIMEOUT ? Number(env.DB_IDLE_TIMEOUT) : 30000,
    reapIntervalMillis: env.DB_REAP_INTERVAL ? Number(env.DB_REAP_INTERVAL) : 1000,
    createRetryIntervalMillis: env.DB_RETRY_INTERVAL ? Number(env.DB_RETRY_INTERVAL) : 200,
  });
}

/**
 * 获取数据库连接字符串
 */
export function getDatabaseUrl(): string {
  const env = loadEnvConfig();

  if (env.DATABASE_URL) {
    return env.DATABASE_URL;
  }

  const config = loadDatabaseConfig();
  const sslParam = config.ssl ? "?ssl=true" : "";

  return `postgresql://${config.username}:${config.password}@${config.host}:${config.port}/${config.database}${sslParam}`;
}

/**
 * 获取测试数据库配置
 */
export function getTestDatabaseConfig(): DatabaseConfig {
  const config = loadDatabaseConfig();

  return {
    ...config,
    database: `${config.database}_test`,
    poolSize: 1, // 测试使用更小的连接池
    timeout: 5000, // 测试使用更短的超时时间
  };
}

/**
 * 不同环境的数据库配置
 */
export function getDatabaseConfigForEnvironment(environment: string): DatabaseConfig {
  const baseConfig = loadDatabaseConfig();

  switch (environment) {
    case "test":
      return getTestDatabaseConfig();

    case "development":
      return {
        ...baseConfig,
        ssl: false,
        poolSize: 5,
      };

    case "production":
      return {
        ...baseConfig,
        ssl: true,
        poolSize: 20,
        timeout: 60000,
      };

    default:
      return baseConfig;
  }
}

/**
 * 验证数据库配置
 */
export function validateDatabaseConfig(config: DatabaseConfig): void {
  try {
    databaseConfigSchema.parse(config);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors
        .map((err) => `${err.path.join(".")}: ${err.message}`)
        .join("\n");

      throw new Error(`数据库配置验证失败:\n${errorMessages}`);
    }
    throw error;
  }
}
