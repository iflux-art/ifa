/**
 * 内容提取工具函数
 * 从 Markdown/MDX 内容中提取标题并更新内容
 * 内联所有相关类型和逻辑，避免外部依赖
 */

/**
 * 目录标题
 */
interface TocHeading {
  /** 标题ID */
  id: string;
  /** 标题文本 */
  text: string;
  /** 标题内容 */
  content: string;
  /** 标题级别 */
  level: number;
}

/**
 * 转义正则表达式特殊字符
 */
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * 从 Markdown/MDX 内容中提取标题并更新内容
 */
export function extractHeadings(content: string): {
  headings: TocHeading[];
  processedContent: string;
} {
  // 先移除代码块内容，避免代码块中的标题被解析
  let contentWithoutCodeBlocks = content;

  // 匹配代码块的正则表达式
  const codeBlockRegex = /```[\s\S]*?```/g;
  contentWithoutCodeBlocks = content.replace(codeBlockRegex, "");

  // 匹配行内代码的正则表达式
  const inlineCodeRegex = /`[^`]*`/g;
  contentWithoutCodeBlocks = contentWithoutCodeBlocks.replace(
    inlineCodeRegex,
    "",
  );

  const headings: TocHeading[] = [];
  const headingRegex = /^(#{1,4})\s+(.+?)(?:\s*{#([\w-]+)})?$/gm;
  let match: RegExpExecArray | null;
  let processedContent = content;

  // 首先提取所有标题
  match = headingRegex.exec(contentWithoutCodeBlocks);
  while (match !== null) {
    // 修复：添加空值检查
    if (match[1] && match[2]) {
      const level = match[1].length;
      let text = match[2].trim();

      // 处理多种链接格式
      // 处理 markdown 链接 [text](url)
      text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
      // 处理 HTML 链接 <a href="url">text</a>
      text = text.replace(
        /<a\s+[^>]*href=["'][^"']*["'][^>]*>(.*?)<\/a>/gi,
        "$1",
      );
      // 处理自动链接 <url>
      text = text.replace(/<([^>]+)>/g, "$1");

      // 去除可能的多余空格
      text = text.trim();

      const customId = match[3];
      const id =
        customId ||
        `heading-${text
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^\w-]/g, "")}-${match.index}`;

      if (level >= 1 && level <= 4) {
        headings.push({ id, text, content: text, level });
      }
    }

    match = headingRegex.exec(contentWithoutCodeBlocks);
  }

  // 确保所有标题都有唯一ID
  headings.forEach((heading) => {
    const escapedText = escapeRegExp(heading.text);
    const headingRegex = new RegExp(
      `^(#{${heading.level}})\\s+(?:\\[[^\\]]+\\]\\([^)]+\\)|${escapedText})(?:\\s*{#[\\w-]+})?$`,
      "gm",
    );
    processedContent = processedContent.replace(
      headingRegex,
      `$1 ${heading.text} {#${heading.id}}`,
    );
  });

  return {
    headings,
    processedContent,
  };
}

// 导出 TocHeading 类型以供外部使用
export type { TocHeading };
