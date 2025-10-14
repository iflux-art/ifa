import { loadWebEnvConfig } from "./env";
import type { FeatureFlags } from "@/types/config";

/**
 * 从环境变量加载功能标志
 */
export function loadFeatureFlags(): FeatureFlags {
  const env = loadWebEnvConfig();

  return {
    darkMode: env.NEXT_PUBLIC_ENABLE_DARK_MODE,
    animations: env.NEXT_PUBLIC_ENABLE_ANIMATIONS,
    accessibility: env.NEXT_PUBLIC_ENABLE_ACCESSIBILITY,
  };
}

/**
 * 检查功能是否启用
 */
export function isFeatureEnabled(feature: keyof FeatureFlags): boolean {
  const features = loadFeatureFlags();
  return features[feature];
}

/**
 * 获取客户端功能标志
 */
export function getClientFeatureFlags(): FeatureFlags {
  return loadFeatureFlags();
}
