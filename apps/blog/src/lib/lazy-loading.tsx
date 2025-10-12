"use client";

import type React from "react";
import { lazy, type ComponentType, Suspense } from "react";

/**
 * 创建懒加载组件的工厂函数
 * @param importFn 动态导入函数
 * @param fallback 加载时的占位组件
 * @returns 懒加载组件
 */
export function createLazyComponent<T extends ComponentType<Record<string, unknown>>>(
  importFn: () => Promise<{ default: T }>,
  fallback?: React.ComponentType
) {
  const LazyComponent = lazy(importFn);

  return function LazyWrapper(props: Record<string, unknown>) {
    const FallbackComponent =
      fallback ||
      (() => (
        <div className="flex items-center justify-center p-4">
          <div className="h-8 w-8 animate-spin rounded-full border-primary border-b-2"></div>
        </div>
      ));

    return (
      <Suspense fallback={<FallbackComponent />}>
        {/* biome-ignore lint/suspicious/noExplicitAny: Required for React lazy component type compatibility */}
        <LazyComponent {...(props as any)} />
      </Suspense>
    );
  };
}

/**
 * 博客文章懒加载组件
 * @param importFn 动态导入函数
 * @returns 懒加载的文章组件
 */
export function createLazyPost<T extends ComponentType<Record<string, unknown>>>(
  importFn: () => Promise<{ default: T }>
) {
  return createLazyComponent(importFn, () => (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 lg:py-8">
        <div className="mx-auto max-w-4xl">
          <div className="animate-pulse space-y-6">
            {/* 标题骨架 */}
            <div className="h-12 w-3/4 rounded-lg bg-muted"></div>

            {/* 元信息骨架 */}
            <div className="flex space-x-4">
              <div className="h-4 w-24 rounded bg-muted"></div>
              <div className="h-4 w-32 rounded bg-muted"></div>
              <div className="h-4 w-20 rounded bg-muted"></div>
            </div>

            {/* 内容骨架 */}
            <div className="space-y-4">
              <div className="h-4 w-full rounded bg-muted"></div>
              <div className="h-4 w-5/6 rounded bg-muted"></div>
              <div className="h-4 w-4/5 rounded bg-muted"></div>
              <div className="h-32 w-full rounded-lg bg-muted"></div>
              <div className="h-4 w-full rounded bg-muted"></div>
              <div className="h-4 w-3/4 rounded bg-muted"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ));
}

/**
 * MDX 内容懒加载
 * @param importFn 动态导入函数
 * @returns 懒加载的 MDX 组件
 */
export function createLazyMDX<T extends ComponentType<Record<string, unknown>>>(
  importFn: () => Promise<{ default: T }>
) {
  return createLazyComponent(importFn, () => (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <div className="animate-pulse space-y-4">
        <div className="h-6 w-2/3 rounded bg-muted"></div>
        <div className="h-4 w-full rounded bg-muted"></div>
        <div className="h-4 w-5/6 rounded bg-muted"></div>
        <div className="h-4 w-4/5 rounded bg-muted"></div>
        <div className="h-24 w-full rounded-lg bg-muted"></div>
        <div className="h-4 w-full rounded bg-muted"></div>
        <div className="h-4 w-3/4 rounded bg-muted"></div>
      </div>
    </div>
  ));
}

/**
 * 预加载组件
 * @param importFn 动态导入函数
 */
export function preloadComponent(
  importFn: () => Promise<{ default: ComponentType<Record<string, unknown>> }>
) {
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
  preloadOnHover(
    element: HTMLElement,
    importFn: () => Promise<{ default: ComponentType<Record<string, unknown>> }>,
    componentId: string
  ) {
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
    importFn: () => Promise<{ default: ComponentType<Record<string, unknown>> }>,
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
