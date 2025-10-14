/**
 * 链接卡片组件
 * 通用链接卡片组件，可用于友链、导航链接等场景
 * 样式与 LinkCard 保持一致
 */

"use client";

import { ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type React from "react";
import { forwardRef, useCallback, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { LinkCardProps } from "@/types";

/**
 * 链接卡片组件
 * 通用链接卡片组件，可用于友链、导航链接等场景
 */
export const LinkCard = forwardRef<HTMLAnchorElement, LinkCardProps>(
  ({ title, description, href, isExternal = true, icon, color, className, children }, ref) => {
    // 添加状态跟踪hover
    const [isHovered, setIsHovered] = useState(false);

    // 使用 useMemo 优化首字符计算
    const firstChar = useMemo(() => title.charAt(0), [title]);

    // 使用 useCallback 优化事件处理函数
    const handleMouseEnter = useCallback(() => setIsHovered(true), []);
    const handleMouseLeave = useCallback(() => setIsHovered(false), []);

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

    // 使用 useMemo 优化图标渲染逻辑
    const renderIcon = useMemo(() => {
      // 如果没有icon，直接返回标题首个字符
      if (!icon) {
        return (
          <div className="flex h-full w-full items-center justify-center">
            <span className="font-medium text-lg text-primary">{firstChar}</span>
          </div>
        );
      }

      // 如果是React元素，直接渲染
      if (typeof icon !== "string") {
        return icon;
      }

      // 尝试显示图片
      return (
        <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full">
          <Image
            src={icon}
            alt={title}
            width={40}
            height={40}
            className="object-cover"
            unoptimized
            loading="lazy"
            onError={handleImageError}
          />
        </div>
      );
    }, [icon, firstChar, title, handleImageError]);

    // 使用 useMemo 优化样式处理逻辑
    const cardStyle = useMemo(() => {
      return color?.startsWith("#")
        ? {
            background: `linear-gradient(to bottom right, ${color}10, ${color}30)`,
          }
        : {};
    }, [color]);

    const cardContent = (
      <Card
        className={cn(
          "group relative transition-all duration-300 hover:scale-[1.01] hover:border-primary/50",
          className
        )}
        style={cardStyle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <CardContent className="flex h-full items-center p-4">
          <div className="mr-4 flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted">
            {renderIcon}
          </div>
          <div className="flex min-w-0 flex-1 flex-col">
            <div className="mb-1 flex items-center gap-2">
              <h3 className="truncate font-semibold text-lg">{title}</h3>
              {isExternal && <ExternalLink className="h-4 w-4 text-muted-foreground" />}
            </div>
            {description && (
              <p className="truncate text-muted-foreground text-sm" title={description}>
                {description}
              </p>
            )}
            {children && <div className="mt-2">{children}</div>}
          </div>
        </CardContent>

        {/* Hover状态描述tooltip */}
        {description && isHovered && (
          <div
            className="-translate-x-1/2 absolute bottom-full left-1/2 mb-2 w-64 transform rounded-md border bg-background p-3 shadow-lg"
            style={{ zIndex: 1000 }}
          >
            <p className="text-foreground text-sm">{description}</p>
            <div className="-translate-x-1/2 absolute bottom-0 left-1/2 h-2 w-2 translate-y-1 rotate-45 border-r border-b bg-background"></div>
          </div>
        )}
      </Card>
    );

    const commonProps = {
      ref,
      className: "block",
      href,
    };

    if (isExternal) {
      return (
        <a {...commonProps} target="_blank" rel="noopener noreferrer">
          {cardContent}
        </a>
      );
    }

    return <Link {...commonProps}>{cardContent}</Link>;
  }
);

LinkCard.displayName = "LinkCard";
