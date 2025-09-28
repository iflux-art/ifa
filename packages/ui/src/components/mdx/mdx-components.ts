/**
 * MDX 组件配置
 * 合并静态和交互组件配置
 */

// 注意：只有不使用 React Hooks 的组件才能在服务端组件中使用
import { MDXImg } from "./components/mdx-img";
// 以下组件使用了 React Hooks 或 "use client" 指令，已移至客户端组件中:
// import { MDXLink } from "./components/mdx-link";
// import { MDXBlockquote } from "./components/mdx-blockquote";
// import { MDXCode } from "./components/mdx-code";
// import { MDXPre } from "./components/mdx-pre";

export const MDXComponents = {
  img: MDXImg,
  // 以下组件使用了 React Hooks 或 "use client" 指令，已移至客户端组件中:
  // a: MDXLink,
  // blockquote: MDXBlockquote,
  // code: MDXCode,
  // pre: MDXPre,
};

export const useMDXComponents = () => MDXComponents;

/**
 * 兼容旧用法的映射
 */
export const MDXComponentsMapping = MDXComponents;
// ===== END =====
