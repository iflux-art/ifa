"use client";

import { FileText, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { SearchResult } from "@/components/search/search-types";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useAppStore } from "@/stores";
import { useSearchState } from "./use-search-state";

// 搜索结果项组件
interface SearchResultItemProps {
  result: SearchResult;
  index: number;
  onResultClick: (result: SearchResult) => void;
}

const SearchResultItem = ({ result, index, onResultClick }: SearchResultItemProps) => {
  return (
    <button
      type="button"
      key={result.title || index}
      className="w-full cursor-pointer rounded-lg border p-3 text-left transition-colors hover:bg-accent"
      onClick={() => onResultClick(result)}
    >
      <div className="flex items-start gap-3">
        <div className="mt-1 text-muted-foreground">
          <FileText className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center gap-2">
            <h4 className="truncate font-medium text-sm">{result.title}</h4>
            <Badge variant="secondary" className="text-xs">
              文章
            </Badge>
          </div>
          {result.description && (
            <p className="line-clamp-2 text-muted-foreground text-sm">{result.description}</p>
          )}
          {result.tags && result.tags.length > 0 && (
            <div className="mt-2 flex gap-1">
              {result.tags.slice(0, 3).map((tag, _tagIndex) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </button>
  );
};

// 搜索结果列表组件
interface SearchResultsProps {
  isLoading: boolean;
  results: SearchResult[];
  query: string;
  onResultClick: (result: SearchResult) => void;
}

const SearchResults = ({ isLoading, results, query, onResultClick }: SearchResultsProps) => {
  if (isLoading) {
    return <div className="py-8 text-center text-muted-foreground">搜索中...</div>;
  }

  if (results.length > 0) {
    return (
      <div className="space-y-2">
        {results.map((result, index) => (
          <SearchResultItem
            key={result.title || index}
            result={result}
            index={index}
            onResultClick={onResultClick}
          />
        ))}
      </div>
    );
  }

  if (query.trim()) {
    return <div className="py-8 text-center text-muted-foreground">未找到相关结果</div>;
  }

  return null;
};

// 搜索输入组件
interface SearchInputProps {
  query: string;
  onChange: (value: string) => void;
}

const SearchInput = ({ query, onChange }: SearchInputProps) => {
  // 添加状态来跟踪输入法组合状态
  const [_isComposing, setIsComposing] = useState(false);

  // 处理输入法组合开始事件
  const handleCompositionStart = () => {
    setIsComposing(true);
  };

  // 处理输入法组合结束事件
  const handleCompositionEnd = (e: React.CompositionEvent<HTMLInputElement>) => {
    setIsComposing(false);
    // 在组合结束后触发 onChange 事件
    onChange(e.currentTarget.value);
  };

  // 处理输入事件
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 正常情况下都要触发 onChange 回调来更新状态
    onChange(e.target.value);
  };

  return (
    <div className="relative mb-4">
      <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 transform text-muted-foreground" />
      <Input
        placeholder="搜索博客文章..."
        value={query}
        onChange={handleChange}
        onCompositionStart={handleCompositionStart}
        onCompositionEnd={handleCompositionEnd}
        className="pl-10"
      />
    </div>
  );
};

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SearchDialog = ({ open, onOpenChange }: SearchDialogProps) => {
  const { search, results, isLoading, query, setSearchTerm, resetSearch } = useSearchState();

  // 使用全局应用状态管理加载和错误状态
  const { setLoading, showError, clearError } = useAppStore();

  // 监听键盘快捷键 (Ctrl+K 或 Command+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        onOpenChange(!open);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onOpenChange]);

  // 同步加载和错误状态到全局状态
  useEffect(() => {
    setLoading(isLoading, "搜索中...");
    if (isLoading) {
      clearError();
    }
  }, [isLoading, setLoading, clearError]);

  // 搜索功能
  const performSearch = useMemo(() => {
    return (searchQuery: string) => {
      if (!searchQuery.trim()) {
        resetSearch();
        return;
      }

      // 只搜索博客类型
      search(searchQuery, { type: "blog" }).catch((error) => {
        showError(error instanceof Error ? error.message : "搜索失败");
      });
    };
  }, [search, resetSearch, showError]);

  // 防抖搜索
  useEffect(() => {
    if (!query.trim()) {
      resetSearch();
      return;
    }

    const searchTimeout = setTimeout(() => {
      performSearch(query);
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [query, performSearch, resetSearch]);

  const handleResultClick = (result: SearchResult) => {
    if (result.path) {
      window.location.href = result.path;
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[80vh] flex-col overflow-hidden sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>搜索</DialogTitle>
        </DialogHeader>

        <SearchInput query={query} onChange={setSearchTerm} />

        <div className="flex-1 overflow-y-auto">
          <SearchResults
            isLoading={isLoading}
            results={results}
            query={query}
            onResultClick={handleResultClick}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
