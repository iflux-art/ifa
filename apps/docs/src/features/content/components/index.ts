/**
 * 内容相关公共组件导出
 */

// 原有内容组件
export { ContentCard } from "./content-card";
export type { ContentCardProps } from "./content-card";

export { ContentList } from "./content-list";
export type { ContentListProps } from "./content-list";

// MDX 组件
export {
  ClientMDXRenderer,
  MDXComponents,
  MDXImg,
  MDXLink,
  MDXBlockquote,
  MDXCode,
  MDXPre,
} from "@/features/mdx";

// 内容展示组件
export { ContentDisplay } from "@/components/content-display";

// 代码高亮组件
export { CodeBlock } from "@/features/mdx/code";
export type { CodeBlockProps } from "@/features/mdx/code";
