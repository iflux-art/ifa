"use client";

import {
  BlogCategoryCard,
  BlogListContent,
  useBlogPage,
} from "@/components/blog";
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
  const leftSidebarContent = (
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
  const rightSidebarContent = (
    <>
      <LatestPostsCard posts={latestPosts} currentSlug={[]} />
      <RelatedPostsCard posts={relatedPosts} currentSlug={[]} />
    </>
  );

  // 定义侧边栏配置
  const sidebars = [
    {
      id: "left-sidebar",
      content: leftSidebarContent,
      position: "left" as const,
      sticky: true,
      stickyTop: "80px",
      maxHeight: "calc(100vh - 5rem - env(safe-area-inset-bottom))",
      responsive: {
        hideOnMobile: true,
        hideOnTablet: false,
        hideOnDesktop: false,
      },
    },
    {
      id: "right-sidebar",
      content: rightSidebarContent,
      position: "right" as const,
      sticky: true,
      stickyTop: "80px",
      maxHeight: "calc(100vh - 5rem - env(safe-area-inset-bottom))",
      responsive: {
        hideOnMobile: true,
        hideOnTablet: false,
        hideOnDesktop: false,
      },
    },
  ];

  return (
    <div className="min-h-screen bg-background container mx-auto px-4">
      <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-12 md:gap-6 lg:gap-8 xl:gap-10 py-6 lg:py-8">
        {/* 左侧边栏区域 */}
        <div className="hidden sm:col-span-2 sm:col-start-1 md:col-span-2 md:col-start-1 lg:col-span-2 lg:col-start-1 xl:col-span-2 xl:col-start-1">
          {sidebars
            .filter((s) => s.position === "left")
            .map((sidebar, index) => (
              <div
                key={sidebar.id || `left-${index}`}
                className="space-y-6 sticky top-[80px] max-h-[calc(100vh-5rem-env(safe-area-inset-bottom))]"
              >
                {sidebar.content}
              </div>
            ))}
        </div>

        {/* 主内容区域 */}
        <main className="min-w-0 col-span-1 sm:col-span-8 sm:col-start-3 md:col-span-8 md:col-start-3 lg:col-span-8 lg:col-start-3 xl:col-span-8 xl:col-start-3">
          <BlogListContent
            posts={filteredPosts}
            selectedCategory={category}
            selectedTag={tag}
            onCategoryClick={handleCategoryClick}
            onTagClick={handleTagClick}
          />
        </main>

        {/* 右侧边栏区域 */}
        <div className="hidden sm:col-span-2 sm:col-start-11 md:col-span-2 md:col-start-11 lg:col-span-2 lg:col-start-11 xl:col-span-2 xl:col-start-11">
          {sidebars
            .filter((s) => s.position === "right")
            .map((sidebar, index) => (
              <div
                key={sidebar.id || `right-${index}`}
                className="space-y-6 sticky top-[80px] max-h-[calc(100vh-5rem-env(safe-area-inset-bottom))]"
              >
                {sidebar.content}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default BlogPageContainer;
