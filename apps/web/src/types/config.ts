/**
 * 简化的功能标志配置
 */
export interface FeatureFlags {
  // 核心 UI 功能
  darkMode: boolean;
  animations: boolean;
  accessibility: boolean;
}

/**
 * 简化的客户端配置接口
 */
export interface ClientConfig {
  appName: string;
  appUrl: string;
}
