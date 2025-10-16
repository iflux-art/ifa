import { useCallback, useEffect, useState } from "react";

/**
 * 响应式断点检测 Hook
 * 检测当前屏幕是否在移动端断点范围内
 * @param breakpoint 断点值，默认为 768px (md 断点)
 * @returns 是否为移动端
 */
export function useBreakpoint(breakpoint = 768): boolean {
  const [isMobile, setIsMobile] = useState(false);

  const checkBreakpoint = useCallback(() => {
    setIsMobile(window.innerWidth < breakpoint);
  }, [breakpoint]);

  useEffect(() => {
    // 初始检查
    checkBreakpoint();

    // 添加窗口大小变化监听器
    window.addEventListener("resize", checkBreakpoint, { passive: true });

    // 清理事件监听器
    return () => {
      window.removeEventListener("resize", checkBreakpoint);
    };
  }, [checkBreakpoint]);

  return isMobile;
}

/**
 * 媒体查询检测 Hook
 * 使用原生 matchMedia API 进行更精确的断点检测
 * @param query 媒体查询字符串
 * @returns 是否匹配媒体查询
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);

    // 初始检查
    setMatches(mediaQuery.matches);

    // 监听媒体查询变化
    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    mediaQuery.addEventListener("change", handleChange);

    // 清理监听器
    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, [query]);

  return matches;
}

/**
 * 移动端检测 Hook
 * 专门用于检测是否为移动端 (< 768px)
 * @returns 是否为移动端
 */
export function useIsMobile(): boolean {
  return useMediaQuery("(max-width: 767px)");
}

/**
 * 桌面端检测 Hook
 * 专门用于检测是否为桌面端 (>= 768px)
 * @returns 是否为桌面端
 */
export function useIsDesktop(): boolean {
  return useMediaQuery("(min-width: 768px)");
}
