"use client";

import { useEffect } from "react";
import { setupCacheUtils } from "@/lib/cache-utils";
import { setupGlobalChunkErrorHandler } from "@/lib/chunk-error-handler";

export function GlobalErrorHandler() {
  useEffect(() => {
    setupGlobalChunkErrorHandler();
    setupCacheUtils();
  }, []);

  return null; // 这个组件不渲染任何内容
}
