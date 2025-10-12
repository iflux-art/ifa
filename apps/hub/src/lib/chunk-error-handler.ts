import { handleChunkLoadError } from "@/components/links/links-lib";

/**
 * 全局chunk加载错误处理器
 */
export function setupGlobalChunkErrorHandler(): void {
  if (typeof window === "undefined") return;

  // 处理未捕获的Promise rejection（通常是动态导入失败）
  window.addEventListener("unhandledrejection", (event) => {
    const error = event.reason;

    if (error instanceof Error) {
      const isChunkLoadError =
        error.message.includes("ChunkLoadError") ||
        error.message.includes("Loading chunk") ||
        error.message.includes("Failed to fetch") ||
        error.name === "ChunkLoadError";

      if (isChunkLoadError) {
        console.warn("Global chunk load error detected:", error);
        event.preventDefault(); // 阻止默认的错误处理
        handleChunkLoadError();
      }
    }
  });

  // 处理一般的JavaScript错误
  window.addEventListener("error", (event) => {
    const error = event.error;

    if (error instanceof Error) {
      const isChunkLoadError =
        error.message.includes("ChunkLoadError") ||
        error.message.includes("Loading chunk") ||
        error.message.includes("Failed to fetch") ||
        error.name === "ChunkLoadError";

      if (isChunkLoadError) {
        console.warn("Global chunk load error detected:", error);
        event.preventDefault(); // 阻止默认的错误处理
        handleChunkLoadError();
      }
    }
  });
}
