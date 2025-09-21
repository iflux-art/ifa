/**
 * MDX 组件配置
 * 合并静态和交互组件配置
 */

import { MDXBlockquote } from "./mdx-blockquote";
import { MDXCode } from "./mdx-code";
import { MDXImg } from "./mdx-img";
import { MDXLink } from "./mdx-link";
import { MDXPre } from "./mdx-pre";

export const MDXComponents = {
  a: MDXLink,
  blockquote: MDXBlockquote,
  code: MDXCode,
  img: MDXImg,
  pre: MDXPre,
};

export const useMDXComponents = () => MDXComponents;

/**
 * 兼容旧用法的映射
 */
export const MDXComponentsMapping = MDXComponents;
// ===== END =====
