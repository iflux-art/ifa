/**
 * 性能监控工具
 * 提供组件渲染时间和页面加载性能追踪
 */

import type { LayoutShift, PerformanceEventTiming, PerformanceMeasure } from "./types";

/**
 * 测量性能的工具函数
 */
export const measurePerformance = (name: string): PerformanceMeasure => {
  return {
    name,
    start: () => {
      if (typeof window !== "undefined" && "performance" in window) {
        performance.mark(`${name}-start`);
      }
    },
    end: () => {
      if (typeof window !== "undefined" && "performance" in window) {
        performance.mark(`${name}-end`);
        performance.measure(name, `${name}-start`, `${name}-end`);

        const measures = performance.getEntriesByName(name);
        const measure = measures[measures.length - 1];

        if (measure) {
          console.log(`${name}: ${measure.duration.toFixed(2)}ms`);
          return measure.duration;
        }
      }
      return 0;
    },
  };
};

/**
 * 监控组件渲染性能的 Hook
 */
export const usePerformanceMonitor = (componentName: string) => {
  const measure = measurePerformance(componentName);

  return {
    startMeasure: measure.start,
    endMeasure: measure.end,
  };
};

/**
 * 页面加载性能监控
 */
export const monitorPageLoad = (pageName: string) => {
  if (typeof window === "undefined") return;

  // 监控页面加载时间
  window.addEventListener("load", () => {
    const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming;

    if (navigation) {
      const loadTime = navigation.loadEventEnd - navigation.fetchStart;
      const domContentLoaded = navigation.domContentLoadedEventEnd - navigation.fetchStart;

      console.log(`${pageName} 页面性能:`, {
        总加载时间: `${loadTime.toFixed(2)}ms`,
        DOM加载时间: `${domContentLoaded.toFixed(2)}ms`,
        首次内容绘制: navigation.responseStart - navigation.fetchStart,
      });
    }
  });
};

/**
 * Core Web Vitals 监控
 */
export const monitorWebVitals = () => {
  if (typeof window === "undefined") return;

  // 监控 LCP (Largest Contentful Paint)
  new PerformanceObserver((entryList) => {
    const entries = entryList.getEntries();
    const lastEntry = entries[entries.length - 1];
    console.log("LCP:", lastEntry.startTime);
  }).observe({ entryTypes: ["largest-contentful-paint"] });

  // 监控 FID (First Input Delay)
  new PerformanceObserver((entryList) => {
    const entries = entryList.getEntries();
    entries.forEach((entry) => {
      const fidEntry = entry as PerformanceEventTiming;
      if (fidEntry.processingStart) {
        console.log("FID:", fidEntry.processingStart - fidEntry.startTime);
      }
    });
  }).observe({ entryTypes: ["first-input"] });

  // 监控 CLS (Cumulative Layout Shift)
  new PerformanceObserver((entryList) => {
    let clsValue = 0;
    const entries = entryList.getEntries();
    entries.forEach((entry) => {
      const clsEntry = entry as LayoutShift;
      if (!clsEntry.hadRecentInput) {
        clsValue += clsEntry.value;
      }
    });
    console.log("CLS:", clsValue);
  }).observe({ entryTypes: ["layout-shift"] });
};
