"use client";

import type React from "react";
import { Button } from "@/components/ui/button";

interface AdminAction {
  /** 操作标签 */
  label: string;
  /** 操作图标 */
  icon?: React.ComponentType<{ className?: string }>;
  /** 点击事件处理函数 */
  onClick: () => void;
  /** 是否禁用 */
  disabled?: boolean;
  /** 是否正在加载 */
  loading?: boolean;
  /** 按钮变体 */
  variant?: "default" | "outline" | "ghost" | "destructive";
}

export interface AdminActionsProps {
  actions: (Omit<AdminAction, "icon"> & {
    icon?: React.ComponentType<{ className?: string }>;
    key?: string;
  })[];
  className?: string;
}

export const AdminActions = ({ actions, className = "" }: AdminActionsProps) => (
  <div className={`flex flex-wrap gap-2 ${className}`}>
    {actions.map((action, index) => {
      const IconComponent = action.icon;
      // 使用 action.key 或 index 作为 key，如果都没有则生成唯一 key
      const key = action.key || `${action.label}-${index}`;
      return (
        <Button
          key={key}
          variant={action.variant ?? "default"}
          onClick={action.onClick}
          disabled={action.disabled ?? action.loading}
          className="flex items-center gap-2"
          type="button"
        >
          {action.loading ? (
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          ) : (
            IconComponent && <IconComponent className="h-4 w-4" />
          )}
          {action.label}
        </Button>
      );
    })}
  </div>
);
