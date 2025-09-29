"use client";

import { useEffect, useState } from "react";

/**
 * 全局加载状态组件
 * 显示进度条加载状态
 */
export const Loading = () => {
  const [progress, setProgress] = useState(0);
  const [opacity, setOpacity] = useState(0.8);

  useEffect(() => {
    // 进度条动画
    const initialProgress = setTimeout(() => {
      setProgress(30);
    }, 100);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        const increment = Math.max(0.5, (100 - prev) / 15);
        return Math.min(90, prev + increment);
      });
    }, 300);

    const opacityInterval = setInterval(() => {
      setOpacity((prev) => (prev === 0.8 ? 1 : 0.8));
    }, 800);

    // 添加一个明显的视觉提示，方便调试
    console.log("Loading component mounted");

    return () => {
      clearTimeout(initialProgress);
      clearInterval(progressInterval);
      clearInterval(opacityInterval);
      console.log("Loading component unmounted");
    };
  }, []);

  // 显示进度条
  return (
    <div className="fixed inset-0 z-[9999] bg-background flex items-center justify-center">
      <output className="sr-only" aria-label="加载页面">
        正在加载页面内容
      </output>
      {/* 添加一个明显的加载指示器 */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-2xl font-bold text-primary">加载中...</div>
      </div>
      <div className="absolute top-16 left-0 right-0 h-1 z-50">
        <div
          className="h-full w-full overflow-hidden bg-gray-200 dark:bg-gray-800"
          role="progressbar"
          aria-label="进度条"
        >
          <div
            className="h-full bg-primary dark:bg-primary"
            style={{
              width: `${progress}%`,
              opacity,
              transition: "width 300ms ease-out",
              transform: "translateZ(0)",
              boxShadow:
                "0 0 12px color-mix(in srgb, var(--color-primary) 70%, transparent)",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Loading;
