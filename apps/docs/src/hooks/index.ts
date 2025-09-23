/**
 * 自定义Hooks统一导出
 */

export { useResponsiveLayout } from "@/components/layout/use-responsive-layout";
// Navbar相关Hooks
export { useActiveSection, useNavbarScroll } from "@/components/navbar";
// 缓存Hooks
export { useAdvancedCache, useCache } from "./use-advanced-cache";
export { useContentData } from "./use-content-data";
export { useHeadingObserver } from "./use-heading-observer";
// 核心Hooks
export { useMounted } from "./use-mounted";
export { useRoutePrefetch } from "./use-route-prefetch";
