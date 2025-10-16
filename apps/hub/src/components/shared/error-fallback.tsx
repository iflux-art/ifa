"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";

/**
 * 统一的错误边界组件
 * 合并了功能错误边界和通用错误处理逻辑
 */
interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  errorType?: "feature" | "admin" | "general";
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class FeatureErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("错误边界捕获到错误:", error, errorInfo);
  }

  override render() {
    if (this.state.hasError) {
      return this.props.fallback || <ErrorFallback errorType={this.props.errorType} />;
    }

    return this.props.children;
  }
}

/**
 * 统一的错误回退组件
 * 根据错误类型显示不同的错误信息
 */
export function ErrorFallback({
  title,
  message,
  errorType = "general",
}: {
  title?: string;
  message?: string;
  errorType?: "feature" | "admin" | "general";
}) {
  const errorConfig = {
    feature: {
      title: title || "功能加载失败",
      message: message || "请刷新页面重试",
      className: "flex min-h-screen items-center justify-center",
    },
    admin: {
      title: title || "管理页面加载失败",
      message: message || "请检查网络连接或刷新页面重试",
      className: "flex items-center justify-center p-8",
    },
    general: {
      title: title || "页面加载失败",
      message: message || "请刷新页面重试",
      className: "flex min-h-screen items-center justify-center",
    },
  };

  const config = errorConfig[errorType];

  return (
    <div className={config.className}>
      <div className="text-center">
        <h1 className="mb-2 font-semibold text-xl">{config.title}</h1>
        <p className="mb-4 text-muted-foreground">{config.message}</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="rounded-md bg-primary px-4 py-2 text-primary-foreground transition-colors hover:bg-primary/90"
        >
          刷新页面
        </button>
      </div>
    </div>
  );
}

/**
 * 管理页面错误回退组件 - 保持向后兼容
 */
export function AdminErrorFallback() {
  return <ErrorFallback errorType="admin" />;
}
