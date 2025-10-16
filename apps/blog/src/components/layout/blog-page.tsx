"use client";

import { BlogListContent } from "@/components/features/posts/blog-list-content";
import type { BlogPost } from "@/components/features/posts/blog-types";
import { useBlogPage } from "@/components/features/posts/use-blog-page";

import { BlogCategoryCard } from "@/components/features/sidebar/blog-category-card";
import { LatestPostsCard } from "@/components/features/sidebar/latest-posts-card";
import { RelatedPostsCard } from "@/components/features/sidebar/related-posts-card";
import { SidebarWrapper } from "@/components/features/sidebar/sidebar-wrapper";
import { TagCloudCard } from "@/components/features/sidebar/tag-cloud-card";

interface BlogPageContainerProps {
  initialPosts?: BlogPost[];
  allTags?: { name: string; count: number }[];
  categories?: { name: string; count: number }[];
  latestPosts?: {
    title: string;
    href: string;
    date?: string;
    category?: string;
  }[];
  relatedPosts?: {
    title: string;
    href: string;
    category?: string;
    slug: string[];
  }[];
}

/**
 * Blog页面容器组件
 * 使用三栏布局展示博客内容
 */
export const BlogPageContainer = ({
  initialPosts = [],
  allTags = [],
  categories = [],
  latestPosts = [],
  relatedPosts = [],
}: BlogPageContainerProps) => {
  const {
    filteredPosts, // 使用所有过滤后的文章，而不是分页后的文章
    postsCount,
    category,
    tag,
    handleCategoryClick,
    handleTagClick,
  } = useBlogPage({ initialPosts });

  // 如果传入了服务端数据，则使用这些数据
  const effectiveCategories = categories.length > 0 ? categories : [];
  const effectiveTags =
    allTags.length > 0
      ? allTags
      : Object.entries(postsCount).map(([name, count]) => ({
          name,
          count: count as number,
        }));
  const effectiveLatestPosts = latestPosts.length > 0 ? latestPosts : [];
  const effectiveRelatedPosts = relatedPosts.length > 0 ? relatedPosts : [];

  // 使用过滤后的文章（而不是所有文章），这样筛选功能才能正常工作
  const displayPosts = filteredPosts;

  // 左侧边栏内容（包含原来右侧边栏的内容）
  const leftSidebar = (
    <>
      <BlogCategoryCard
        categories={effectiveCategories}
        selectedCategory={category}
        onCategoryClick={handleCategoryClick}
        enableRouting={true}
        showHeader={false}
      />
      <TagCloudCard
        allTags={effectiveTags}
        selectedTag={tag}
        onTagClick={handleTagClick}
        useDefaultRouting={true}
      />
      <RelatedPostsCard posts={effectiveRelatedPosts} currentSlug={[]} />
      <LatestPostsCard posts={effectiveLatestPosts} currentSlug={[]} />
    </>
  );

  // 右侧边栏内容（现在为空）
  const _rightSidebar = null; // 保留变量但添加下划线前缀以避免未使用警告

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-4">
        <div className="pb-8">
          <div className="grid grid-cols-12 gap-4 sm:gap-6">
            {/* 左侧空列 - 占2列，只在xl和2xl断点下显示 */}
            <div className="hidden xl:col-span-2 xl:block"></div>

            {/* 主内容区域 - 在小屏幕上占12列，在xl及以上占8列 */}
            <div className="col-span-12 xl:col-span-8">
              <div className="grid grid-cols-12 gap-4 sm:gap-6">
                {/* Sidebar - 占3列 */}
                <div className="col-span-12 md:col-span-3 lg:col-span-3 xl:col-span-3">
                  <SidebarWrapper
                    config={{
                      sticky: true,
                      stickyTop: "80px",
                      responsive: {
                        hideOnMobile: true,
                        hideOnTablet: false,
                        hideOnDesktop: false,
                      },
                    }}
                  >
                    <div className="space-y-6">{leftSidebar}</div>
                  </SidebarWrapper>
                </div>

                {/* 文章卡片区域 - 占9列 */}
                <div className="col-span-12 md:col-span-9 lg:col-span-9 xl:col-span-9">
                  <BlogListContent
                    posts={displayPosts}
                    selectedCategory={category}
                    selectedTag={tag}
                    onCategoryClick={handleCategoryClick}
                    onTagClick={handleTagClick}
                  />
                </div>
              </div>
            </div>

            {/* 右侧空列 - 占2列，只在xl和2xl断点下显示 */}
            <div className="hidden xl:col-span-2 xl:block"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPageContainer;
