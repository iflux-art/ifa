/**
 * Blog 功能组件统一导出
 */

// 博客相关组件
export { BlogCard } from "./blog-card";
export { BlogCategoryCard } from "./blog-category-card";
export { BlogListContent } from "./blog-list-content";
export { CodeBlock } from "./code/code-block";
// 内容相关组件（原content模块）
export { ContentCard } from "./content-card";
export { ContentList } from "./content-list";
export { ContentDisplay } from "./display/content-display";
export { LatestPostsCard } from "./latest-posts-card";
export { RelatedPostsCard } from "./related-posts-card";
export { TagCloudCard } from "./tag-cloud-card";

// MDX组件
export { ClientMDXRenderer } from "@/features/mdx";

// 页面组件
export { BlogPageContainer } from "./blog-page";
export type { CodeBlockProps } from "./code/code-block";
export type { ContentCardProps } from "./content-card";
export type { ContentListProps } from "./content-list";
export {
  MDXBlockquote,
  MDXCode,
  MDXImg,
  MDXLink,
  MDXPre,
} from "@/features/mdx";
// 导出类型
export type { RelatedPost } from "./related-posts-card";

// 注意：已移除 DocPagination 组件的导出，因为翻页功能不再需要
