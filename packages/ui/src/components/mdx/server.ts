// ==================== MDX 服务端组件导出 ====================
// 该文件专门导出不依赖客户端 hooks 的 MDX 组件

// 以下组件使用了 "use client" 指令，已移至客户端导出:
// export { MDXBlockquote } from "./components/mdx-blockquote";
// export { MDXCode } from "./components/mdx-code";
// export { MDXLink } from "./components/mdx-link";

export { MDXImg } from "./components/mdx-img";
// MDXPre 和 CodeBlock 组件使用了 React Hooks，已移至客户端导出
export type { CodeBlockProps } from "./components/pre/code-block";
export { MDXComponents, useMDXComponents } from "./mdx-components";
