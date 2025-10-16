import { useMemo } from "react";
import { cn } from "@/lib/utils";

interface LoadingSkeletonProps {
  className?: string;
  lines?: number;
  showAvatar?: boolean;
  showImage?: boolean;
}

/**
 * 生成唯一ID的辅助函数
 */
const generateUniqueId = () => {
  return Math.random().toString(36).substring(2, 15);
};

/**
 * 通用加载骨架屏组件
 * 可配置显示行数、头像、图片等
 */
export const LoadingSkeleton = ({
  className,
  lines = 3,
  showAvatar = false,
  showImage = false,
}: LoadingSkeletonProps) => {
  // 为每个骨架行生成稳定的唯一ID
  const lineIds = useMemo(() => Array.from({ length: lines }, () => generateUniqueId()), [lines]);

  return (
    <div className={cn("animate-pulse space-y-4", className)}>
      {showAvatar && (
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-full bg-muted"></div>
          <div className="space-y-2">
            <div className="h-4 w-24 rounded bg-muted"></div>
            <div className="h-3 w-16 rounded bg-muted"></div>
          </div>
        </div>
      )}

      {showImage && <div className="h-48 w-full rounded-lg bg-muted"></div>}

      <div className="space-y-3">
        {lineIds.map((id, index) => (
          <div
            key={id}
            className={cn("h-4 rounded bg-muted", index === lines - 1 ? "w-3/4" : "w-full")}
          ></div>
        ))}
      </div>
    </div>
  );
};
