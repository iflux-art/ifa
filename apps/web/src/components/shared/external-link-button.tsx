"use client";

import { memo } from "react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSafeExternalLink } from "@/hooks";

/**
 * 外部链接按钮基础组件
 * 统一处理外部链接按钮的通用逻辑，减少代码重复
 */
interface ExternalLinkButtonProps {
  /** 链接地址 */
  url: string;
  /** 按钮标题 */
  title: string;
  /** 图标组件 */
  icon: LucideIcon;
  /** 可选的自定义类名 */
  className?: string;
}

export const ExternalLinkButton = memo<ExternalLinkButtonProps>(
  ({ url, title, icon: Icon, className }) => {
    const handleClick = useSafeExternalLink(url);

    return (
      <Button
        variant="ghost"
        size="icon"
        className={className || "h-9 w-9"}
        title={title}
        onClick={handleClick}
        aria-label={title}
      >
        <Icon className="h-4 w-4" />
        <span className="sr-only">{title}</span>
      </Button>
    );
  }
);

ExternalLinkButton.displayName = "ExternalLinkButton";
