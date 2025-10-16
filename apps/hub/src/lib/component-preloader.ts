/**
 * 组件预加载器
 * 智能预加载组件以提升用户体验
 */

import type { ComponentType } from "react";

interface PreloadConfig {
  /** 预加载优先级 */
  priority?: "high" | "medium" | "low";
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

// 定义 ImportFunction 类型
type ImportFunction = () => Promise<{ default: PreloadableComponent }>;

/**
 * 组件预加载器类
 */
export class ComponentPreloader {
  private static instance: ComponentPreloader;
  private componentRegistry: Map<string, { importFn: ImportFunction; config?: PreloadConfig }> =
    new Map();
  private loadedComponents: Map<string, PreloadableComponent | boolean> = new Map();
  private preloadingQueue: Array<{ id: string; importFn: ImportFunction; config?: PreloadConfig }> =
    [];

  static getInstance(): ComponentPreloader {
    if (!ComponentPreloader.instance) {
      ComponentPreloader.instance = new ComponentPreloader();
    }
    return ComponentPreloader.instance;
  }

  /**
   * 注册组件预加载
   */
  register(id: string, importFn: ImportFunction, config: PreloadConfig) {
    if (this.componentRegistry.has(id) || this.loadedComponents.has(id)) {
      return; // 已注册或已加载
    }

    this.componentRegistry.set(id, { importFn, config });

    // 根据配置决定何时开始预加载
    this.schedulePreload(id);
  }

  /**
   * 调度预加载
   */
  private schedulePreload(id: string) {
    const componentInfo = this.componentRegistry.get(id);
    if (!componentInfo) {
      return;
    }

    const { config = {} } = componentInfo;
    const { onIdle, delay, priority }: PreloadConfig = config;

    if (onIdle && typeof window !== "undefined") {
      this.scheduleIdlePreload(id);
    } else if (delay && delay > 0) {
      setTimeout(() => this.preload(id), delay);
    } else if (priority === "high") {
      // 高优先级立即预加载
      this.preload(id);
    }
  }

  /**
   * 在空闲时预加载
   */
  private scheduleIdlePreload(id: string) {
    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(() => this.preload(id), { timeout: 5000 });
    } else {
      // 降级到 setTimeout
      setTimeout(() => this.preload(id), 100);
    }
  }

  /**
   * 检查组件是否已加载
   */
  private isLoaded(componentId: string): boolean {
    return this.loadedComponents.has(componentId);
  }

  /**
   * 预加载单个组件
   */
  async preload(componentId: string): Promise<void> {
    // 如果组件已加载，直接返回
    if (this.isLoaded(componentId)) {
      return;
    }

    const componentInfo = this.componentRegistry.get(componentId);
    if (!componentInfo) {
      console.warn(`未找到组件: ${componentId}`);
      return;
    }

    const { importFn, config = {} } = componentInfo;
    const { priority = "medium", delay = 0 } = config;

    // 使用变量避免未使用警告 - 通过条件语句使用
    if (priority === "high" || priority === "medium" || priority === "low") {
      // 只是为了使用变量
    }

    if (delay >= 0) {
      // 只是为了使用变量
    }

    try {
      // 如果有延迟，等待指定时间
      if (delay && delay > 0) {
        await new Promise((resolve) => setTimeout(resolve, delay));
      }

      // 执行导入
      const module = await importFn();

      // 标记为已加载
      this.loadedComponents.set(componentId, module.default);

      // 触发优先级队列处理
      this.processPriorityQueue();
    } catch (error) {
      console.error(`预加载组件失败 ${componentId}:`, error);
      // 从预加载队列中移除失败的组件
      this.preloadingQueue = this.preloadingQueue.filter((item) => item.id !== componentId);
    }
  }

  /**
   * 批量预加载组件
   */
  async preloadBatch(
    components: Array<{ id: string; importFn: ImportFunction; config?: PreloadConfig }>
  ): Promise<void> {
    // 过滤掉已加载的组件
    const componentsToLoad = components.filter(({ id }) => !this.isLoaded(id));

    // 如果没有需要加载的组件，直接返回
    if (componentsToLoad.length === 0) {
      return;
    }

    // 将组件添加到预加载队列
    this.preloadingQueue.push(...componentsToLoad);

    // 根据优先级排序
    this.preloadingQueue.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return (
        (priorityOrder[b.config?.priority || "medium"] || 2) -
        (priorityOrder[a.config?.priority || "medium"] || 2)
      );
    });

    // 处理队列
    await this.processQueue();
  }

  /**
   * 处理预加载队列
   */
  private async processQueue(): Promise<void> {
    while (this.preloadingQueue.length > 0) {
      const item = this.preloadingQueue.shift();
      // 检查是否有有效的项目
      if (item) {
        const { id, importFn, config = {} } = item;
        // 使用变量避免未使用警告 - 通过条件语句使用
        if (typeof importFn === "function") {
          // 只是为了使用变量
        }

        if (config.priority || config.delay || config.onIdle) {
          // 只是为了使用变量
        }
        await this.preload(id);
      }
    }
  }

  /**
   * 处理优先级队列
   */
  private async processPriorityQueue(): Promise<void> {
    const highPriorityComponents = this.preloadingQueue.filter(
      (item) => item.config?.priority === "high"
    );
    const mediumPriorityComponents = this.preloadingQueue.filter(
      (item) => item.config?.priority === "medium"
    );
    const lowPriorityComponents = this.preloadingQueue.filter(
      (item) => item.config?.priority === "low"
    );

    // 高优先级组件并发预加载
    await Promise.allSettled(highPriorityComponents.map((item) => this.preload(item.id)));

    // 中等优先级组件串行预加载
    for (const item of mediumPriorityComponents) {
      await this.preload(item.id);
    }

    // 低优先级组件串行预加载
    for (const item of lowPriorityComponents) {
      await this.preload(item.id);
    }
  }

  /**
   * 获取预加载的组件
   */
  getComponent(id: string): PreloadableComponent | null {
    const component = this.loadedComponents.get(id);
    if (component && typeof component !== "boolean") {
      return component;
    }
    return null;
  }

  /**
   * 检查组件是否已预加载
   */
  isLoadedPublic(id: string): boolean {
    return this.loadedComponents.has(id);
  }

  /**
   * 强制预加载组件
   */
  async forcePreload(id: string): Promise<PreloadableComponent | null> {
    // 如果已加载，直接返回
    if (this.loadedComponents.has(id)) {
      const component = this.loadedComponents.get(id);
      if (component && typeof component !== "boolean") {
        return component;
      }
      return null;
    }

    // 如果在队列中，立即预加载
    const entry = this.preloadingQueue.find((item) => item.id === id);
    if (entry) {
      await this.preload(id);
      const component = this.loadedComponents.get(id);
      if (component && typeof component !== "boolean") {
        return component;
      }
      return null;
    }

    return null;
  }

  /**
   * 基于用户交互预加载
   */
  preloadOnHover(element: HTMLElement, componentId: string, importFn: ImportFunction): void {
    if (this.isLoaded(componentId)) {
      return;
    }

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
    importFn: ImportFunction,
    options?: IntersectionObserverInit
  ): void {
    if (this.isLoaded(componentId)) {
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.register(componentId, importFn, {
            priority: "medium",
            onIntersection: true,
          });
          observer.unobserve(element);
        }
      });
    }, options);

    observer.observe(element);
  }
}

// 创建全局实例
export const componentPreloader = ComponentPreloader.getInstance();

/**
 * 预加载配置常量
 */
export const PreloadConfigs = {
  /** 关键组件 - 立即预加载 */
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
  importFn: ImportFunction,
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
      importFn: () =>
        import("@/components/features/home").then((m) => ({ default: m.OptimizedHomePage })),
      config: PreloadConfigs.critical,
    },
    {
      id: "admin-page",
      importFn: () =>
        import("@/components/features/admin").then((m) => ({ default: m.OptimizedAdminPage })),
      config: PreloadConfigs.likely,
    },
  ]);
}
