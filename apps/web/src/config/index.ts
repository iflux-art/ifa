import { getClientConfig, loadWebEnvConfig } from "./env";
import { loadFeatureFlags, isFeatureEnabled } from "./features";
import type { ClientConfig } from "@/types/config";

/**
 * 简化的 Web App 配置类
 */
export class WebAppConfig {
  private static instance: WebAppConfig;
  private env: ReturnType<typeof loadWebEnvConfig>;
  private features: ReturnType<typeof loadFeatureFlags>;

  private constructor() {
    this.env = loadWebEnvConfig();
    this.features = loadFeatureFlags();
  }

  public static getInstance(): WebAppConfig {
    if (!WebAppConfig.instance) {
      WebAppConfig.instance = new WebAppConfig();
    }
    return WebAppConfig.instance;
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
  public getClientConfig(): ClientConfig {
    return getClientConfig();
  }

  /**
   * 检查功能是否启用
   */
  public isFeatureEnabled(feature: keyof typeof this.features): boolean {
    return isFeatureEnabled(feature);
  }

  /**
   * 获取应用元数据
   */
  public getAppMetadata() {
    return {
      name: this.env.NEXT_PUBLIC_APP_NAME,
      url: this.env.NEXT_PUBLIC_APP_URL,
      environment: this.env.NODE_ENV,
    };
  }
}

// Export singleton instance
export const webConfig = WebAppConfig.getInstance();

// Export configuration functions
export { getClientConfig, loadWebEnvConfig } from "./env";
export { loadFeatureFlags, isFeatureEnabled } from "./features";
export { SITE_METADATA } from "./metadata";
export { webConfig as default };
