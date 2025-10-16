"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";
import { handleChunkLoadError } from "@/components/features/links/links-lib";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ChunkLoadErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // 检查是否是chunk加载错误
    const isChunkLoadError =
      error.message.includes("ChunkLoadError") ||
      error.message.includes("Loading chunk") ||
      error.message.includes("Failed to fetch");

    if (isChunkLoadError) {
      console.warn("检测到Chunk加载错误:", error);
      handleChunkLoadError();
    }

    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("错误边界捕获到错误:", error, errorInfo);
  }

  override render() {
    if (this.state.hasError) {
      const isChunkLoadError =
        this.state.error?.message.includes("ChunkLoadError") ||
        this.state.error?.message.includes("Loading chunk") ||
        this.state.error?.message.includes("Failed to fetch");

      if (isChunkLoadError) {
        return (
          <div className="flex min-h-screen items-center justify-center">
            <div className="text-center">
              <h2 className="mb-2 font-semibold text-xl">加载中...</h2>
              <p className="text-gray-600">正在重新加载资源，请稍候...</p>
            </div>
          </div>
        );
      }

      return (
        this.props.fallback || (
          <div className="flex min-h-screen items-center justify-center">
            <div className="text-center">
              <h2 className="mb-2 font-semibold text-xl">出现了一些问题</h2>
              <p className="text-gray-600">请刷新页面重试</p>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
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
