"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { CodeBlock } from "./code-block";
import { MermaidDiagram } from "../mermaid";

export interface MDXPreProps extends React.HTMLAttributes<HTMLPreElement> {
  children: React.ReactNode;
}

/**
 * 从 children 中提取代码内容和语言
 */
function extractCodeInfo(children: React.ReactNode): {
  code: string;
  language: string;
  fileName?: string;
} {
  let code = "";
  let language = "plaintext";
  let fileName: string | undefined;

  // 直接从pre标签的className中提取语言信息
  if (
    React.isValidElement(children) &&
    children.props &&
    typeof children.props === "object" &&
    "className" in children.props
  ) {
    const preClassName = children.props.className as string | undefined;
    const langMatch = preClassName?.match(/language-(\w+)/);
    if (langMatch?.[1]) {
      language = langMatch[1];
    }

    // 提取文件名
    const fileMatch = preClassName?.match(/filename-(\S+)/);
    if (fileMatch?.[1]) {
      fileName = fileMatch[1];
    }
  }

  // 递归遍历 children 来提取代码内容
  const extractText = (node: React.ReactNode): string => {
    if (typeof node === "string") {
      return node;
    }
    if (typeof node === "number") {
      return String(node);
    }
    if (React.isValidElement(node)) {
      // 检查是否是 code 元素
      if (
        node.type === "code" &&
        typeof node.props === "object" &&
        node.props &&
        "className" in node.props
      ) {
        const className = node.props.className as string | undefined;
        const langMatch = className?.match(/language-(\w+)/);
        if (langMatch?.[1]) {
          language = langMatch[1];
        }

        // 提取文件名
        const fileMatch = className?.match(/filename-(\S+)/);
        if (fileMatch?.[1]) {
          fileName = fileMatch[1];
        }
      }
      // 递归处理子元素
      if (
        typeof node.props === "object" &&
        node.props &&
        "children" in node.props
      ) {
        return extractText(node.props.children as React.ReactNode);
      }
    }
    if (Array.isArray(node)) {
      return node.map(extractText).join("");
    }
    return "";
  };

  code = extractText(children);
  return { code: code.trim(), language, fileName };
}

const MDXPre: React.FC<MDXPreProps> = React.memo(
  ({ children, className, ...props }) => {
    const { code, language, fileName } = extractCodeInfo(children);

    // 如果是 mermaid 代码块，使用 MermaidDiagram 组件
    if (language === "mermaid" && code) {
      return <MermaidDiagram chart={code} className={className} />;
    }

    // 如果有代码内容则使用 CodeBlock
    if (code) {
      return (
        <CodeBlock
          code={code}
          language={language}
          fileName={fileName}
          showLineNumbers={true}
          className={className}
        />
      );
    }

    // 回退到原始 pre 元素
    return (
      <pre
        className={cn("overflow-x-auto p-4 bg-muted rounded-md", className)}
        {...props}
      >
        {children}
      </pre>
    );
  },
);

MDXPre.displayName = "MDXPre";

export { MDXPre };
