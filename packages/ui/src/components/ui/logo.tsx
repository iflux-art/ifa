"use client";

import Link from "next/link";
import type React from "react";
import { cn } from "@/lib/utils";

export interface LogoProps {
  /**
   * Logo 文本内容
   * @default "iFluxArt"
   */
  text?: string;
  /**
   * 点击 Logo 后跳转的链接
   * @default "/"
   */
  href?: string;
  /**
   * 是否在新窗口打开链接
   * @default false
   */
  isExternal?: boolean;
  /**
   * 自定义类名
   */
  className?: string;
  /**
   * ARIA 标签，用于无障碍访问
   */
  ariaLabel?: string;
}

/**
 * 通用 Logo 组件
 * 用于在各个子应用中显示品牌标识
 */
export const Logo: React.FC<LogoProps> = ({
  text = "iFluxArt",
  href = "/",
  isExternal = false,
  className = "",
  ariaLabel,
}) => {
  const defaultAriaLabel = ariaLabel || `${text} - 返回首页`;
  const textClasses =
    "text-lg sm:text-xl md:text-2xl font-bold tracking-wide transition-colors hover:text-primary";

  if (isExternal) {
    return (
      <a
        className={cn("inline-block", className)}
        aria-label={defaultAriaLabel}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
      >
        <h2 className={textClasses}>{text}</h2>
      </a>
    );
  }

  return (
    <Link
      className={cn("inline-block", className)}
      aria-label={defaultAriaLabel}
      href={href}
    >
      <h2 className={textClasses}>{text}</h2>
    </Link>
  );
};
