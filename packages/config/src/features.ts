import type { FeatureFlags } from "@repo/types";
import { loadEnvConfig } from "./env";

/**
 * 默认功能标志配置
 */
const _defaultFeatures: FeatureFlags = {
  // React 19功能
  reactCompiler: true,
  reactActions: true,
  useHook: true,

  // Next.js 15功能
  ppr: true,
  turbopack: true,
  dynamicIO: true,

  // 性能功能
  caching: true,
  compression: true,
  bundleAnalysis: false,

  // 开发功能
  hotReload: true,
  sourceMap: true,
  typeChecking: true,

  // UI功能
  darkMode: true,
  animations: true,
  accessibility: true,
};

/**
 * 从环境变量加载功能标志
 */
export function loadFeatureFlags(): FeatureFlags {
  const env = loadEnvConfig();

  return {
    // React 19功能
    reactCompiler: env.ENABLE_REACT_COMPILER,
    reactActions: true, // React 19始终启用
    useHook: true, // React 19始终启用

    // Next.js 15功能
    ppr: env.ENABLE_PPR,
    turbopack: env.ENABLE_TURBOPACK,
    dynamicIO: true, // Next.js 15始终启用

    // 性能功能
    caching: env.ENABLE_CACHING,
    compression: env.ENABLE_COMPRESSION,
    bundleAnalysis: env.NODE_ENV === "development",

    // 开发功能
    hotReload: env.ENABLE_HOT_RELOAD && env.NODE_ENV === "development",
    sourceMap: env.ENABLE_SOURCE_MAP,
    typeChecking: env.ENABLE_TYPE_CHECKING,

    // UI功能
    darkMode: env.ENABLE_DARK_MODE,
    animations: env.ENABLE_ANIMATIONS,
    accessibility: env.ENABLE_ACCESSIBILITY,
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

/**
 * 用于条件渲染的功能标志中间件
 */
export function withFeature<T>(
  feature: keyof FeatureFlags,
  component: T,
  fallback?: T
): T | undefined {
  return isFeatureEnabled(feature) ? component : fallback;
}

/**
 * React组件的功能标志Hook
 */
export function createFeatureHook() {
  const features = loadFeatureFlags();

  return function useFeature(feature: keyof FeatureFlags): boolean {
    return features[feature];
  };
}

/**
 * 仅开发环境的功能
 */
export function getDevelopmentFeatures(): Partial<FeatureFlags> {
  const features = loadFeatureFlags();
  const env = loadEnvConfig();

  if (env.NODE_ENV !== "development") {
    return {};
  }

  return {
    hotReload: features.hotReload,
    sourceMap: features.sourceMap,
    bundleAnalysis: features.bundleAnalysis,
    typeChecking: features.typeChecking,
  };
}

/**
 * 仅生产环境的功能
 */
export function getProductionFeatures(): Partial<FeatureFlags> {
  const features = loadFeatureFlags();
  const env = loadEnvConfig();

  if (env.NODE_ENV !== "production") {
    return {};
  }

  return {
    compression: features.compression,
    caching: features.caching,
  };
}

/**
 * 实验性功能（默认禁用）
 */
export function getExperimentalFeatures(): Partial<FeatureFlags> {
  return {
    // 在此处添加实验性功能
    // 这些功能应通过环境变量选择启用
  };
}
