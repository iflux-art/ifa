/**
 * TOC 类型定义
 */

/**
 * 目录标题
 */
export interface TocHeading {
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
 * 目录 Props
 */
export interface TocProps {
  /** 标题列表 */
  headings: TocHeading[];
  /** 自定义类名 */
  className?: string;
  /** 卡片标题 */
  title?: string;
  /** 是否自适应高度 */
  adaptive?: boolean;
  /** 自适应偏移量 */
  adaptiveOffset?: number;
}

/**
 * 目录卡片 Props
 */
export interface TableOfContentsCardProps {
  /** 标题列表 */
  headings: TocHeading[];
  /** 自定义类名 */
  className?: string;
  /** 卡片标题 */
  title?: string;
}
