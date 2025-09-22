import { ArrowRight, Loader2 } from "lucide-react";
import type { SearchResult } from "@/components/search/types";
import { cn } from "@/lib/utils";

// 由于只搜索博客文章，可以简化类型标签
const TYPE_LABELS = {
  blog: "文章",
} as const;

interface SearchResultsProps {
  results: SearchResult[];
  searchQuery: string;
  isLoading: boolean;
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
  onSelect: (result: SearchResult) => void;
  onClearHistory: () => void;
  searchHistory: string[];
  // 移除未使用的 onHistoryClick 参数
}

export const SearchResults = ({
  results,
  searchQuery,
  isLoading,
  selectedIndex,
  setSelectedIndex,
  onSelect,
  onClearHistory,
  searchHistory,
}: SearchResultsProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (results.length > 0) {
    return (
      <div className="py-2">
        {results.map((result, index) => (
          <button
            type="button"
            key={result.title || index}
            onClick={() => onSelect(result)}
            onKeyDown={(e) => e.key === "Enter" && onSelect(result)}
            tabIndex={0}
            className={cn(
              "flex cursor-pointer items-start gap-2 px-4 py-3 transition-colors hover:bg-accent/50",
              selectedIndex === index && "bg-accent",
            )}
            onMouseEnter={() => setSelectedIndex(index)}
          >
            <div className="mt-1 flex-shrink-0 text-muted-foreground">
              {/* 只显示博客文章图标 */}📝
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="mb-1 flex items-center gap-1 truncate text-sm font-medium">
                {result.title}
              </h4>
              <p className="line-clamp-2 text-xs text-muted-foreground">
                {result.description}
              </p>
              {/* 由于只有一种类型，可以简化显示 */}
              <div className="mt-1 text-xs text-muted-foreground">
                {TYPE_LABELS.blog}
              </div>
            </div>
            <ArrowRight className="mt-1 h-4 w-4 flex-shrink-0 text-muted-foreground" />
          </button>
        ))}
      </div>
    );
  }

  if (searchQuery.trim()) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">
          没有找到与 &quot;{searchQuery}&quot; 相关的结果
        </p>
      </div>
    );
  }

  return (
    <div className="p-8 text-center">
      <p className="text-muted-foreground">输入关键词搜索博客文章</p>
      {searchHistory.length > 0 && (
        <button
          type="button"
          onClick={onClearHistory}
          className="mt-2 text-xs text-primary hover:underline"
        >
          清除搜索历史
        </button>
      )}
    </div>
  );
};
