import { getClientConfig, loadWebEnvConfig } from "./env";

/**
 * 简化的 Web App 配置类
 */
export class WebAppConfig {
  private static instance: WebAppConfig;
  private env: ReturnType<typeof loadWebEnvConfig>;

  private constructor() {
    this.env = loadWebEnvConfig();
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
   * 获取客户端安全配置
   */
  public getClientConfig() {
    return getClientConfig();
  }

  /**
   * 获取应用元数据
   */
  public getAppMetadata() {
    return {
      name: this.env.NEXT_PUBLIC_APP_NAME,
      url: this.env.NEXT_PUBLIC_APP_URL,
      environment: process.env.NODE_ENV || "development",
    };
  }
}

// Export singleton instance
export const webConfig = WebAppConfig.getInstance();

// Export configuration functions
export { getClientConfig, loadWebEnvConfig } from "./env";
export { SITE_METADATA } from "./metadata";
export { webConfig as default };
