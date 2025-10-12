"use client";

import type React from "react";
import { type ComponentType, lazy, Suspense } from "react";

// 定义一个更具体的组件类型，避免使用 any
type LazyLoadableComponent = ComponentType<Record<string, unknown>>;

/**
 * 路由级别的懒加载配置
 */
interface RouteLazyConfig {
  /** 预加载延迟时间（毫秒） */
  preloadDelay?: number;
  /** 是否启用智能预加载 */
  enableSmartPreload?: boolean;
  /** 自定义加载组件 */
  fallback?: React.ComponentType;
  /** 错误边界组件 */
  errorBoundary?: React.ComponentType<{ children: React.ReactNode; fallback?: React.ReactNode }>;
}

/**
 * 创建路由级别的懒加载组件
 * @param importFn 动态导入函数
 * @param config 懒加载配置
 * @returns 懒加载的路由组件
 */
export function createRouteLazyComponent(
  importFn: () => Promise<{ default: LazyLoadableComponent }>,
  config: RouteLazyConfig = {}
) {
  const {
    preloadDelay = 100,
    enableSmartPreload = true,
    fallback: CustomFallback,
    errorBoundary: ErrorBoundary,
  } = config;

  // 创建懒加载组件
  const LazyComponent = lazy(importFn);

  // 预加载逻辑
  if (enableSmartPreload && typeof window !== "undefined") {
    // 在空闲时间预加载
    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(() => {
        setTimeout(() => {
          importFn().catch(() => {
            // 静默处理预加载错误
          });
        }, preloadDelay);
      });
    } else {
      // 降级到 setTimeout
      setTimeout(() => {
        importFn().catch(() => {
          // 静默处理预加载错误
        });
      }, preloadDelay);
    }
  }

  return function RouteLazyWrapper(props: Record<string, unknown>) {
    const FallbackComponent = CustomFallback || DefaultRouteFallback;

    const LazyContent = (
      <Suspense fallback={<FallbackComponent />}>
        <LazyComponent {...props} />
      </Suspense>
    );

    // 如果提供了错误边界，使用它包装组件
    if (ErrorBoundary) {
      return (
        <ErrorBoundary
          fallback={
            <div className="flex min-h-screen items-center justify-center">
              <div className="text-center">
                <h1 className="mb-2 font-semibold text-xl">页面加载失败</h1>
                <p className="mb-4 text-muted-foreground">请刷新页面重试</p>
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="rounded-md bg-primary px-4 py-2 text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  刷新页面
                </button>
              </div>
            </div>
          }
        >
          {LazyContent}
        </ErrorBoundary>
      );
    }

    return LazyContent;
  };
}

/**
 * 默认的路由加载组件
 */
function DefaultRouteFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-primary border-b-2"></div>
        <p className="text-muted-foreground text-sm">加载中...</p>
      </div>
    </div>
  );
}

/**
 * 主页面专用的加载组件
 */
function HomePageFallback() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4">
        <div className="grid animate-pulse grid-cols-12 gap-6">
          {/* 侧边栏骨架 */}
          <div className="col-span-12 md:col-span-2">
            <div className="space-y-4 pt-6">
              <div className="h-6 w-3/4 rounded bg-muted"></div>
              <div className="space-y-2">
                {Array.from({ length: 8 }, () => (
                  <div key={crypto.randomUUID()} className="h-4 w-full rounded bg-muted"></div>
                ))}
              </div>
            </div>
          </div>

          {/* 主内容区骨架 */}
          <div className="col-span-12 md:col-span-10 md:col-start-3">
            <div className="space-y-6 pt-6">
              {/* 标题骨架 */}
              <div className="h-8 w-1/3 rounded bg-muted"></div>

              {/* 链接卡片骨架 */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 9 }, () => (
                  <div key={crypto.randomUUID()} className="space-y-3 rounded-lg border p-4">
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 rounded bg-muted"></div>
                      <div className="h-5 flex-1 rounded bg-muted"></div>
                    </div>
                    <div className="h-4 w-full rounded bg-muted"></div>
                    <div className="h-4 w-2/3 rounded bg-muted"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * 管理页面专用的加载组件
 */
function AdminPageFallback() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 lg:py-8">
        <div className="animate-pulse space-y-6">
          {/* 页面标题骨架 */}
          <div className="h-8 w-1/3 rounded-lg bg-muted"></div>

          {/* 搜索和过滤骨架 */}
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="h-10 flex-1 rounded bg-muted"></div>
            <div className="h-10 w-32 rounded bg-muted"></div>
            <div className="h-10 w-24 rounded bg-muted"></div>
          </div>

          {/* 数据表格骨架 */}
          <div className="rounded-lg border">
            {/* 表头 */}
            <div className="border-b p-4">
              <div className="grid grid-cols-5 gap-4">
                {Array.from({ length: 5 }, () => (
                  <div key={crypto.randomUUID()} className="h-4 rounded bg-muted"></div>
                ))}
              </div>
            </div>

            {/* 表格行 */}
            {Array.from({ length: 8 }, () => (
              <div key={crypto.randomUUID()} className="border-b p-4">
                <div className="grid grid-cols-5 gap-4">
                  {Array.from({ length: 5 }, () => (
                    <div key={crypto.randomUUID()} className="h-4 rounded bg-muted"></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * 预定义的路由懒加载组件
 */
export const RouteLazyComponents = {
  /**
   * 创建主页面懒加载组件
   */
  createHomePage: (importFn: () => Promise<{ default: LazyLoadableComponent }>) =>
    createRouteLazyComponent(importFn, {
      fallback: HomePageFallback,
      preloadDelay: 50,
      enableSmartPreload: true,
    }),

  /**
   * 创建管理页面懒加载组件
   */
  createAdminPage: (importFn: () => Promise<{ default: LazyLoadableComponent }>) =>
    createRouteLazyComponent(importFn, {
      fallback: AdminPageFallback,
      preloadDelay: 100,
      enableSmartPreload: true,
    }),

  /**
   * 创建认证页面懒加载组件
   */
  createAuthPage: (importFn: () => Promise<{ default: LazyLoadableComponent }>) =>
    createRouteLazyComponent(importFn, {
      fallback: () => (
        <div className="flex min-h-screen items-center justify-center bg-background">
          <div className="w-full max-w-md p-6">
            <div className="animate-pulse space-y-6">
              <div className="mx-auto h-12 w-32 rounded-lg bg-muted"></div>
              <div className="space-y-4">
                <div className="h-10 w-full rounded bg-muted"></div>
                <div className="h-10 w-full rounded bg-muted"></div>
              </div>
              <div className="h-10 w-full rounded bg-muted"></div>
            </div>
          </div>
        </div>
      ),
      preloadDelay: 200,
      enableSmartPreload: false, // 认证页面不需要预加载
    }),
};

/**
 * 路由预加载管理器
 */
const preloadedRoutes = new Set<string>();

/**
 * 预加载指定路由
 */
export function preloadRoute(
  routeId: string,
  importFn: () => Promise<{ default: LazyLoadableComponent }>,
  delay = 0
) {
  if (preloadedRoutes.has(routeId)) {
    return;
  }

  preloadedRoutes.add(routeId);

  const preload = () => {
    importFn().catch(() => {
      // 预加载失败时从集合中移除，允许重试
      preloadedRoutes.delete(routeId);
    });
  };

  if (delay > 0) {
    setTimeout(preload, delay);
  } else {
    preload();
  }
}

/**
 * 基于用户交互预加载路由
 */
export function preloadOnHover(
  element: HTMLElement,
  routeId: string,
  importFn: () => Promise<{ default: LazyLoadableComponent }>
) {
  if (preloadedRoutes.has(routeId)) {
    return;
  }

  const handleMouseEnter = () => {
    preloadRoute(routeId, importFn);
    element.removeEventListener("mouseenter", handleMouseEnter);
  };

  element.addEventListener("mouseenter", handleMouseEnter);
}

/**
 * 基于视口交叉预加载路由
 */
export function preloadOnIntersection(
  element: HTMLElement,
  routeId: string,
  importFn: () => Promise<{ default: LazyLoadableComponent }>,
  options?: IntersectionObserverInit
) {
  if (preloadedRoutes.has(routeId)) {
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          preloadRoute(routeId, importFn);
          observer.disconnect();
        }
      });
    },
    { threshold: 0.1, ...options }
  );

  observer.observe(element);
}

/**
 * 清除预加载缓存
 */
export function clearPreloadCache() {
  preloadedRoutes.clear();
}

/**
 * 获取已预加载的路由列表
 */
export function getPreloadedRoutes() {
  return Array.from(preloadedRoutes);
}
