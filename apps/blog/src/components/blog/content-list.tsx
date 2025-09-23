"use client";

import {
  ContentCard,
  type ContentCardProps,
} from "@/components/cards/content-card";

// 内容项基础接口
export interface ContentItem {
  /** 唯一标识（URL路径） */
  slug: string;
  /** 标题 */
  title: string;
  /** 描述 */
  description: string;
  /** 标签列表 */
  tags?: string[];
  /** 发布日期 */
  date?: string | Date;
  /** 分类 */
  category?: string;
  /** 内容摘要 */
  excerpt?: string;
  /** 是否已发布 */
  published?: boolean;
  /** 封面图片 */
  cover?: string;
  /** 阅读时间（分钟） */
  readingTime?: number;
  /** 浏览次数 */
  views?: number;
  /** 点赞数 */
  likes?: number;
  /** 更新时间 */
  update?: string | Date;
}

export interface ContentListProps {
  /** 内容项数组 */
  items: ContentItem[];
  /** 内容卡片属性 */
  cardProps?: Partial<ContentCardProps>;
  /** 自定义类名 */
  className?: string;
}

export function ContentList({
  items,
  cardProps = {},
  className,
}: ContentListProps) {
  return (
    <div className={className}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <ContentCard key={item.slug} item={item} {...cardProps} />
        ))}
      </div>
    </div>
  );
}
