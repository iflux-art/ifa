/**
 * 博客相关类型定义
 * 集中管理博客模块的所有类型，便于维护和引用
 */

// ==================== 内容类型 ====================
export interface ContentItem {
  /** 内容唯一标识符 */
  id: string;
  /** 内容标题 */
  title: string;
  /** 内容描述 */
  description?: string;
  /** 内容分类 */
  category?: string;
  /** 内容标签 */
  tags?: string[];
  /** 内容创建日期 */
  date?: string;
  /** 内容更新日期 */
  update?: string;
  /** 内容作者 */
  author?: string;
  /** 内容封面图片 */
  cover?: string;
  /** 内容状态 */
  status?: "draft" | "published" | "archived";
  /** 内容访问权限 */
  access?: "public" | "private" | "protected";
  /** 内容字数统计 */
  wordCount?: number;
  /** 内容阅读时长（分钟） */
  readingTime?: number;
}

// ==================== 博客文章类型 ====================
export interface BlogPost extends ContentItem {
  /** 博客文章唯一标识符 */
  id: string;
  /** 博客文章标题 */
  title: string;
  /** 博客文章描述 */
  description?: string;
  /** 博客文章摘要 */
  excerpt?: string;
  /** 博客文章分类 */
  category?: string;
  /** 博客文章标签 */
  tags?: string[];
  /** 博客文章创建日期 */
  date?: string;
  /** 博客文章更新日期 */
  update?: string;
  /** 博客文章作者 */
  author?: string;
  /** 博客文章作者头像 */
  authorAvatar?: string;
  /** 博客文章作者简介 */
  authorBio?: string;
  /** 博客文章封面图片 */
  cover?: string;
  /** 博客文章状态 */
  status?: "draft" | "published" | "archived";
  /** 博客文章访问权限 */
  access?: "public" | "private" | "protected";
  /** 博客文章字数统计 */
  wordCount?: number;
  /** 博客文章阅读时长（分钟） */
  readingTime?: number;
  /** 博客文章是否已发布 */
  published?: boolean;
  /** 博客文章slug */
  slug: string;
  /** 博客文章图片 */
  image?: string;
}
