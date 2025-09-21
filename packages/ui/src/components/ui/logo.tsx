"use client";

import Link from "next/link";
import type React from "react";

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
  // 默认 ARIA 标签
  const defaultAriaLabel = ariaLabel || `${text} - 返回首页`;
  
  // 根据是否外部链接决定使用哪种标签
  if (isExternal) {
    return (
      <a
        href={href}
        className={`inline-block ${className}`}
        aria-label={defaultAriaLabel}
        target="_blank"
        rel="noopener noreferrer"
      >
        <h2 className="sm:text-xl text-lg font-bold tracking-wide transition-colors hover:text-primary md:text-2xl">
          {text}
        </h2>
      </a>
    );
  }

  return (
    <Link
      href={href}
      className={`inline-block ${className}`}
      aria-label={defaultAriaLabel}
    >
      <h2 className="sm:text-xl text-lg font-bold tracking-wide transition-colors hover:text-primary md:text-2xl">
        {text}
      </h2>
    </Link>
  );
};