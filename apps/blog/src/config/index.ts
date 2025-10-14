import { getBlogClientEnv, loadBlogEnvConfig } from "./env";
import { loadFeatureFlags } from "./features";

/**
 * 博客应用配置
 */
export class BlogAppConfig {
  private static instance: BlogAppConfig;
  private env: ReturnType<typeof loadBlogEnvConfig>;
  private features: ReturnType<typeof loadFeatureFlags>;

  private constructor() {
    this.env = loadBlogEnvConfig();
    this.features = loadFeatureFlags();
  }

  public static getInstance(): BlogAppConfig {
    if (!BlogAppConfig.instance) {
      BlogAppConfig.instance = new BlogAppConfig();
    }
    return BlogAppConfig.instance;
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
      env: getBlogClientEnv(),
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
   * 获取博客特定配置
   */
  public getBlogConfig() {
    return {
      enableComments: this.env.NEXT_PUBLIC_ENABLE_COMMENTS,
      enableSearch: this.env.NEXT_PUBLIC_ENABLE_SEARCH,
      enableTags: this.env.NEXT_PUBLIC_ENABLE_TAGS,
      enableCategories: this.env.NEXT_PUBLIC_ENABLE_CATEGORIES,
      postsPerPage: this.env.NEXT_PUBLIC_POSTS_PER_PAGE,
      enableISR: this.env.ENABLE_ISR,
    };
  }

  /**
   * 获取CMS配置
   */
  public getCMSConfig() {
    return {
      apiUrl: this.env.CMS_API_URL,
      apiKey: this.env.CMS_API_KEY,
      cacheTTL: this.env.CONTENT_CACHE_TTL,
    };
  }

  /**
   * 获取SEO配置
   */
  public getSEOConfig() {
    return {
      siteName: this.env.NEXT_PUBLIC_SITE_NAME,
      siteDescription: this.env.NEXT_PUBLIC_SITE_DESCRIPTION,
      siteUrl: this.env.NEXT_PUBLIC_SITE_URL,
      defaultOGImage: this.env.NEXT_PUBLIC_DEFAULT_OG_IMAGE,
      twitterHandle: this.env.NEXT_PUBLIC_TWITTER_HANDLE,
      facebookPage: this.env.NEXT_PUBLIC_FACEBOOK_PAGE,
    };
  }

  /**
   * 获取分析统计配置
   */
  public getAnalyticsConfig() {
    return {
      gaId: this.env.NEXT_PUBLIC_GA_ID,
      gtmId: this.env.NEXT_PUBLIC_GTM_ID,
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
   * 获取API配置
   */
  public getApiConfig() {
    return {
      baseUrl: this.env.API_BASE_URL || `${this.env.NEXT_PUBLIC_APP_URL}/api`,
      timeout: this.env.API_TIMEOUT || 5000,
      retries: this.env.API_RETRIES || 3,
    };
  }

  /**
   * 获取速率限制配置
   */
  public getRateLimitConfig() {
    return {
      requests: this.env.RATE_LIMIT_REQUESTS || 200,
      window: this.env.RATE_LIMIT_WINDOW || 900000, // 15 minutes
    };
  }

  /**
   * 获取CORS配置
   */
  public getCorsConfig() {
    const origins = this.env.CORS_ORIGINS?.split(",") || [this.env.NEXT_PUBLIC_APP_URL];

    return {
      origin: origins,
      credentials: this.env.CORS_CREDENTIALS === "true",
    };
  }
}

// Export singleton instance
export const blogConfig = BlogAppConfig.getInstance();

// Export configuration functions
export { getBlogClientEnv, loadBlogEnvConfig } from "./env";
export { SITE_METADATA } from "./metadata";
export { blogConfig as default };
