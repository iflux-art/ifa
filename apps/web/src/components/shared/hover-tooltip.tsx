/**
 * 悬停提示组件
 * 统一的悬停提示实现，减少重复代码
 */

"use client";

import { useState, useCallback } from "react";

interface HoverTooltipProps {
  content: string;
  children: React.ReactNode;
  className?: string;
}

export const HoverTooltip = ({ content, children, className = "w-64" }: HoverTooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);

  const handleMouseEnter = useCallback(() => setIsVisible(true), []);
  const handleMouseLeave = useCallback(() => setIsVisible(false), []);

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="tooltip"
      aria-label="Hover for more information"
    >
      {children}

      {isVisible && (
        <div
          className={`-translate-x-1/2 absolute bottom-full left-1/2 mb-2 transform rounded-md border bg-background p-3 shadow-lg ${className}`}
          style={{ zIndex: 1000 }}
        >
          <p className="text-foreground text-sm">{content}</p>
          <div className="-translate-x-1/2 absolute bottom-0 left-1/2 h-2 w-2 translate-y-1 rotate-45 border-r border-b bg-background" />
        </div>
      )}
    </div>
  );
};
