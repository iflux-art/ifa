import { getBlogClientEnv, loadBlogEnvConfig } from "./env";
import { loadFeatureFlags } from "./features";

/**
 * 博客应用配置管理器
 * 使用单例模式管理应用配置
 */
export class BlogAppConfig {
  private static instance: BlogAppConfig;
  private readonly env: ReturnType<typeof loadBlogEnvConfig>;
  private readonly features: ReturnType<typeof loadFeatureFlags>;

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
      environment: process.env.NODE_ENV || "development",
      version: process.env.npm_package_version || "1.0.0",
    };
  }

  /**
   * 获取博客特定配置
   */
  public getBlogConfig() {
    return {
      enableComments: this.env.NEXT_PUBLIC_ENABLE_COMMENTS,
      postsPerPage: this.env.NEXT_PUBLIC_POSTS_PER_PAGE,
    };
  }

  /**
   * 获取CMS配置
   */
  public getCMSConfig() {
    return {
      apiUrl: this.env.CMS_API_URL,
      apiKey: this.env.CMS_API_KEY,
    };
  }
}

// Export singleton instance
export const blogConfig = BlogAppConfig.getInstance();

// Export configuration functions
export { getBlogClientEnv, loadBlogEnvConfig } from "./env";
export { SITE_METADATA } from "./metadata";
export { blogConfig as default };
