import { FileX, Search, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  className?: string;
  type?: "no-content" | "no-results" | "error";
  title?: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const EmptyStateConfig = {
  "no-content": {
    icon: FileX,
    title: "暂无内容",
    description: "这里还没有任何内容，请稍后再来查看。",
  },
  "no-results": {
    icon: Search,
    title: "未找到相关内容",
    description: "尝试调整搜索条件或浏览其他内容。",
  },
  error: {
    icon: AlertCircle,
    title: "加载失败",
    description: "内容加载时出现问题，请稍后重试。",
  },
};

/**
 * 空状态组件
 * 用于显示无内容、无搜索结果或错误状态
 */
export const EmptyState = ({
  className,
  type = "no-content",
  title,
  description,
  action,
}: EmptyStateProps) => {
  const config = EmptyStateConfig[type];
  const Icon = config.icon;

  return (
    <div className={cn("flex flex-col items-center justify-center py-12 text-center", className)}>
      <div className="mb-4 rounded-full bg-muted p-3">
        <Icon className="h-8 w-8 text-muted-foreground" />
      </div>

      <h3 className="mb-2 font-semibold text-foreground text-lg">{title || config.title}</h3>

      <p className="mb-6 max-w-sm text-muted-foreground text-sm">
        {description || config.description}
      </p>

      {action && (
        <Button onClick={action.onClick} variant="outline">
          {action.label}
        </Button>
      )}
    </div>
  );
};
