import { getHubClientEnv, loadHubEnvConfig } from "./env";
import { loadFeatureFlags } from "./features";
import { APP_CONSTANTS } from "@/lib/constants";

/**
 * 配置分组类型
 */
interface ConfigGroup<T> {
  [key: string]: T;
}

/**
 * Hub 应用配置管理器
 * 优化了配置访问模式，提供更好的类型安全和缓存机制
 */
export class HubAppConfig {
  private static instance: HubAppConfig;
  private env: ReturnType<typeof loadHubEnvConfig>;
  private features: ReturnType<typeof loadFeatureFlags>;
  private configCache = new Map<string, unknown>();

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
   * 缓存配置访问
   */
  private getCachedConfig<T>(key: string, factory: () => T): T {
    if (!this.configCache.has(key)) {
      this.configCache.set(key, factory());
    }
    return this.configCache.get(key) as T;
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
    return this.getCachedConfig("client", () => ({
      env: getHubClientEnv(),
      features: {
        darkMode: this.features.darkMode,
        animations: this.features.animations,
        accessibility: this.features.accessibility,
        reactCompiler: this.features.reactCompiler,
        ppr: this.features.ppr,
      },
    }));
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
    return this.getCachedConfig("app", () => ({
      name: this.env.NEXT_PUBLIC_APP_NAME || APP_CONSTANTS.NAME,
      url: this.env.NEXT_PUBLIC_APP_URL,
      environment: process.env.NODE_ENV || "development",
      version: process.env.npm_package_version || APP_CONSTANTS.VERSION,
      description: APP_CONSTANTS.DESCRIPTION,
    }));
  }

  /**
   * 获取认证配置组
   */
  public getClerkConfig() {
    return this.getCachedConfig("clerk", () => ({
      publishableKey: this.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
      secretKey: this.env.CLERK_SECRET_KEY,
    }));
  }

  /**
   * 获取所有配置组
   */
  public getAllConfigs(): ConfigGroup<unknown> {
    return {
      app: this.getAppMetadata(),
      auth: this.getClerkConfig(),
      client: this.getClientConfig(),
    };
  }

  /**
   * 清除配置缓存
   */
  public clearCache(): void {
    this.configCache.clear();
  }

  /**
   * 获取配置摘要（用于调试）
   */
  public getConfigSummary() {
    return {
      environment: process.env.NODE_ENV || "development",
      features: Object.keys(this.features).filter(
        (key) => this.features[key as keyof typeof this.features]
      ),
      cacheSize: this.configCache.size,
    };
  }
}

// 导出单例实例
export const hubConfig = HubAppConfig.getInstance();

// 导出配置函数
export { getHubClientEnv, loadHubEnvConfig } from "./env";
export { SITE_METADATA } from "./metadata";
export { hubConfig as default };
