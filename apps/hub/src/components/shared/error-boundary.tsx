"use client";

/**
 * 功能模块错误边界组件
 * 提供组件级别的错误处理和恢复机制
 */

import { Component } from "react";
import type { ErrorBoundaryProps, ErrorBoundaryState } from "./types";

export class FeatureErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Feature error:", error, errorInfo);

    // 可以在这里添加错误报告逻辑
    if (typeof window !== "undefined") {
      // 客户端错误追踪
      console.error("Client-side error in feature component:", {
        error: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
      });
    }
  }

  override render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex items-center justify-center p-8 text-center">
            <div className="max-w-md">
              <h2 className="mb-2 font-semibold text-destructive text-lg">功能加载失败</h2>
              <p className="mb-4 text-muted-foreground text-sm">
                抱歉，此功能遇到了问题。请刷新页面重试。
              </p>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="rounded-md bg-primary px-4 py-2 text-primary-foreground transition-colors hover:bg-primary/90"
              >
                刷新页面
              </button>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
