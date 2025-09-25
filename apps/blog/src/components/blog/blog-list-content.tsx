"use client";

import { BlogCard } from "@/components/cards/blog-card";
import { formatDate } from "@/components/blog/client-utils";

// 博客文章类型定义
export interface BlogPost {
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
  /** 作者 */
  author?: string;
  /** 作者头像 */
  authorAvatar?: string | null;
  /** 作者简介 */
  authorBio?: string;
  /** 是否已发布 */
  published?: boolean;
  /** 文章摘要 */
  excerpt: string;
  /** 是否为特色文章 */
  featured?: boolean;
  /** 文章封面图片 */
  image?: string;
  /** 阅读时间（分钟） */
  readingTime?: number;
  /** 浏览次数 */
  views?: number;
  /** 点赞数 */
  likes?: number;
}

// 删除重复的 formatDate 函数实现

export interface BlogListContentProps {
  posts: BlogPost[];
  selectedCategory?: string | null;
  selectedTag?: string | null;
  onCategoryClick?: (category: string | null) => void;
  onTagClick?: (tag: string | null) => void;
}

/**
 * 博客列表内容组件
 *
 * 显示博客文章列表
 */
export const BlogListContent = ({
  posts,
  selectedCategory,
  selectedTag,
  onCategoryClick,
  onTagClick,
}: BlogListContentProps) => {
  // 生成筛选结果为空时的提示信息
  const getEmptyMessage = () => {
    if (selectedCategory && selectedTag) {
      return `未找到分类为"${selectedCategory}"且包含标签"${selectedTag}"的文章`;
    } else if (selectedCategory) {
      return `未找到分类为"${selectedCategory}"的文章`;
    } else if (selectedTag) {
      return `未找到包含标签"${selectedTag}"的文章`;
    } else {
      return "暂无文章";
    }
  };

  if (!posts.length) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-muted-foreground">{getEmptyMessage()}</p>
          {(selectedCategory ?? selectedTag) && (
            <p className="mt-2 text-sm text-muted-foreground">
              尝试调整筛选条件或清除筛选查看所有文章
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post: BlogPost) => (
        <BlogCard
          key={post.slug}
          title={post.title}
          description={post.description}
          href={`/posts/${post.slug}`} // 更新为新的basePath
          category={post.category}
          cover={post.image}
          tags={post.tags}
          date={post.date ? formatDate(post.date) : ""}
          author={post.author}
          onCategoryClick={onCategoryClick}
          onTagClick={onTagClick}
        />
      ))}
    </div>
  );
};

// 导出 BlogCard 组件以供其他模块使用
export { BlogCard };
