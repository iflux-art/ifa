/**
 * Bundle 分析工具
 * 用于监控代码分割效果和 bundle 大小优化
 */

interface BundleMetrics {
  /** 总 bundle 大小 */
  totalSize: number;
  /** 各个 chunk 的大小 */
  chunks: Array<{
    name: string;
    size: number;
    type: "main" | "vendor" | "async" | "shared";
  }>;
  /** 加载时间指标 */
  loadingMetrics: {
    /** 首次内容绘制时间 */
    fcp?: number;
    /** 最大内容绘制时间 */
    lcp?: number;
    /** 首次输入延迟 */
    fid?: number;
    /** 累积布局偏移 */
    cls?: number;
  };
}

/**
 * Bundle 分析器类
 */
export class BundleAnalyzer {
  private static instance: BundleAnalyzer;
  private metrics: BundleMetrics = {
    totalSize: 0,
    chunks: [],
    loadingMetrics: {},
  };

  static getInstance(): BundleAnalyzer {
    if (!BundleAnalyzer.instance) {
      BundleAnalyzer.instance = new BundleAnalyzer();
    }
    return BundleAnalyzer.instance;
  }

  /**
   * 初始化性能监控
   */
  init() {
    if (typeof window === "undefined") return;

    // 监控 Web Vitals
    this.measureWebVitals();

    // 监控资源加载
    this.measureResourceLoading();

    // 监控代码分割效果
    this.measureCodeSplitting();
  }

  /**
   * 测量 Web Vitals 指标
   */
  private measureWebVitals() {
    // FCP (First Contentful Paint)
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const fcp = entries.find((entry) => entry.name === "first-contentful-paint");
      if (fcp) {
        this.metrics.loadingMetrics.fcp = fcp.startTime;
        this.reportMetric("FCP", fcp.startTime);
      }
    }).observe({ entryTypes: ["paint"] });

    // LCP (Largest Contentful Paint)
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      this.metrics.loadingMetrics.lcp = lastEntry.startTime;
      this.reportMetric("LCP", lastEntry.startTime);
    }).observe({ entryTypes: ["largest-contentful-paint"] });

    // FID (First Input Delay)
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        const eventEntry = entry as PerformanceEventTiming;
        this.metrics.loadingMetrics.fid = eventEntry.processingStart - eventEntry.startTime;
        this.reportMetric("FID", eventEntry.processingStart - eventEntry.startTime);
      });
    }).observe({ entryTypes: ["first-input"] });

    // CLS (Cumulative Layout Shift)
    let clsValue = 0;
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        const layoutEntry = entry as PerformanceEntry & { value: number; hadRecentInput?: boolean };
        if (!layoutEntry.hadRecentInput) {
          clsValue += layoutEntry.value;
        }
      });
      this.metrics.loadingMetrics.cls = clsValue;
      this.reportMetric("CLS", clsValue);
    }).observe({ entryTypes: ["layout-shift"] });
  }

  /**
   * 测量资源加载性能
   */
  private measureResourceLoading() {
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        const resourceEntry = entry as PerformanceResourceTiming;
        if (resourceEntry.initiatorType === "script") {
          const chunkName = this.extractChunkName(resourceEntry.name);
          const size = resourceEntry.transferSize || resourceEntry.encodedBodySize || 0;

          this.addChunkMetric({
            name: chunkName,
            size,
            type: this.determineChunkType(chunkName),
          });
        }
      });
    }).observe({ entryTypes: ["resource"] });
  }

  /**
   * 测量代码分割效果
   */
  private measureCodeSplitting() {
    // 监控动态导入
    const originalImport =
      (window as Window & { import?: (specifier: string) => Promise<unknown> }).import ||
      (() => Promise.resolve());

    (window as unknown as Window & { import: (specifier: string) => Promise<unknown> }).import =
      async (specifier: string) => {
        const startTime = performance.now();

        try {
          const result = await originalImport(specifier);
          const loadTime = performance.now() - startTime;

          this.reportMetric("Dynamic Import", loadTime, {
            specifier,
            success: true,
          });

          return result;
        } catch (error) {
          const loadTime = performance.now() - startTime;

          this.reportMetric("Dynamic Import", loadTime, {
            specifier,
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
          });

          throw error;
        }
      };
  }

  /**
   * 添加 chunk 指标
   */
  private addChunkMetric(chunk: BundleMetrics["chunks"][0]) {
    const existingIndex = this.metrics.chunks.findIndex((c) => c.name === chunk.name);

    if (existingIndex >= 0) {
      this.metrics.chunks[existingIndex] = chunk;
    } else {
      this.metrics.chunks.push(chunk);
    }

    this.metrics.totalSize = this.metrics.chunks.reduce((sum, c) => sum + c.size, 0);
  }

  /**
   * 提取 chunk 名称
   */
  private extractChunkName(url: string): string {
    const match = url.match(/\/([^/]+)\.js$/);
    return match ? match[1] : "unknown";
  }

  /**
   * 确定 chunk 类型
   */
  private determineChunkType(chunkName: string): BundleMetrics["chunks"][0]["type"] {
    if (chunkName.includes("vendor") || chunkName.includes("node_modules")) {
      return "vendor";
    }
    if (chunkName.includes("main") || chunkName.includes("index")) {
      return "main";
    }
    if (chunkName.includes("shared") || chunkName.includes("common")) {
      return "shared";
    }
    return "async";
  }

  /**
   * 报告指标
   */
  private reportMetric(name: string, value: number, metadata?: Record<string, unknown>) {
    if (process.env.NODE_ENV === "development") {
      console.log(`[Bundle Analyzer] ${name}:`, {
        value: `${value.toFixed(2)}${name.includes("Size") ? " bytes" : "ms"}`,
        ...metadata,
      });
    }

    // 在生产环境中，可以发送到分析服务
    if (process.env.NODE_ENV === "production" && typeof window !== "undefined") {
      // 示例：发送到 Google Analytics 或其他分析服务
      // gtag('event', 'performance_metric', {
      //   metric_name: name,
      //   metric_value: value,
      //   ...metadata
      // });
    }
  }

  /**
   * 获取当前指标
   */
  getMetrics(): BundleMetrics {
    return { ...this.metrics };
  }

  /**
   * 生成性能报告
   */
  generateReport(): string {
    const metrics = this.getMetrics();

    let report = "=== Bundle Analysis Report ===\n\n";

    // 总体指标
    report += `Total Bundle Size: ${(metrics.totalSize / 1024).toFixed(2)} KB\n`;
    report += `Number of Chunks: ${metrics.chunks.length}\n\n`;

    // Chunk 详情
    report += "Chunk Details:\n";
    metrics.chunks
      .sort((a, b) => b.size - a.size)
      .forEach((chunk) => {
        report += `  ${chunk.name} (${chunk.type}): ${(chunk.size / 1024).toFixed(2)} KB\n`;
      });

    // Web Vitals
    report += "\nWeb Vitals:\n";
    if (metrics.loadingMetrics.fcp) {
      report += `  FCP: ${metrics.loadingMetrics.fcp.toFixed(2)}ms\n`;
    }
    if (metrics.loadingMetrics.lcp) {
      report += `  LCP: ${metrics.loadingMetrics.lcp.toFixed(2)}ms\n`;
    }
    if (metrics.loadingMetrics.fid) {
      report += `  FID: ${metrics.loadingMetrics.fid.toFixed(2)}ms\n`;
    }
    if (metrics.loadingMetrics.cls) {
      report += `  CLS: ${metrics.loadingMetrics.cls.toFixed(4)}\n`;
    }

    // 性能建议
    report += "\nPerformance Recommendations:\n";
    report += this.generateRecommendations(metrics);

    return report;
  }

  /**
   * 生成性能建议
   */
  private generateRecommendations(metrics: BundleMetrics): string {
    const recommendations: string[] = [];

    // Bundle 大小建议
    const totalSizeKB = metrics.totalSize / 1024;
    if (totalSizeKB > 500) {
      recommendations.push("  • Consider further code splitting - total bundle size is large");
    }

    // Chunk 大小建议
    const largeChunks = metrics.chunks.filter((chunk) => chunk.size > 100 * 1024);
    if (largeChunks.length > 0) {
      recommendations.push(
        `  • Large chunks detected: ${largeChunks.map((c) => c.name).join(", ")}`
      );
    }

    // Web Vitals 建议
    if (metrics.loadingMetrics.lcp && metrics.loadingMetrics.lcp > 2500) {
      recommendations.push("  • LCP is slow - consider optimizing critical resources");
    }

    if (metrics.loadingMetrics.fid && metrics.loadingMetrics.fid > 100) {
      recommendations.push("  • FID is high - consider reducing JavaScript execution time");
    }

    if (metrics.loadingMetrics.cls && metrics.loadingMetrics.cls > 0.1) {
      recommendations.push("  • CLS is high - check for layout shifts");
    }

    return recommendations.length > 0 ? recommendations.join("\n") : "  • Performance looks good!";
  }

  /**
   * 重置指标
   */
  reset() {
    this.metrics = {
      totalSize: 0,
      chunks: [],
      loadingMetrics: {},
    };
  }
}

/**
 * 导出单例实例
 */
export const bundleAnalyzer = BundleAnalyzer.getInstance();

/**
 * 初始化 Bundle 分析器（在应用启动时调用）
 */
export function initBundleAnalyzer() {
  if (typeof window !== "undefined") {
    bundleAnalyzer.init();

    // 在开发环境中，5秒后输出报告
    if (process.env.NODE_ENV === "development") {
      setTimeout(() => {
        console.log(bundleAnalyzer.generateReport());
      }, 5000);
    }
  }
}
