/**
 * MDX 客户端组件配置
 * 包含所有需要 "use client" 指令的 MDX 组件
 */

import { MDXCode } from "./components/code/mdx-code";
import { MDXBlockquote } from "./components/mdx-blockquote";
import { MDXImg } from "./components/mdx-img";
import { MDXLink } from "./components/mdx-link";
import { MDXPre } from "./components/pre/mdx-pre";
// 客户端组件

export const MDXClientComponents = {
  img: MDXImg,
  a: MDXLink,
  blockquote: MDXBlockquote,
  code: MDXCode,
  pre: MDXPre,
};

export const useMDXClientComponents = () => MDXClientComponents;
