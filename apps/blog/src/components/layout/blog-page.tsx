"use client";

import { LayoutContainer } from "@/components/layout";
import { BlogListContent } from "@/components/posts/blog-list-content";
import {
  BlogCategoryCard,
  LatestPostsCard,
  RelatedPostsCard,
  TagCloudCard,
} from "@/components/sidebar";
import { useBlogPage } from "@/components/posts/hooks";

/**
 * Blog页面容器组件
 * 使用三栏布局展示博客内容
 */
export const BlogPageContainer = () => {
  const {
    filteredPosts,
    categories,
    postsCount,
    relatedPosts,
    latestPosts,
    category,
    tag,
    handleCategoryClick,
    handleTagClick,
  } = useBlogPage();

  // 左侧边栏内容（现在为空）
  const leftSidebar = null;

  // 右侧边栏内容（包含原来左侧边栏的内容）
  const rightSidebar = (
    <>
      <BlogCategoryCard
        categories={categories}
        selectedCategory={category}
        onCategoryClick={handleCategoryClick}
        showHeader={false}
      />
      <TagCloudCard
        allTags={Object.entries(postsCount).map(([name, count]) => ({
          name,
          count,
        }))}
        selectedTag={tag}
        onTagClick={handleTagClick}
      />
      <RelatedPostsCard posts={relatedPosts} currentSlug={[]} />
      <LatestPostsCard posts={latestPosts} currentSlug={[]} />
    </>
  );

  return (
    <div className="min-h-screen bg-background">
      <LayoutContainer
        leftSidebar={leftSidebar}
        rightSidebar={rightSidebar}
        layout="double-sidebar"
      >
        <BlogListContent
          posts={filteredPosts}
          selectedCategory={category}
          selectedTag={tag}
          onCategoryClick={handleCategoryClick}
          onTagClick={handleTagClick}
        />
      </LayoutContainer>
    </div>
  );
};

export default BlogPageContainer;
