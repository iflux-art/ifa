// ==================== 客户端组件导出 ====================
// 该文件专门导出需要 "use client" 指令的组件

// 主题相关组件
export { ThemeProvider } from "./theme/theme-provider";
export { ThemeToggle } from "./theme/theme-toggle";

// UI组件
export { Button } from "./ui/button/button";
export { BackButton } from "./ui/back-button";
export { GitHubButton } from "./ui/button/github-button";
export { TravelButton } from "./ui/button/travel-button";
export { COPYRIGHT_TEXT, Footer } from "./ui/footer";
export { TwikooComment } from "./twikoo-comment";
export { LinkCard } from "./ui/card/link-card";
export type { LinkCardProps } from "./ui/card/link-card";

// MDX客户端组件
export { default as ClientMDXRenderer } from "./mdx/client-mdx-renderer";
export { MDXPre } from "./mdx/components/pre/mdx-pre";
export { CodeBlock } from "./mdx/components/pre/code-block";
export { MDXBlockquote } from "./mdx/components/mdx-blockquote";
export { MDXCode } from "./mdx/components/code/mdx-code";
export { MDXLink } from "./mdx/components/mdx-link";
export {
  MDXClientComponents as MDXComponents,
  useMDXClientComponents as useMDXComponents,
} from "./mdx/mdx-client-components";
