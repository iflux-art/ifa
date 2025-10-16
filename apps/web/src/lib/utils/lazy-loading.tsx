"use client";

import type React from "react";
import { type ComponentType, lazy, Suspense } from "react";

/**
 * 创建懒加载组件的工厂函数
 * @param importFn 动态导入函数
 * @param fallback 加载时的占位组件
 * @returns 懒加载组件
 */
export function createLazyComponent<T extends ComponentType<unknown>>(
  importFn: () => Promise<{ default: T }>,
  fallback?: React.ComponentType
) {
  const LazyComponent = lazy(importFn);

  return function LazyWrapper(props: Record<string, unknown>) {
    const FallbackComponent = fallback || DefaultLoadingFallback;

    return (
      <Suspense fallback={<FallbackComponent />}>
        {/* biome-ignore lint/suspicious/noExplicitAny: Required for React lazy component type compatibility */}
        <LazyComponent {...(props as any)} />
      </Suspense>
    );
  };
}

/**
 * 默认加载回退组件
 */
const DefaultLoadingFallback = () => (
  <div className="flex items-center justify-center p-4">
    <div className="h-8 w-8 animate-spin rounded-full border-primary border-b-2" />
  </div>
);

/**
 * 路由级懒加载组件
 * @param importFn 动态导入函数
 * @returns 懒加载的页面组件
 */
export function createLazyPage<T extends ComponentType<unknown>>(
  importFn: () => Promise<{ default: T }>
) {
  // 动态导入 PageLoadingSkeleton 以避免循环依赖
  const PageLoadingFallback = () => {
    // 这里直接内联实现，避免循环导入
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6 lg:py-8">
          <div className="fixed top-16 right-0 left-0 z-50">
            <div className="h-1 w-full overflow-hidden bg-gray-200 dark:bg-gray-800">
              <div
                className="h-full animate-pulse bg-primary"
                style={{
                  width: "60%",
                  transition: "width 300ms ease-out",
                }}
              />
            </div>
          </div>
          <div className="flex min-h-[50vh] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-primary border-b-2" />
              <p className="text-muted-foreground">加载中...</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return createLazyComponent(importFn, PageLoadingFallback);
}

/**
 * 预加载组件
 * @param importFn 动态导入函数
 */
export function preloadComponent(importFn: () => Promise<unknown>) {
  // 在空闲时间预加载组件
  if (typeof window !== "undefined" && "requestIdleCallback" in window) {
    window.requestIdleCallback(() => {
      importFn();
    });
  } else {
    // 降级到 setTimeout
    setTimeout(() => {
      importFn();
    }, 100);
  }
}

/**
 * 智能预加载 - 基于用户交互预测
 */
const preloadedComponents = new Set<string>();

export const SmartPreloader = {
  preloadOnHover(element: HTMLElement, importFn: () => Promise<unknown>, componentId: string) {
    if (preloadedComponents.has(componentId)) {
      return;
    }

    const handleMouseEnter = () => {
      preloadedComponents.add(componentId);
      preloadComponent(importFn);
      element.removeEventListener("mouseenter", handleMouseEnter);
    };

    element.addEventListener("mouseenter", handleMouseEnter);
  },

  preloadOnIntersection(
    element: HTMLElement,
    importFn: () => Promise<unknown>,
    componentId: string,
    options?: IntersectionObserverInit
  ) {
    if (preloadedComponents.has(componentId)) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            preloadedComponents.add(componentId);
            preloadComponent(importFn);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1, ...options }
    );

    observer.observe(element);
  },
};
