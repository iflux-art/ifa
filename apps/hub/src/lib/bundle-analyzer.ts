/**
 * Bundle 分析器
 * 用于分析和监控应用的 bundle 大小和加载性能
 */

// 定义类型
interface ChunkInfo {
  name: string;
  size: number;
  type: string;
}

interface LoadingMetrics {
  fcp?: number;
  lcp?: number;
  fid?: number;
  cls?: number;
}

interface BundleMetrics {
  totalSize: number;
  chunks: ChunkInfo[];
  loadingMetrics: LoadingMetrics;
}

/**
 * Bundle 分析器类
 * 单例模式，用于收集和分析 bundle 信息
 */
class BundleAnalyzer {
  private static instance: BundleAnalyzer;
  private metrics: BundleMetrics;
  private isInitialized = false;

  private constructor() {
    this.metrics = {
      totalSize: 0,
      chunks: [],
      loadingMetrics: {},
    };
  }

  /**
   * 获取单例实例
   */
  static getInstance(): BundleAnalyzer {
    if (!BundleAnalyzer.instance) {
      BundleAnalyzer.instance = new BundleAnalyzer();
    }
    return BundleAnalyzer.instance;
  }

  /**
   * 初始化分析器
   */
  init() {
    if (this.isInitialized) {
      return;
    }
    this.isInitialized = true;

    if (typeof window !== "undefined") {
      // 监控资源加载
      this.monitorResourceLoading();
    }
  }

  /**
   * 监控资源加载
   */
  private monitorResourceLoading() {
    if (typeof window === "undefined") {
      return;
    }

    // 监控所有资源加载
    window.addEventListener("load", () => {
      setTimeout(() => {
        this.collectResourceMetrics();
      }, 1000); // 等待所有资源加载完成
    });
  }

  /**
   * 收集资源指标
   */
  private collectResourceMetrics() {
    if (typeof window === "undefined") {
      return;
    }

    const entries = performance.getEntriesByType("resource");
    let totalSize = 0;

    entries.forEach((entry) => {
      const resourceEntry = entry as PerformanceResourceTiming;
      // 估算资源大小（这只是一个近似值）
      if (resourceEntry.transferSize) {
        totalSize += resourceEntry.transferSize;
      }
    });

    this.metrics.totalSize = totalSize;

    // 收集关键资源信息
    this.collectChunkInfo();
  }

  /**
   * 收集 chunk 信息
   */
  private collectChunkInfo() {
    if (typeof window === "undefined") {
      return;
    }

    const entries = performance.getEntriesByType("resource");
    const chunks: ChunkInfo[] = [];

    entries.forEach((entry) => {
      const resourceEntry = entry as PerformanceResourceTiming;
      const url = resourceEntry.name;

      // 识别关键的 JS 和 CSS 资源
      if (url.includes(".js") || url.includes(".css")) {
        // 简单实现 basename 功能，避免使用 node:path
        const urlParts = url.split("/");
        const name = urlParts[urlParts.length - 1];
        const type = url.includes(".js") ? "JavaScript" : "CSS";
        const size = resourceEntry.transferSize || 0;

        chunks.push({
          name,
          size,
          type,
        });
      }
    });

    this.metrics.chunks = chunks;
  }

  /**
   * 生成报告
   */
  generateReport(): string {
    let report = "=== Bundle Analysis Report ===\n\n";

    // Bundle 大小
    report += `Total Bundle Size: ${(this.metrics.totalSize / 1024).toFixed(2)} KB\n\n`;

    // Chunk 信息
    report += "Chunks:\n";
    this.metrics.chunks
      .sort((a, b) => b.size - a.size)
      .forEach((chunk) => {
        report += `  ${chunk.name} (${chunk.type}): ${(chunk.size / 1024).toFixed(2)} KB\n`;
      });

    // 性能建议
    report += "\nPerformance Recommendations:\n";
    report += this.generateRecommendations();

    return report;
  }

  /**
   * 生成性能建议
   */
  private generateRecommendations(): string {
    const recommendations: string[] = [];

    // Bundle 大小建议
    const totalSizeKB = this.metrics.totalSize / 1024;
    if (totalSizeKB > 500) {
      recommendations.push("  • Consider further code splitting - total bundle size is large");
    }

    // Chunk 大小建议
    const largeChunks = this.metrics.chunks.filter((chunk) => chunk.size > 100 * 1024);
    if (largeChunks.length > 0) {
      recommendations.push(
        `  • Large chunks detected: ${largeChunks.map((c) => c.name).join(", ")}`
      );
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
