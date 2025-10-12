/**
 * 链接内容组件
 * 从 layout/links-content.tsx 移动并优化
 * 显示按标签分组的链接卡片，优化渲染性能
 */

"use client";

import { memo, useMemo } from "react";
import { LinkCard } from "@/components/links/link-card";
import { cn } from "@/lib/utils";
import type { LinksContentProps } from "./types";

export const LinksContent = memo(({ items, selectedCategory, className }: LinksContentProps) => {
  // 按标签对链接进行分组，并确保项目唯一性
  const groupedItems = useMemo(() => {
    // 创建标签到链接的映射
    const tagMap = new Map<string, typeof items>();

    // 先去重，确保每个项目只处理一次
    const uniqueItems = Array.from(new Map(items.map((item) => [item.id, item])).values());

    uniqueItems.forEach((item) => {
      if (item.tags && Array.isArray(item.tags)) {
        item.tags.forEach((tag) => {
          if (tag && typeof tag === "string" && tag.trim()) {
            const trimmedTag = tag.trim();
            if (!tagMap.has(trimmedTag)) {
              tagMap.set(trimmedTag, []);
            }
            // 确保不会添加重复的项目到同一个标签下
            const tagItems = tagMap.get(trimmedTag) || [];
            if (!tagItems.some((existingItem) => existingItem.id === item.id)) {
              tagMap.get(trimmedTag)?.push(item);
            }
          }
        });
      }
    });

    // 转换为数组并排序
    const sortedGroups = Array.from(tagMap.entries())
      .sort(([a], [b]) => a.localeCompare(b, "zh-CN", { numeric: true }))
      .map(([tag, tagItems]) => ({
        tag,
        items: tagItems,
      }));

    return sortedGroups;
  }, [items]);

  // 空状态处理
  if (!items || items.length === 0) {
    return (
      <div className={cn("flex items-center justify-center py-12", className)}>
        <div className="text-center">
          <h3 className="mb-2 font-medium text-lg text-muted-foreground">暂无链接</h3>
          <p className="text-muted-foreground text-sm">
            {selectedCategory ? "当前分类下没有链接" : "没有找到任何链接"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-8 py-4", className)}>
      {groupedItems.map(({ tag, items: tagItems }) => {
        // 生成与 use-tag-anchors 钩子一致的锚点 ID
        const anchorId = `tag-${tag.replace(/\s+/g, "-").toLowerCase()}`;

        return (
          <section key={tag} className="space-y-4">
            {/* 标签标题，用于锚点跳转 */}
            <h2 id={anchorId} className="scroll-mt-24 pb-2 font-semibold text-foreground text-xl">
              {tag}
            </h2>

            {/* 链接卡片网格：在sm断点下一行显示1个卡片，在md断点下一行显示3个卡片，在lg断点下一行显示2个卡片，在xl和2xl断点下一行显示3个卡片 */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-3 xl:grid-cols-3">
              {tagItems.map((item) => (
                <div key={item.id}>
                  <LinkCard
                    title={item.title}
                    description={item.description || item.url}
                    href={item.url}
                    icon={item.icon}
                    iconType={item.iconType}
                    isExternal
                    className="h-full"
                  />
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
});

LinksContent.displayName = "LinksContent";
