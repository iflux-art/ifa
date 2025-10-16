/**
 * 带回退的图片组件
 * 统一处理图片加载失败的回退逻辑
 */

"use client";

import Image from "next/image";
import { useCallback, useMemo } from "react";

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  fallbackText: string;
  className?: string;
  width?: number;
  height?: number;
}

export const ImageWithFallback = ({
  src,
  alt,
  fallbackText,
  className = "h-10 w-10 flex-shrink-0 overflow-hidden rounded-full",
  width = 40,
  height = 40,
}: ImageWithFallbackProps) => {
  // 使用 useMemo 优化首字符计算
  const firstChar = useMemo(() => fallbackText.charAt(0), [fallbackText]);

  // 使用 useCallback 优化图片错误处理
  const handleImageError = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      const parent = e.currentTarget.parentElement;
      if (parent) {
        parent.innerHTML = `<div class="w-full h-full flex items-center justify-center"><span class="text-lg font-medium text-primary">${firstChar}</span></div>`;
      }
    },
    [firstChar]
  );

  return (
    <div className={className}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="object-cover"
        unoptimized
        loading="lazy"
        onError={handleImageError}
      />
    </div>
  );
};
