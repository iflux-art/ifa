/**
 * 共享工具模块的类型定义
 */

export interface PerformanceMeasure {
  name: string;
  start: () => void;
  end: () => number;
}

export interface AsyncErrorState {
  error: Error | null;
  loading: boolean;
}

export interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

// Performance API 扩展类型
export interface LayoutShift extends PerformanceEntry {
  value: number;
  hadRecentInput: boolean;
}

export interface PerformanceEventTiming extends PerformanceEntry {
  processingStart: number;
}
