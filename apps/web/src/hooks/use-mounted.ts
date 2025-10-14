import { useEffect, useState } from "react";

/**
 * 组件挂载状态 Hook
 * 用于避免 SSR 和客户端渲染不一致的问题
 * @returns 是否已挂载
 */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
}
