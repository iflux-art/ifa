/**
 * 统一的加载骨架屏组件
 * 提供一致的加载状态展示，减少重复的加载组件定义
 */

import { cn } from "@/lib/utils";

/**
 * 基础骨架屏组件
 */
interface SkeletonProps {
  className?: string;
  children?: React.ReactNode;
}

export const Skeleton = ({ className, children, ...props }: SkeletonProps) => (
  <div className={cn("animate-pulse", "rounded bg-muted", className)} {...props}>
    {children}
  </div>
);

/**
 * 卡片骨架屏
 */
export const CardSkeleton = ({ className }: { className?: string }) => (
  <div className={cn("rounded-lg border bg-card p-6", className)}>
    <Skeleton className="mb-3 h-6 w-3/4" />
    <Skeleton className="mb-2 h-4 w-full" />
    <Skeleton className="h-4 w-2/3" />
  </div>
);

/**
 * 页面加载骨架屏
 */
export const PageLoadingSkeleton = () => (
  <div className="min-h-screen bg-background">
    <div className={cn("container mx-auto px-4", "py-16")}>
      {/* 进度条 */}
      <div className="fixed top-16 right-0 left-0 z-50">
        <div className="h-1 w-full overflow-hidden bg-gray-200 dark:bg-gray-800">
          <div
            className="h-full animate-pulse bg-primary"
            style={{
              width: "60%",
              transition: "width 300ms ease-out",
            }}
          />
        </div>
      </div>

      {/* 内容区域 */}
      <div className={cn("flex items-center justify-center", "min-h-[50vh]")}>
        <div className="text-center">
          <div
            className={cn(
              "mx-auto mb-4 rounded-full border-primary border-b-2",
              "h-12 w-12",
              "animate-spin"
            )}
          />
          <p className="text-muted-foreground">加载中...</p>
        </div>
      </div>
    </div>
  </div>
);

/**
 * Hero 区域骨架屏
 */
export const HeroSkeleton = () => (
  <div className="min-h-[60vh] bg-gradient-to-br from-background to-muted/20">
    <div className={cn("container mx-auto px-4", "py-16")}>
      <div className={cn("flex items-center justify-center", "min-h-[40vh]")}>
        <div className="space-y-4 text-center">
          <div className="animate-pulse">
            <Skeleton className="mx-auto mb-4 h-12 w-96" />
            <Skeleton className="mx-auto mb-2 h-6 w-64" />
            <Skeleton className="mx-auto h-6 w-48" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

// 预定义的骨架屏项目，避免使用数组索引作为 key
const SKELETON_ITEMS = [
  "featured-link-1",
  "featured-link-2",
  "featured-link-3",
  "featured-link-4",
  "featured-link-5",
  "featured-link-6",
] as const;

/**
 * 特色链接区域骨架屏
 */
export const FeaturedLinksSkeleton = () => (
  <div className="bg-muted/10 py-16">
    <div className="container mx-auto px-4">
      <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3", "gap-6")}>
        {SKELETON_ITEMS.map((id) => (
          <CardSkeleton key={id} />
        ))}
      </div>
    </div>
  </div>
);

/**
 * 通用加载指示器
 */
export const LoadingSpinner = ({ className }: { className?: string }) => (
  <div
    className={cn("rounded-full border-primary border-b-2", "h-8 w-8", "animate-spin", className)}
  />
);
