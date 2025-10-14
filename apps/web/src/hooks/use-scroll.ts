import { useCallback, useEffect, useState } from "react";

/**
 * 滚动检测 Hook
 * @param threshold 滚动阈值，默认为 0
 * @returns 是否已滚动
 */
export function useScroll(threshold = 0): boolean {
  const [isScrolled, setIsScrolled] = useState(false);

  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > threshold);
  }, [threshold]);

  useEffect(() => {
    // 初始检查
    handleScroll();

    // 添加滚动事件监听器
    window.addEventListener("scroll", handleScroll, { passive: true });

    // 清理事件监听器
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  return isScrolled;
}

/**
 * 滚动到顶部 Hook
 * @returns 滚动到顶部的函数
 */
export function useScrollToTop() {
  return useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);
}

/**
 * 滚动方向检测 Hook
 * @returns 滚动方向和位置信息
 */
export function useScrollDirection() {
  const [scrollDirection, setScrollDirection] = useState<"up" | "down" | null>(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const updateScrollDirection = () => {
      const currentScrollY = window.scrollY;
      const direction = currentScrollY > lastScrollY ? "down" : "up";

      if (
        direction !== scrollDirection &&
        (currentScrollY - lastScrollY > 10 || currentScrollY - lastScrollY < -10)
      ) {
        setScrollDirection(direction);
      }

      setScrollY(currentScrollY);
      lastScrollY = currentScrollY > 0 ? currentScrollY : 0;
    };

    window.addEventListener("scroll", updateScrollDirection, { passive: true });

    return () => {
      window.removeEventListener("scroll", updateScrollDirection);
    };
  }, [scrollDirection]);

  return { scrollDirection, scrollY };
}
