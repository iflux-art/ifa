// MDX 组件统一导出文件
// 此文件导出所有 MDX 相关组件，便于统一管理和使用

// 客户端组件
export { default as ClientMDXRenderer } from "./client-mdx-renderer";
export {
  MDXClientComponents,
  useMDXClientComponents,
} from "./mdx-client-components";

// 服务端组件
export { MDXComponents, useMDXComponents } from "./mdx-components";

// 兼容旧用法的映射
export { MDXComponentsMapping } from "./mdx-components";

// 单独导出各个组件
export { MDXBlockquote } from "./components/mdx-blockquote";
export { MDXCode } from "./components/code/mdx-code";
export { MDXImg } from "./components/mdx-img";
export { MDXLink } from "./components/mdx-link";
export { MDXPre } from "./components/pre/mdx-pre";
export { CodeBlock } from "./components/pre/code-block";
export { MermaidDiagram } from "./components/mermaid";
