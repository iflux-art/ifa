"use client";

import type React from "react";

// 背景装饰组件的属性类型
interface BackgroundDecorationsProps {
  className?: string;
  style?: React.CSSProperties;
}

/**
 * 主页背景装饰组件
 * 包含网格背景和浮动的光点效果
 */
export const BackgroundDecorations = (_props: BackgroundDecorationsProps) => (
  <>
    {/* 网格背景 */}
    <div className="bg-grid-white/[0.01] dark:bg-grid-white/[0.01] absolute inset-0 bg-[size:50px_50px]" />

    {/* 中心脉冲光晕 */}
    <div className="absolute top-1/4 left-1/2 h-[1000px] w-[1000px] -translate-x-1/2 animate-pulse rounded-full bg-gradient-to-r from-primary/30 via-transparent to-primary/30 dark:from-primary/20 dark:to-primary/20 opacity-30 dark:opacity-20 blur-3xl" />

    {/* 浮动光点 1 */}
    <div
      className="absolute top-20 left-20 h-20 w-20 animate-bounce rounded-full bg-primary/25 dark:bg-primary/10 blur-xl"
      style={{ animationDelay: "0s", animationDuration: "3s" }}
    />

    {/* 浮动光点 2 */}
    <div
      className="absolute top-40 right-32 h-16 w-16 animate-bounce rounded-full bg-purple-500/25 dark:bg-purple-500/10 blur-xl"
      style={{ animationDelay: "1s", animationDuration: "4s" }}
    />

    {/* 浮动光点 3 */}
    <div
      className="absolute bottom-32 left-1/4 h-24 w-24 animate-bounce rounded-full bg-blue-500/25 dark:bg-blue-500/10 blur-xl"
      style={{ animationDelay: "2s", animationDuration: "5s" }}
    />
  </>
);
