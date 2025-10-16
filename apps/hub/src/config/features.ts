import type { FeatureFlags } from "@/types/config";
import { loadHubEnvConfig } from "./env";

/**
 * 默认功能标志配置
 */
const _defaultFeatures: FeatureFlags = {
  // React 19 特性
  reactCompiler: true,
  reactActions: true,
  useHook: true,

  // Next.js 15 特性
  ppr: true,
  turbopack: true,
  dynamicIO: true,

  // 性能特性
  caching: true,
  compression: true,
  bundleAnalysis: false,

  // 开发特性
  hotReload: true,
  sourceMap: true,
  typeChecking: true,

  // UI 特性
  darkMode: true,
  animations: true,
  accessibility: true,
};

/**
 * 从环境变量加载功能标志
 */
export function loadFeatureFlags(): FeatureFlags {
  const isDev = process.env.NODE_ENV === "development";

  return {
    // React 19 特性
    reactCompiler: true, // 默认启用
    reactActions: true, // 始终为 React 19 启用
    useHook: true, // 始终为 React 19 启用

    // Next.js 15 特性
    ppr: true, // 默认启用
    turbopack: true, // 默认启用
    dynamicIO: true, // 始终为 Next.js 15 启用

    // 性能特性
    caching: true, // 默认启用
    compression: true, // 默认启用
    bundleAnalysis: isDev,

    // 开发特性
    hotReload: isDev,
    sourceMap: true, // 默认启用
    typeChecking: true, // 默认启用

    // UI 特性
    darkMode: true, // 默认启用
    animations: true, // 默认启用
    accessibility: true, // 默认启用
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
 * 获取客户端使用的功能标志（可安全暴露）
 */
export function getClientFeatureFlags(): Partial<FeatureFlags> {
  const features = loadFeatureFlags();

  // 仅返回可安全暴露给客户端的功能标志
  return {
    darkMode: features.darkMode,
    animations: features.animations,
    accessibility: features.accessibility,
    reactCompiler: features.reactCompiler,
    ppr: features.ppr,
  };
}
