import { getHubClientEnv, loadHubEnvConfig } from "./env";
import { loadFeatureFlags } from "./features";

/**
 * Hub 应用配置
 */
export class HubAppConfig {
  private static instance: HubAppConfig;
  private env: ReturnType<typeof loadHubEnvConfig>;
  private features: ReturnType<typeof loadFeatureFlags>;

  private constructor() {
    this.env = loadHubEnvConfig();
    this.features = loadFeatureFlags();
  }

  public static getInstance(): HubAppConfig {
    if (!HubAppConfig.instance) {
      HubAppConfig.instance = new HubAppConfig();
    }
    return HubAppConfig.instance;
  }

  /**
   * 获取环境配置
   */
  public getEnv() {
    return this.env;
  }

  /**
   * 获取功能标志
   */
  public getFeatures() {
    return this.features;
  }

  /**
   * 获取客户端安全配置
   */
  public getClientConfig() {
    return {
      env: getHubClientEnv(),
      features: {
        darkMode: this.features.darkMode,
        animations: this.features.animations,
        accessibility: this.features.accessibility,
        reactCompiler: this.features.reactCompiler,
        ppr: this.features.ppr,
      },
    };
  }

  /**
   * 检查功能是否启用
   */
  public isFeatureEnabled(feature: keyof typeof this.features): boolean {
    return this.features[feature];
  }

  /**
   * 获取应用元数据
   */
  public getAppMetadata() {
    return {
      name: this.env.NEXT_PUBLIC_APP_NAME,
      url: this.env.NEXT_PUBLIC_APP_URL,
      environment: this.env.NODE_ENV,
      version: process.env.npm_package_version || "1.0.0",
    };
  }

  /**
   * 获取 Clerk 认证配置
   */
  public getClerkConfig() {
    return {
      publishableKey: this.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
      secretKey: this.env.CLERK_SECRET_KEY,
      signInUrl: this.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL,
      signUpUrl: this.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL,
      afterSignInUrl: this.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL,
      afterSignUpUrl: this.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL,
    };
  }

  /**
   * 获取 Hub 特定配置
   */
  public getHubConfig() {
    return {
      enableAdminPanel: this.env.NEXT_PUBLIC_ENABLE_ADMIN_PANEL,
      enableUserManagement: this.env.NEXT_PUBLIC_ENABLE_USER_MANAGEMENT,
      enableAnalyticsDashboard: this.env.NEXT_PUBLIC_ENABLE_ANALYTICS_DASHBOARD,
      enableNotifications: this.env.NEXT_PUBLIC_ENABLE_NOTIFICATIONS,
    };
  }

  /**
   * 获取文件上传配置
   */
  public getFileUploadConfig() {
    const allowedTypes = this.env.ALLOWED_FILE_TYPES.split(",").map((type) => type.trim());

    return {
      storageProvider: this.env.STORAGE_PROVIDER,
      maxFileSize: this.env.MAX_FILE_SIZE,
      allowedFileTypes: allowedTypes,
    };
  }

  /**
   * 获取 Webhook 配置
   */
  public getWebhookConfig() {
    return {
      secret: this.env.WEBHOOK_SECRET,
      timeout: this.env.WEBHOOK_TIMEOUT,
    };
  }

  /**
   * 获取 Redis 配置
   */
  public getRedisConfig() {
    return {
      url: this.env.REDIS_URL,
      host: this.env.REDIS_HOST,
      port: this.env.REDIS_PORT,
      password: this.env.REDIS_PASSWORD,
    };
  }

  /**
   * 获取数据库配置
   */
  public getDatabaseConfig() {
    if (!this.env.DATABASE_URL) {
      return null;
    }

    return {
      url: this.env.DATABASE_URL,
      host: this.env.DB_HOST,
      port: this.env.DB_PORT,
      name: this.env.DB_NAME,
      user: this.env.DB_USER,
      password: this.env.DB_PASSWORD,
    };
  }

  /**
   * 获取 API 配置
   */
  public getApiConfig() {
    return {
      baseUrl: this.env.API_BASE_URL || `${this.env.NEXT_PUBLIC_APP_URL}/api`,
      timeout: this.env.API_TIMEOUT || 10000,
      retries: this.env.API_RETRIES || 3,
    };
  }

  /**
   * 获取速率限制配置（Hub 的更高限制）
   */
  public getRateLimitConfig() {
    return {
      requests: this.env.RATE_LIMIT_REQUESTS || 500,
      window: this.env.RATE_LIMIT_WINDOW || 900000, // 15 minutes
    };
  }

  /**
   * 获取 CORS 配置
   */
  public getCorsConfig() {
    const origins = this.env.CORS_ORIGINS?.split(",") || [this.env.NEXT_PUBLIC_APP_URL];

    return {
      origin: origins,
      credentials: this.env.CORS_CREDENTIALS === "true",
    };
  }

  /**
   * 获取监控配置
   */
  public getMonitoringConfig() {
    return {
      sentryDsn: this.env.SENTRY_DSN,
      datadogApiKey: this.env.DATADOG_API_KEY,
    };
  }
}

// 导出单例实例
export const hubConfig = HubAppConfig.getInstance();

// 导出配置函数
export { getHubClientEnv, loadHubEnvConfig } from "./env";
export { SITE_METADATA } from "./metadata";
export { hubConfig as default };
