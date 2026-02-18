"use client";

import { FileText, Loader2, Search } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { SearchResult } from "@/components/features/search/search-types";
import { Badge } from "@/components/ui/badge";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useSearchState } from "./use-search-state";

// 搜索结果项组件
interface SearchResultItemProps {
	result: SearchResult;
	index: number;
	onResultClick: (result: SearchResult) => void;
}

const SearchResultItem = ({
	result,
	index,
	onResultClick,
}: SearchResultItemProps) => {
	return (
		<button
			type="button"
			key={result.title || index}
			className="w-full cursor-pointer rounded-lg border p-3 text-left transition-colors hover:bg-accent"
			onClick={() => onResultClick(result)}
		>
			<div className="flex items-start gap-3">
				<div className="mt-1 shrink-0 text-muted-foreground">
					<FileText className="h-4 w-4" />
				</div>
				<div className="min-w-0 flex-1">
					<div className="mb-1 flex flex-wrap items-center justify-between gap-2">
						<h4 className="truncate font-medium text-sm">{result.title}</h4>
						{result.category && (
							<Badge variant="secondary" className="shrink-0 text-xs">
								{result.category}
							</Badge>
						)}
					</div>
					{result.headingText && (
						<p className="mb-1 text-primary text-xs">→ {result.headingText}</p>
					)}
					{result.description && (
						<p className="line-clamp-2 text-muted-foreground text-sm">
							{result.description}
						</p>
					)}
					{result.tags && result.tags.length > 0 && (
						<div className="mt-2 flex flex-wrap gap-1">
							{result.tags.slice(0, 3).map((tag) => (
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
	isIndexLoading: boolean;
	results: SearchResult[];
	query: string;
	onResultClick: (result: SearchResult) => void;
}

const SearchResults = ({
	isLoading,
	isIndexLoading,
	results,
	query,
	onResultClick,
}: SearchResultsProps) => {
	if (isIndexLoading) {
		return (
			<div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
				<Loader2 className="mb-2 h-6 w-6 animate-spin" />
				<span>正在加载搜索索引...</span>
			</div>
		);
	}

	if (isLoading) {
		return (
			<div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
				<Loader2 className="mb-2 h-6 w-6 animate-spin" />
				<span>搜索中...</span>
			</div>
		);
	}

	if (results.length > 0) {
		return (
			<div className="space-y-2">
				{results.map((result, index) => (
					<SearchResultItem
						key={`${result.title}-${index}`}
						result={result}
						index={index}
						onResultClick={onResultClick}
					/>
				))}
			</div>
		);
	}

	if (query.trim()) {
		return (
			<div className="py-8 text-center text-muted-foreground">
				未找到相关结果
			</div>
		);
	}

	return (
		<div className="py-8 text-center text-muted-foreground">
			输入关键词开始搜索
		</div>
	);
};

// 搜索输入组件
interface SearchInputProps {
	query: string;
	onChange: (value: string) => void;
	inputRef: React.RefObject<HTMLInputElement | null>;
}

const SearchInput = ({ query, onChange, inputRef }: SearchInputProps) => {
	// 跟踪输入法组合状态
	const isComposing = useRef(false);

	// 处理输入法组合开始事件
	const handleCompositionStart = () => {
		isComposing.current = true;
	};

	// 处理输入法组合结束事件
	const handleCompositionEnd = (
		e: React.CompositionEvent<HTMLInputElement>,
	) => {
		isComposing.current = false;
		// 在组合结束后触发 onChange 事件
		onChange(e.currentTarget.value);
	};

	// 处理输入事件
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		// 如果正在输入法组合中，不触发搜索
		// 但仍然更新输入框的值
		onChange(e.target.value);
	};

	// 处理键盘事件
	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		// 如果正在输入法组合中，不处理
		if (isComposing.current) {
			return;
		}
		// 可以在这里添加键盘导航逻辑
		if (e.key === "Escape") {
			e.preventDefault();
		}
	};

	return (
		<div className="relative mb-4">
			<Search className="-translate-y-1/2 pointer-events-none absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
			<Input
				ref={inputRef}
				placeholder="搜索博客文章... (支持标题、标签、内容)"
				value={query}
				onChange={handleChange}
				onCompositionStart={handleCompositionStart}
				onCompositionEnd={handleCompositionEnd}
				onKeyDown={handleKeyDown}
				className="pl-10"
				autoFocus
			/>
		</div>
	);
};

interface SearchDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export const SearchDialog = ({ open, onOpenChange }: SearchDialogProps) => {
	const inputRef = useRef<HTMLInputElement>(null);
	const {
		search,
		results,
		isLoading,
		isIndexLoading,
		query,
		setQuery,
		resetSearch,
	} = useSearchState();

	// 当对话框打开时，聚焦输入框
	useEffect(() => {
		if (open) {
			// 延迟聚焦，确保对话框已完全渲染
			const timer = setTimeout(() => {
				inputRef.current?.focus();
			}, 100);
			return () => clearTimeout(timer);
		}
		return undefined;
	}, [open]);

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

	// 防抖搜索
	useEffect(() => {
		if (!open) return;

		if (!query.trim()) {
			resetSearch();
			return;
		}

		const searchTimeout = setTimeout(() => {
			search(query).catch((error) => {
				console.error("搜索失败:", error);
			});
		}, 300);

		return () => clearTimeout(searchTimeout);
	}, [query, open, search, resetSearch]);

	// 对话框关闭时重置
	useEffect(() => {
		if (!open) {
			resetSearch();
		}
	}, [open, resetSearch]);

	const handleResultClick = useCallback(
		(result: SearchResult) => {
			if (result.path) {
				// 导航到结果页面
				window.location.href = result.path;
			}
			onOpenChange(false);
		},
		[onOpenChange],
	);

	const handleOpenChange = useCallback(
		(newOpen: boolean) => {
			onOpenChange(newOpen);
		},
		[onOpenChange],
	);

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogContent className="flex max-h-[80vh] flex-col overflow-hidden sm:max-w-[600px]">
				<DialogHeader>
					<DialogTitle>搜索</DialogTitle>
				</DialogHeader>

				<SearchInput query={query} onChange={setQuery} inputRef={inputRef} />

				<div className="flex-1 overflow-y-auto">
					<SearchResults
						isLoading={isLoading}
						isIndexLoading={isIndexLoading}
						results={results}
						query={query}
						onResultClick={handleResultClick}
					/>
				</div>

				<div className="mt-2 flex items-center justify-between border-t pt-2 text-muted-foreground text-xs">
					<span>按 Ctrl+K 打开搜索</span>
					<span>点击结果跳转到文章</span>
				</div>
			</DialogContent>
		</Dialog>
	);
};
