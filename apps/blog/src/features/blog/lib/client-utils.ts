/**
 * 客户端安全的工具函数
 * 这些函数可以在浏览器环境中安全运行，不依赖Node.js特定模块
 */

/**
 * 格式化日期
 * @param date 日期字符串或Date对象
 * @returns 格式化后的日期字符串
 */
export function formatDate(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * 计算阅读时间
 * @param content 内容文本
 * @returns 阅读时间（分钟）
 */
export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 300;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

/**
 * 格式化数字显示
 * @param num 数字
 * @returns 格式化后的字符串
 */
export function formatNumber(num: number): string {
  if (num >= 10000) {
    return `${(num / 10000).toFixed(1)}w`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}k`;
  }
  return num.toString();
}

/**
 * 防抖函数
 * @param func 要防抖的函数
 * @param delay 延迟时间（毫秒）
 * @returns 防抖后的函数
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null;
  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func(...args);
      timeoutId = null;
    }, delay);
  };
}

/**
 * 节流函数
 * @param func 要节流的函数
 * @param limit 限制时间（毫秒）
 * @returns 节流后的函数
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number,
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

/**
 * 按分类分组内容
 * @param items 内容项数组
 * @returns 按分类分组的对象
 */
export function groupByCategory<T extends { category?: string }>(
  items: T[],
): Record<string, T[]> {
  return items.reduce(
    (acc, item) => {
      const category = item.category || "未分类";
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(item);
      return acc;
    },
    {} as Record<string, T[]>,
  );
}

/**
 * 按标签分组内容
 * @param items 内容项数组
 * @returns 按标签分组的对象
 */
export function groupByTag<T extends { tags?: string[] }>(
  items: T[],
): Record<string, T[]> {
  return items.reduce(
    (acc, item) => {
      const tags = item.tags || ["未标签"];
      tags.forEach((tag) => {
        if (!acc[tag]) {
          acc[tag] = [];
        }
        acc[tag].push(item);
      });
      return acc;
    },
    {} as Record<string, T[]>,
  );
}

/**
 * 排序内容项
 * @param items 内容项数组
 * @param sortBy 排序字段
 * @param order 排序顺序
 * @returns 排序后的内容项数组
 */
export function sortContent<T>(
  items: T[],
  sortBy: keyof T,
  order: "asc" | "desc" = "desc",
): T[] {
  return [...items].sort((a, b) => {
    const aValue = a[sortBy];
    const bValue = b[sortBy];

    if (aValue == null && bValue == null) return 0;
    if (aValue == null) return order === "asc" ? -1 : 1;
    if (bValue == null) return order === "asc" ? 1 : -1;

    if (typeof aValue === "string" && typeof bValue === "string") {
      return order === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    if (typeof aValue === "number" && typeof bValue === "number") {
      return order === "asc" ? aValue - bValue : bValue - aValue;
    }

    if (aValue instanceof Date && bValue instanceof Date) {
      return order === "asc"
        ? aValue.getTime() - bValue.getTime()
        : bValue.getTime() - aValue.getTime();
    }

    return 0;
  });
}

/**
 * 内容提取工具函数
 * 从 Markdown/MDX 内容中提取标题并更新内容
 * 内联所有相关类型和逻辑，避免外部依赖
 */

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
  const headings: TocHeading[] = [];
  const headingRegex = /^(#{1,4})\s+(.+?)(?:\s*{#([\w-]+)})?$/gm;
  let match: RegExpExecArray | null;
  let processedContent = content;

  // 首先提取所有标题
  match = headingRegex.exec(content);
  while (match !== null) {
    // 修复：添加空值检查
    if (match[1] && match[2]) {
      const level = match[1].length;
      const text = match[2].trim();
      // 解析markdown链接格式 [text](url)
      const linkMatch = text.match(/\[([^\]]+)\]\([^)]+\)/);
      // 使用可选链操作符修复Biome lint错误
      const finalText = linkMatch?.[1] ? linkMatch[1] : text;
      const customId = match[3];
      const id =
        customId ||
        `heading-${finalText
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^\w-]/g, "")}-${match.index}`;

      if (level >= 1 && level <= 4) {
        headings.push({ id, text: finalText, level });
      }
    }

    match = headingRegex.exec(content);
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
export interface TocHeading {
  /** 标题ID */
  id: string;
  /** 标题文本 */
  text: string;
  /** 标题级别 */
  level: number;
}
