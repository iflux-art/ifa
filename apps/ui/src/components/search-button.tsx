"use client";

import { Button } from "@iflux-art/ui";
import { Search } from "lucide-react";

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
