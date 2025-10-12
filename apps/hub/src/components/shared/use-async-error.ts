"use client";

/**
 * 异步错误处理 Hook
 * 统一处理异步操作的错误和加载状态
 */

import { useCallback, useState } from "react";
import type { AsyncErrorState } from "./types";

export const useAsyncError = () => {
  const [state, setState] = useState<AsyncErrorState>({
    error: null,
    loading: false,
  });

  const execute = useCallback(async <T>(asyncFn: () => Promise<T>): Promise<T | null> => {
    try {
      setState({ error: null, loading: true });
      const result = await asyncFn();
      setState({ error: null, loading: false });
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Unknown error");
      setState({ error, loading: false });

      // 记录错误日志
      console.error("Async operation failed:", error);

      return null;
    }
  }, []);

  const reset = useCallback(() => {
    setState({ error: null, loading: false });
  }, []);

  return {
    error: state.error,
    loading: state.loading,
    execute,
    reset,
  };
};
