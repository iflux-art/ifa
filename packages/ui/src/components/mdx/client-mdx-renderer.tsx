"use client";

import { evaluateSync } from "@mdx-js/mdx";
import { MDXProvider } from "@mdx-js/react";
import matter from "gray-matter";
import { useMemo } from "react";
import * as runtime from "react/jsx-runtime";
import remarkGfm from "remark-gfm";
import { useMDXClientComponents } from "./mdx-client-components";

interface Props {
  content: string;
}

export default function ClientMDXRenderer({ content }: Props) {
  // 在组件渲染顶层调用钩子
  const components = useMDXClientComponents();

  const MDXContent = useMemo(() => {
    try {
      // 解析并移除 frontmatter
      const { content: pureContent } = matter(content);
      // 编译为 React 组件
      const mdxModule = evaluateSync(pureContent, {
        ...runtime,
        useMDXComponents: () => components,
        remarkPlugins: [remarkGfm],
      });
      return mdxModule.default;
    } catch {
      // MDX compilation failed
      return null;
    }
  }, [content, components]);

  if (!MDXContent) {
    return <div className="text-red-500">MDX 解析失败，请检查内容格式</div>;
  }

  // 使用 MDXProvider 确保正确渲染 MDX 内容
  return (
    <MDXProvider components={components}>
      <MDXContent />
    </MDXProvider>
  );
}
