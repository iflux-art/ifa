/**
 * MDX 组件配置
 * 统一管理所有 MDX 组件映射
 */

import { MDXBlockquote } from "@/components/mdx/mdx-blockquote";
import { MDXCode } from "@/components/mdx/mdx-code";
import { MDXImg } from "@/components/mdx/mdx-img";
import { MDXLink } from "@/components/mdx/mdx-link";
import { MDXPre } from "@/components/mdx/mdx-pre";

/**
 * MDX 组件映射配置
 * 将 HTML 元素映射到自定义 React 组件
 */
export const MDXComponents = {
  a: MDXLink,
  blockquote: MDXBlockquote,
  code: MDXCode,
  img: MDXImg,
  pre: MDXPre,
} as const;

/**
 * MDX 组件 Hook
 * 提供统一的组件获取接口
 */
export const useMDXComponents = () => MDXComponents;
