"use client";

import { Search } from "lucide-react";
import { Button } from "./button";

/**
 * 搜索图标组件
 * 点击后打开搜索对话框
 */
export const SearchButton = () => {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-9 w-9"
      aria-label="搜索"
      title="搜索（Ctrl + K）"
    >
      <Search className="h-5 w-5" />
      <span className="sr-only">搜索</span>
    </Button>
  );
};
