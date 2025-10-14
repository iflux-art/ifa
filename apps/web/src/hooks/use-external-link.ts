import { useCallback } from "react";

/**
 * 外部链接处理 Hook
 * @param url 外部链接 URL
 * @param options 打开选项
 * @returns 打开外部链接的函数
 */
export function useExternalLink(
  url: string,
  options: {
    target?: string;
    features?: string;
  } = {}
) {
  const { target = "_blank", features = "noopener,noreferrer" } = options;

  return useCallback(() => {
    window.open(url, target, features);
  }, [url, target, features]);
}

/**
 * 安全的外部链接处理 Hook
 * 包含错误处理和回退机制
 * @param url 外部链接 URL
 * @param fallback 回退函数
 * @returns 打开外部链接的函数
 */
export function useSafeExternalLink(url: string, fallback?: () => void) {
  return useCallback(() => {
    try {
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (error) {
      console.error("Failed to open external link:", error);
      if (fallback) {
        fallback();
      } else {
        // 回退到直接导航
        window.location.href = url;
      }
    }
  }, [url, fallback]);
}
