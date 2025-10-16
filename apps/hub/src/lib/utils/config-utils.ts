/**
 * 配置工具函数
 * 提供统一的配置访问和管理功能
 */

import { hubConfig } from "@/config";

/**
 * 配置访问器类型
 */
export type ConfigAccessor<T> = () => T;

/**
 * 缓存的配置访问器
 */
class ConfigCache {
  private cache = new Map<string, unknown>();

  /**
   * 获取缓存的配置值
   */
  get<T>(key: string, accessor: ConfigAccessor<T>): T {
    if (!this.cache.has(key)) {
      this.cache.set(key, accessor());
    }
    return this.cache.get(key) as T;
  }

  /**
   * 清除缓存
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * 删除特定缓存项
   */
  delete(key: string): boolean {
    return this.cache.delete(key);
  }
}

const configCache = new ConfigCache();

/**
 * 统一的配置访问函数
 */
export const getConfig = {
  /**
   * 获取应用元数据
   */
  app: () => configCache.get("app", () => hubConfig.getAppMetadata()),

  /**
   * 获取认证配置
   */
  auth: () => configCache.get("auth", () => hubConfig.getClerkConfig()),

  /**
   * 获取客户端配置
   */
  client: () => configCache.get("client", () => hubConfig.getClientConfig()),

  /**
   * 获取环境配置
   */
  env: () => configCache.get("env", () => hubConfig.getEnv()),

  /**
   * 获取功能标志
   */
  features: () => configCache.get("features", () => hubConfig.getFeatures()),
};

/**
 * 检查功能是否启用
 */
export function isFeatureEnabled(feature: string): boolean {
  const features = getConfig.features();
  return Boolean(features[feature as keyof typeof features]);
}

/**
 * 获取环境变量值
 */
export function getEnvVar(key: string, defaultValue?: string): string {
  const env = getConfig.env();
  const value = env[key as keyof typeof env];
  return typeof value === "string" ? value : defaultValue || "";
}

/**
 * 检查是否为开发环境
 */
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === "development";
}

/**
 * 检查是否为生产环境
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === "production";
}

/**
 * 清除配置缓存
 */
export function clearConfigCache(): void {
  configCache.clear();
}

/**
 * 获取完整的应用配置
 */
export function getFullConfig() {
  return {
    app: getConfig.app(),
    auth: getConfig.auth(),
    client: getConfig.client(),
    env: getConfig.env(),
    features: getConfig.features(),
  };
}
