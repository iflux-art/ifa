"use client";

import { useEffect } from "react";
import { initBundleAnalyzer } from "@/lib/bundle-analyzer";
import { preloadRouteComponents } from "@/lib/component-preloader";

/**
 * 性能优化初始化组件
 * 负责初始化 bundle 分析器和组件预加载器
 */
export function PerformanceInitializer() {
  useEffect(() => {
    // 初始化 bundle 分析器
    initBundleAnalyzer();

    // 预加载路由组件
    preloadRouteComponents();

    // 在开发环境中输出初始化信息
    if (process.env.NODE_ENV === "development") {
      console.log("[Performance] 已初始化 bundle 分析器和组件预加载器");
    }
  }, []);

  return null;
}
