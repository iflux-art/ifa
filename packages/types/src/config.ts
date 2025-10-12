/**
 * 应用环境类型
 */
export type Environment = "development" | "production" | "test" | "staging";

/**
 * 日志级别
 */
export type LogLevel = "error" | "warn" | "info" | "debug" | "trace";

/**
 * 功能标志配置
 */
export interface FeatureFlags {
  // React 19 特性
  reactCompiler: boolean;
  reactActions: boolean;
  useHook: boolean;

  // Next.js 15 特性
  ppr: boolean; // 部分预渲染
  turbopack: boolean;
  dynamicIO: boolean;

  // 性能特性
  caching: boolean;
  compression: boolean;
  bundleAnalysis: boolean;

  // 开发特性
  hotReload: boolean;
  sourceMap: boolean;
  typeChecking: boolean;

  // UI 特性
  darkMode: boolean;
  animations: boolean;
  accessibility: boolean;
}

/**
 * 数据库配置
 */
export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  ssl?: boolean;
  poolSize?: number;
  timeout?: number;
}

/**
 * Redis 配置
 */
export interface RedisConfig {
  host: string;
  port: number;
  password?: string;
  database?: number;
  keyPrefix?: string;
  ttl?: number;
}

/**
 * API 配置
 */
export interface ApiConfig {
  baseUrl: string;
  timeout: number;
  retries: number;
  rateLimit: {
    requests: number;
    window: number;
  };
  cors: {
    origin: string | string[];
    credentials: boolean;
  };
}

/**
 * 认证配置
 */
export interface AuthConfig {
  jwtSecret: string;
  jwtExpiration: string;
  refreshTokenExpiration: string;
  bcryptRounds: number;
  sessionTimeout: number;
  maxLoginAttempts: number;
  lockoutDuration: number;
}

/**
 * 邮件配置
 */
export interface EmailConfig {
  provider: "smtp" | "sendgrid" | "ses";
  host?: string;
  port?: number;
  username?: string;
  password?: string;
  apiKey?: string;
  from: string;
  replyTo?: string;
}

/**
 * 存储配置
 */
export interface StorageConfig {
  provider: "local" | "s3" | "gcs" | "azure";
  bucket?: string;
  region?: string;
  accessKey?: string;
  secretKey?: string;
  endpoint?: string;
  publicUrl?: string;
}

/**
 * 监控配置
 */
export interface MonitoringConfig {
  enabled: boolean;
  provider?: "sentry" | "datadog" | "newrelic";
  dsn?: string;
  apiKey?: string;
  environment: Environment;
  sampleRate: number;
}

/**
 * 应用配置
 */
export interface AppConfig {
  name: string;
  version: string;
  environment: Environment;
  port: number;
  host: string;
  logLevel: LogLevel;

  // Feature flags
  features: FeatureFlags;

  // 外部服务
  database?: DatabaseConfig;
  redis?: RedisConfig;
  api: ApiConfig;
  auth: AuthConfig;
  email?: EmailConfig;
  storage?: StorageConfig;
  monitoring?: MonitoringConfig;

  // 构建配置
  build: {
    sourceMaps: boolean;
    minify: boolean;
    analyze: boolean;
    target: string;
  };
}

/**
 * 环境变量模式
 */
export interface EnvVars {
  NODE_ENV: Environment;
  PORT: string;
  HOST: string;
  LOG_LEVEL: LogLevel;

  // Database
  DATABASE_URL?: string;
  DB_HOST?: string;
  DB_PORT?: string;
  DB_NAME?: string;
  DB_USER?: string;
  DB_PASSWORD?: string;

  // Redis
  REDIS_URL?: string;
  REDIS_HOST?: string;
  REDIS_PORT?: string;
  REDIS_PASSWORD?: string;

  // Authentication
  JWT_SECRET: string;
  JWT_EXPIRATION?: string;
  REFRESH_TOKEN_EXPIRATION?: string;

  // External APIs
  API_BASE_URL?: string;
  API_TIMEOUT?: string;

  // Storage
  STORAGE_PROVIDER?: string;
  S3_BUCKET?: string;
  S3_REGION?: string;
  S3_ACCESS_KEY?: string;
  S3_SECRET_KEY?: string;

  // Monitoring
  SENTRY_DSN?: string;
  DATADOG_API_KEY?: string;

  // Feature flags
  ENABLE_REACT_COMPILER?: string;
  ENABLE_PPR?: string;
  ENABLE_TURBOPACK?: string;
}
