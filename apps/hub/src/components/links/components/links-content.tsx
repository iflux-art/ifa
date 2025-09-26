"use client";

import { useMemo } from "react";
import { LinkCard } from "@repo/ui/components/ui/card";
import type { LinksItem } from "@/components/links/types";

export interface LinksContentProps {
  items: LinksItem[];
  selectedCategory?: string;
}

export const LinksContent = ({
  items,
  selectedCategory,
}: LinksContentProps) => {
  // 根据分类过滤项目
  const filteredItems = useMemo(() => {
    if (!selectedCategory) return items;
    return items.filter((item) => item.category === selectedCategory);
  }, [items, selectedCategory]);

  if (filteredItems.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">该分类下暂无链接</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {filteredItems.map((item) => (
        <LinkCard
          key={item.id}
          title={item.title}
          description={item.description}
          href={item.url}
          isExternal={!item.url.startsWith("/")}
          icon={item.icon}
          iconType={item.iconType}
        />
      ))}
    </div>
  );
};
