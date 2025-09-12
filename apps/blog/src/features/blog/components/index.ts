/**
 * Blog 功能组件统一导出
 */

// 博客相关组件
export { BlogCard } from "./blog-card";
export { RelatedPostsCard } from "./related-posts-card";
export { LatestPostsCard } from "./latest-posts-card";
export { TagCloudCard } from "./tag-cloud-card";
export { BlogCategoryCard } from "./blog-category-card";
export { BlogListContent } from "./blog-list-content";

// 内容相关组件（原content模块）
export { ContentCard } from "./content-card";
export { ContentList } from "./content-list";
export { ContentDisplay } from "./display/content-display";
export { CodeBlock } from "./code/code-block";

// MDX组件
import ClientMDXRenderer from "./mdx/client-mdx-renderer";
export { ClientMDXRenderer };
export { MDXComponents } from "./mdx/mdx-components";
export { MDXImg } from "./mdx/mdx-img";
export { MDXLink } from "./mdx/mdx-link";
export { MDXBlockquote } from "./mdx/mdx-blockquote";
export { MDXCode } from "./mdx/mdx-code";
export { MDXPre } from "./mdx/mdx-pre";

// 页面组件
export { BlogPageContainer } from "./blog-page";

// 导出类型
export type { RelatedPost } from "./related-posts-card";
export type { ContentCardProps } from "./content-card";
export type { ContentListProps } from "./content-list";
export type { CodeBlockProps } from "./code/code-block";

// 注意：已移除 DocPagination 组件的导出，因为翻页功能不再需要
