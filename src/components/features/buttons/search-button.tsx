"use client";

import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { preloadSearchIndex } from "@/components/features/search/local-search-engine";
import { SearchDialog } from "@/components/features/search/search-dialog";
import { Button } from "@/components/ui/button";

/**
 * 搜索图标组件
 * 点击后打开搜索对话框
 */
export const SearchButton = () => {
	const [open, setOpen] = useState(false);

	// 在组件挂载时预加载搜索索引
	useEffect(() => {
		preloadSearchIndex();
	}, []);

	// 在悬停时预加载搜索对话框组件
	const handleMouseEnter = () => {
		// 预加载搜索对话框组件
		import("@/components/features/search/search-dialog").catch((error) => {
			console.warn("Failed to preload search dialog on hover:", error);
		});
	};

	return (
		<>
			<Button
				variant="ghost"
				size="icon"
				className="h-9 w-9"
				onClick={() => setOpen(true)}
				onMouseEnter={handleMouseEnter}
				aria-label="搜索"
				title="搜索（Ctrl + K）"
			>
				<Search className="h-5 w-5" />
			</Button>
			<SearchDialog open={open} onOpenChange={setOpen} />
		</>
	);
};
