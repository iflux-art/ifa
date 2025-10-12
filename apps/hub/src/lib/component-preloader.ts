/**
 * 组件预加载器
 * 智能预加载组件以提升用户体验
 */

import type { ComponentType } from "react";

interface PreloadConfig {
  /** 预加载优先级 */
  priority: "high" | "medium" | "low";
  /** 预加载延迟（毫秒） */
  delay?: number;
  /** 是否在空闲时预加载 */
  onIdle?: boolean;
  /** 是否基于用户交互预加载 */
  onInteraction?: boolean;
  /** 是否基于视口交叉预加载 */
  onIntersection?: boolean;
}

// 定义一个更具体的组件类型，避免使用 any
type PreloadableComponent = ComponentType<Record<string, unknown>>;

interface PreloadEntry {
  id: string;
  importFn: () => Promise<{ default: PreloadableComponent }>;
  config: PreloadConfig;
  status: "pending" | "loading" | "loaded" | "error";
  loadedAt?: number;
  error?: Error;
}

/**
 * 组件预加载器类
 */
export class ComponentPreloader {
  private static instance: ComponentPreloader;
  private preloadQueue: Map<string, PreloadEntry> = new Map();
  private loadedComponents: Map<string, PreloadableComponent> = new Map();
  private isPreloading = false;

  static getInstance(): ComponentPreloader {
    if (!ComponentPreloader.instance) {
      ComponentPreloader.instance = new ComponentPreloader();
    }
    return ComponentPreloader.instance;
  }

  /**
   * 注册组件预加载
   */
  register(
    id: string,
    importFn: () => Promise<{ default: PreloadableComponent }>,
    config: PreloadConfig
  ) {
    if (this.preloadQueue.has(id) || this.loadedComponents.has(id)) {
      return; // 已注册或已加载
    }

    const entry: PreloadEntry = {
      id,
      importFn,
      config,
      status: "pending",
    };

    this.preloadQueue.set(id, entry);

    // 根据配置决定何时开始预加载
    this.schedulePreload(entry);
  }

  /**
   * 调度预加载
   */
  private schedulePreload(entry: PreloadEntry) {
    const { config } = entry;

    if (config.onIdle && typeof window !== "undefined") {
      this.scheduleIdlePreload(entry);
    } else if (config.delay && config.delay > 0) {
      setTimeout(() => this.preloadComponent(entry.id), config.delay);
    } else if (config.priority === "high") {
      // 高优先级立即预加载
      this.preloadComponent(entry.id);
    }
  }

  /**
   * 在空闲时预加载
   */
  private scheduleIdlePreload(entry: PreloadEntry) {
    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(() => this.preloadComponent(entry.id), { timeout: 5000 });
    } else {
      // 降级到 setTimeout
      setTimeout(() => this.preloadComponent(entry.id), entry.config.delay || 100);
    }
  }

  /**
   * 预加载组件
   */
  private async preloadComponent(id: string): Promise<void> {
    const entry = this.preloadQueue.get(id);
    if (!entry || entry.status !== "pending") {
      return;
    }

    entry.status = "loading";

    try {
      const module = await entry.importFn();
      const component = module.default;

      this.loadedComponents.set(id, component);
      entry.status = "loaded";
      entry.loadedAt = Date.now();

      // 从队列中移除
      this.preloadQueue.delete(id);

      if (process.env.NODE_ENV === "development") {
        console.log(`[Preloader] Successfully preloaded component: ${id}`);
      }
    } catch (error) {
      entry.status = "error";
      entry.error = error instanceof Error ? error : new Error("Unknown preload error");

      if (process.env.NODE_ENV === "development") {
        console.warn(`[Preloader] Failed to preload component: ${id}`, error);
      }
    }
  }

  /**
   * 获取预加载的组件
   */
  getComponent(id: string): PreloadableComponent | null {
    return this.loadedComponents.get(id) || null;
  }

  /**
   * 检查组件是否已预加载
   */
  isLoaded(id: string): boolean {
    return this.loadedComponents.has(id);
  }

  /**
   * 强制预加载组件
   */
  async forcePreload(id: string): Promise<PreloadableComponent | null> {
    // 如果已加载，直接返回
    if (this.loadedComponents.has(id)) {
      return this.loadedComponents.get(id) || null;
    }

    // 如果在队列中，立即预加载
    const entry = this.preloadQueue.get(id);
    if (entry) {
      await this.preloadComponent(id);
      return this.loadedComponents.get(id) || null;
    }

    return null;
  }

  /**
   * 基于用户交互预加载
   */
  preloadOnHover(
    element: HTMLElement,
    componentId: string,
    importFn: () => Promise<{ default: PreloadableComponent }>
  ) {
    if (this.isLoaded(componentId)) return;

    const handleMouseEnter = () => {
      this.register(componentId, importFn, {
        priority: "high",
        onInteraction: true,
      });
      element.removeEventListener("mouseenter", handleMouseEnter);
    };

    element.addEventListener("mouseenter", handleMouseEnter);
  }

  /**
   * 基于视口交叉预加载
   */
  preloadOnIntersection(
    element: HTMLElement,
    componentId: string,
    importFn: () => Promise<{ default: PreloadableComponent }>,
    options?: IntersectionObserverInit
  ) {
    if (this.isLoaded(componentId)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.register(componentId, importFn, {
              priority: "medium",
              onIntersection: true,
            });
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1, ...options }
    );

    observer.observe(element);
  }

  /**
   * 批量预加载
   */
  async preloadBatch(
    components: Array<{
      id: string;
      importFn: () => Promise<{ default: PreloadableComponent }>;
      config?: Partial<PreloadConfig>;
    }>
  ): Promise<void> {
    if (this.isPreloading) return;

    this.isPreloading = true;

    try {
      // 按优先级排序
      const sortedComponents = components.sort((a, b) => {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        const aPriority = a.config?.priority || "medium";
        const bPriority = b.config?.priority || "medium";
        return priorityOrder[aPriority] - priorityOrder[bPriority];
      });

      // 并发预加载高优先级组件
      const highPriorityComponents = sortedComponents.filter(
        (c) => (c.config?.priority || "medium") === "high"
      );

      if (highPriorityComponents.length > 0) {
        await Promise.allSettled(
          highPriorityComponents.map((c) => {
            this.register(c.id, c.importFn, {
              priority: "high",
              ...c.config,
            });
            return this.forcePreload(c.id);
          })
        );
      }

      // 串行预加载中低优先级组件
      const otherComponents = sortedComponents.filter(
        (c) => (c.config?.priority || "medium") !== "high"
      );

      for (const component of otherComponents) {
        this.register(component.id, component.importFn, {
          priority: "medium",
          onIdle: true,
          ...component.config,
        });
      }
    } finally {
      this.isPreloading = false;
    }
  }

  /**
   * 获取预加载统计信息
   */
  getStats() {
    const pending = Array.from(this.preloadQueue.values()).filter(
      (entry) => entry.status === "pending"
    ).length;

    const loading = Array.from(this.preloadQueue.values()).filter(
      (entry) => entry.status === "loading"
    ).length;

    const loaded = this.loadedComponents.size;

    const errors = Array.from(this.preloadQueue.values()).filter(
      (entry) => entry.status === "error"
    ).length;

    return {
      pending,
      loading,
      loaded,
      errors,
      total: pending + loading + loaded + errors,
    };
  }

  /**
   * 清理预加载缓存
   */
  clear() {
    this.preloadQueue.clear();
    this.loadedComponents.clear();
    this.isPreloading = false;
  }

  /**
   * 获取预加载报告
   */
  getReport(): string {
    const stats = this.getStats();

    let report = "=== Component Preloader Report ===\n\n";
    report += `Total Components: ${stats.total}\n`;
    report += `Loaded: ${stats.loaded}\n`;
    report += `Loading: ${stats.loading}\n`;
    report += `Pending: ${stats.pending}\n`;
    report += `Errors: ${stats.errors}\n\n`;

    if (stats.errors > 0) {
      report += "Failed Components:\n";
      Array.from(this.preloadQueue.values())
        .filter((entry) => entry.status === "error")
        .forEach((entry) => {
          report += `  ${entry.id}: ${entry.error?.message || "Unknown error"}\n`;
        });
    }

    return report;
  }
}

/**
 * 导出单例实例
 */
export const componentPreloader = ComponentPreloader.getInstance();

/**
 * 预定义的组件预加载配置
 */
export const PreloadConfigs = {
  /** 关键路径组件 - 立即预加载 */
  critical: {
    priority: "high" as const,
    delay: 0,
  },

  /** 用户可能访问的组件 - 空闲时预加载 */
  likely: {
    priority: "medium" as const,
    onIdle: true,
    delay: 1000,
  },

  /** 不太可能访问的组件 - 延迟预加载 */
  optional: {
    priority: "low" as const,
    onIdle: true,
    delay: 3000,
  },

  /** 基于交互的预加载 */
  interactive: {
    priority: "medium" as const,
    onInteraction: true,
  },

  /** 基于视口的预加载 */
  viewport: {
    priority: "medium" as const,
    onIntersection: true,
  },
};

/**
 * 便捷的预加载函数
 */
export function preloadComponent(
  id: string,
  importFn: () => Promise<{ default: PreloadableComponent }>,
  config: PreloadConfig = PreloadConfigs.likely
) {
  componentPreloader.register(id, importFn, config);
}

/**
 * 预加载路由组件
 */
export function preloadRouteComponents() {
  // 预加载主要路由组件
  componentPreloader.preloadBatch([
    {
      id: "home-page",
      importFn: () => import("@/components/home").then((m) => ({ default: m.HomePage })),
      config: PreloadConfigs.critical,
    },
    {
      id: "admin-page",
      importFn: () => import("@/components/admin").then((m) => ({ default: m.AdminPage })),
      config: PreloadConfigs.likely,
    },
  ]);
}
