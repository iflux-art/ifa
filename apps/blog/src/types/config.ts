/**
 * 功能标志配置
 */
export interface FeatureFlags {
  // React 19 特性
  reactCompiler: boolean;
  reactActions: boolean;
  useHook: boolean;

  // Next.js 15 特性
  ppr: boolean; // 部分预渲染
  turbopack: boolean;
  dynamicIO: boolean;

  // 性能特性
  caching: boolean;
  compression: boolean;
  bundleAnalysis: boolean;

  // 开发特性
  hotReload: boolean;
  sourceMap: boolean;
  typeChecking: boolean;

  // UI 特性
  darkMode: boolean;
  animations: boolean;
  accessibility: boolean;
}
