"use client";

import {
  BlogCategoryCard,
  BlogListContent,
  useBlogPage,
} from "@/components/blog";
import { LayoutContainer } from "@/components/layout";
import { LatestPostsCard } from "@/components/widgets/latest-posts-card";
import { RelatedPostsCard } from "@/components/widgets/related-posts-card";
import { TagCloudCard } from "@/components/widgets/tag-cloud-card";

/**
 * Blog页面容器组件
 * 使用三栏布局展示博客内容
 */
export const BlogPageContainer = () => {
  const {
    filteredPosts,
    postsCount,
    relatedPosts,
    latestPosts,
    category,
    tag,
    categories,
    handleCategoryClick,
    handleTagClick,
  } = useBlogPage();

  // 左侧边栏内容
  const leftSidebar = (
    <>
      <BlogCategoryCard
        categories={categories}
        selectedCategory={category}
        onCategoryClick={handleCategoryClick}
      />
      <TagCloudCard
        allTags={Object.entries(postsCount).map(([name, count]) => ({
          name,
          count,
        }))}
        selectedTag={tag}
        onTagClick={handleTagClick}
      />
    </>
  );

  // 右侧边栏内容
  const rightSidebar = (
    <>
      <LatestPostsCard posts={latestPosts} currentSlug={[]} />
      <RelatedPostsCard posts={relatedPosts} currentSlug={[]} />
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
