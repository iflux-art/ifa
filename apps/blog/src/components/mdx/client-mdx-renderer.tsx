"use client";

import { evaluateSync } from "@mdx-js/mdx";
import { MDXProvider } from "@mdx-js/react";
import matter from "gray-matter";
import { useMemo } from "react";
import * as runtime from "react/jsx-runtime";
import remarkGfm from "remark-gfm";
import { useMDXComponents } from "@/components/mdx/mdx-components";

interface ClientMDXRendererProps {
  content: string;
}

/**
 * 客户端 MDX 渲染器
 * 负责在客户端动态编译和渲染 MDX 内容
 */
export default function ClientMDXRenderer({ content }: ClientMDXRendererProps) {
  const components = useMDXComponents();

  const MDXContent = useMemo(() => {
    try {
      // 解析并移除 frontmatter
      const { content: pureContent } = matter(content);

      // 编译为 React 组件
      const mdxModule = evaluateSync(pureContent, {
        ...runtime,
        useMDXComponents,
        remarkPlugins: [remarkGfm],
      });

      return mdxModule.default;
    } catch (error) {
      console.error("MDX 编译失败:", error);
      return null;
    }
  }, [content]);

  if (!MDXContent) {
    return (
      <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-destructive">
        <p className="font-medium">MDX 内容解析失败</p>
        <p className="text-sm">请检查内容格式是否正确</p>
      </div>
    );
  }

  return (
    <MDXProvider components={components}>
      <MDXContent />
    </MDXProvider>
  );
}
