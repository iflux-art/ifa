/**
 * 博客模块类型定义
 */

// 从 content-list.tsx 移植的类型
export interface ContentItem {
  /** 内容唯一标识 */
  slug: string;
  /** 标题 */
  title: string;
  /** 描述 */
  description: string;
  /** 封面图片 */
  cover?: string;
  /** 分类 */
  category?: string;
  /** 标签列表 */
  tags?: string[];
  /** 日期 */
  date?: string;
  /** 作者 */
  author?: string;
  /** 是否置顶 */
  sticky?: boolean;
  /** 浏览量 */
  views?: number;
  /** 点赞数 */
  likes?: number;
  /** 评论数 */
  comments?: number;
}

export interface ContentListProps {
  /** 内容列表 */
  items: ContentItem[];
  /** 是否加载中 */
  loading?: boolean;
  /** 是否显示骨架屏 */
  skeleton?: boolean;
  /** 骨架屏数量 */
  skeletonCount?: number;
}

// 从 blog-search.ts 移植的类型
export interface BlogSearchResult {
  /** 文章slug */
  slug: string;
  /** 标题 */
  title: string;
  /** 描述 */
  description: string;
  /** 日期 */
  date: string;
  /** 摘要 */
  excerpt: string;
}

// 从 use-blog-page.ts 移植的类型
export interface CategoryWithCount {
  /** 分类名称 */
  name: string;
  /** 文章数量 */
  count: number;
}

// 从 client-utils.ts 移植的类型
export interface TocHeading {
  /** 标题ID */
  id: string;
  /** 标题文本 */
  text: string;
  /** 标题级别 */
  level: number;
}

// 从 use-blog-page.ts 移植的类型
export interface ContentPageState {
  /** 当前页码 */
  currentPage: number;
  /** 每页条数 */
  pageSize: number;
  /** 总条数 */
  total: number;
  /** 分类筛选 */
  category?: string;
  /** 标签筛选 */
  tag?: string;
  /** 搜索关键词 */
  search?: string;
}

export interface ContentSearchParams {
  /** 当前页码 */
  page?: number;
  /** 分类筛选 */
  category?: string;
  /** 标签筛选 */
  tag?: string;
  /** 搜索关键词 */
  search?: string;
}

export interface TagCount {
  /** 标签名称 */
  name: string;
  /** 标签数量 */
  count: number;
}

// 从 blog-content.ts 移植的类型
export interface BlogFrontmatter {
  /** 标题 */
  title: string;
  /** 描述 */
  description?: string;
  /** 日期 */
  date?: string;
  /** 标签 */
  tags?: string[];
  /** 分类 */
  category?: string;
  /** 作者 */
  author?: string;
  /** 是否发布 */
  published?: boolean;
  /** 封面图片 */
  image?: string;
  /** 是否置顶 */
  sticky?: boolean;
}

export interface BlogSearchParams {
  /** 搜索关键词 */
  query: string;
  /** 限制数量 */
  limit?: number;
  /** 分类筛选 */
  category?: string;
  /** 标签筛选 */
  tag?: string;
}
