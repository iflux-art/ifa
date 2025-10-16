/**
 * 链接卡片组件
 * 通用链接卡片组件，可用于友链、导航链接等场景
 */

"use client";

import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { forwardRef, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ImageWithFallback, HoverTooltip } from "@/components/shared";
import { cn } from "@/lib/utils";

import type { LinkCardProps } from "@/types";

/**
 * 链接卡片组件
 * 通用链接卡片组件，可用于友链、导航链接等场景
 */
export const LinkCard = forwardRef<HTMLAnchorElement, LinkCardProps>(
  ({ title, description, href, isExternal = true, icon, color, className, children }, ref) => {
    // 使用 useMemo 优化首字符计算
    const firstChar = useMemo(() => title.charAt(0), [title]);

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

      // 使用统一的图片组件
      return <ImageWithFallback src={icon} alt={title} fallbackText={title} />;
    }, [icon, firstChar, title]);

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
          "group relative hover:scale-[1.01] hover:border-primary/50",
          "transition-all duration-300",
          className
        )}
        style={cardStyle}
      >
        <CardContent className="flex h-full items-center p-4">
          <div className="mr-4 flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted">
            {renderIcon}
          </div>
          <div className="flex min-w-0 flex-1 flex-col">
            <div className="mb-1 flex items-center gap-2">
              <h3 className="truncate font-semibold text-lg">{title}</h3>
              {isExternal && <ExternalLink className={cn("h-4 w-4", "text-muted-foreground")} />}
            </div>
            {description && (
              <p className="truncate text-muted-foreground text-sm" title={description}>
                {description}
              </p>
            )}
            {children && <div className="mt-2">{children}</div>}
          </div>
        </CardContent>
      </Card>
    );

    const commonProps = {
      ref,
      className: "block",
      href,
    };

    // 如果有描述，包装在 HoverTooltip 中
    const wrappedContent = description ? (
      <HoverTooltip content={description}>{cardContent}</HoverTooltip>
    ) : (
      cardContent
    );

    if (isExternal) {
      return (
        <a {...commonProps} target="_blank" rel="noopener noreferrer">
          {wrappedContent}
        </a>
      );
    }

    return <Link {...commonProps}>{wrappedContent}</Link>;
  }
);

LinkCard.displayName = "LinkCard";
