"use client";

import {
  TableOfContents,
  BlogCategoryCard,
  TagCloudCard,
  RelatedPostsCard,
  LatestPostsCard,
} from "@/components/features/sidebar";
import type {
  CategoryWithCount,
  TagWithCount,
  RelatedPost,
  LatestPost,
} from "@/components/features/sidebar";

/**
 * 目录标题接口
 */
interface TocHeading {
  id: string;
  text: string;
  level: number;
}

/**
 * 移动端侧边栏内容属性接口
 */
export interface MobileSidebarContentProps {
  /** 目录标题列表 */
  headings?: TocHeading[];
  /** 分类列表 */
  categories?: CategoryWithCount[];
  /** 当前选中的分类 */
  selectedCategory?: string;
  /** 标签列表 */
  tags?: TagWithCount[];
  /** 当前选中的标签 */
  selectedTag?: string;
  /** 相关文章列表 */
  relatedPosts?: RelatedPost[];
  /** 最新文章列表 */
  latestPosts?: LatestPost[];
  /** 当前文章slug */
  currentSlug?: string[];
  /** 分类点击回调 */
  onCategoryClick?: (category: string | null) => void;
  /** 标签点击回调 */
  onTagClick?: (tag: string | null) => void;
  /** 是否启用路由功能 */
  enableRouting?: boolean;
  /** 侧边栏链接点击回调（用于关闭移动菜单） */
  onLinkClick?: () => void;
}

/**
 * 移动端侧边栏内容组件
 * 按照设计要求的顺序渲染侧边栏组件：
 * 1. table-of-contents
 * 2. blog-category-card
 * 3. tag-cloud-card
 * 4. related-posts-card
 * 5. latest-posts-card
 */
export const MobileSidebarContent = ({
  headings = [],
  categories = [],
  selectedCategory,
  tags = [],
  selectedTag,
  relatedPosts = [],
  latestPosts = [],
  currentSlug = [],
  onCategoryClick,
  onTagClick,
  enableRouting = true,
  onLinkClick,
}: MobileSidebarContentProps) => {
  // 如果没有任何内容，返回null
  const hasContent =
    headings.length > 0 ||
    categories.length > 0 ||
    tags.length > 0 ||
    relatedPosts.length > 0 ||
    latestPosts.length > 0;

  if (!hasContent) {
    return null;
  }

  // 包装回调函数以在点击时关闭菜单
  const handleCategoryClick = (category: string | null) => {
    onCategoryClick?.(category);
    onLinkClick?.();
  };

  const handleTagClick = (tag: string | null) => {
    onTagClick?.(tag);
    onLinkClick?.();
  };

  return (
    <div className="space-y-4">
      {/* 1. 目录 */}
      {headings.length > 0 && (
        <div className="col-span-12">
          <TableOfContents headings={headings} />
        </div>
      )}

      {/* 2. 博客分类卡片 */}
      {categories.length > 0 && (
        <div className="col-span-12">
          <BlogCategoryCard
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryClick={handleCategoryClick}
            enableRouting={enableRouting}
            showHeader={true}
          />
        </div>
      )}

      {/* 3. 标签云卡片 */}
      {tags.length > 0 && (
        <div className="col-span-12">
          <TagCloudCard
            allTags={tags}
            selectedTag={selectedTag}
            onTagClick={handleTagClick}
            useDefaultRouting={enableRouting}
          />
        </div>
      )}

      {/* 4. 相关文章卡片 */}
      {relatedPosts.length > 0 && (
        <div className="col-span-12">
          <RelatedPostsCard posts={relatedPosts} currentSlug={currentSlug} />
        </div>
      )}

      {/* 5. 最新文章卡片 */}
      {latestPosts.length > 0 && (
        <div className="col-span-12">
          <LatestPostsCard posts={latestPosts} currentSlug={currentSlug} />
        </div>
      )}
    </div>
  );
};
