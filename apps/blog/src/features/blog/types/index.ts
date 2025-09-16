/**
 * 博客相关类型定义
 */

// ==================== 博客核心类型 ====================

/**
 * 博客文章
 */
export interface BlogPost {
  /** 唯一标识（URL路径） */
  slug: string;
  /** 标题 */
  title: string;
  /** 描述 */
  description: string;
  /** 标签列表 */
  tags?: string[];
  /** 发布日期 */
  date?: string | Date;
  /** 分类 */
  category?: string;
  /** 作者 */
  author?: string;
  /** 作者头像 */
  authorAvatar?: string | null;
  /** 作者简介 */
  authorBio?: string;
  /** 是否已发布 */
  published?: boolean;
  /** 文章摘要 */
  excerpt: string;
  /** 是否为特色文章 */
  featured?: boolean;
  /** 文章封面图片 */
  image?: string;
  /** 阅读时间（分钟） */
  readingTime?: number;
  /** 浏览次数 */
  views?: number;
  /** 点赞数 */
  likes?: number;
}

/**
 * 内容项基础接口
 */
export interface ContentItem {
  /** 唯一标识（URL路径） */
  slug: string;
  /** 标题 */
  title: string;
  /** 描述 */
  description: string;
  /** 标签列表 */
  tags?: string[];
  /** 发布日期 */
  date?: string | Date;
  /** 分类 */
  category?: string;
  /** 内容摘要 */
  excerpt?: string;
  /** 是否已发布 */
  published?: boolean;
  /** 封面图片 */
  cover?: string;
  /** 阅读时间（分钟） */
  readingTime?: number;
  /** 浏览次数 */
  views?: number;
  /** 点赞数 */
  likes?: number;
  /** 更新时间 */
  update?: string | Date;
}

export interface RelatedPost {
  title: string;
  href: string;
  category?: string;
}

/**
 * 标签统计
 */
export interface TagCount {
  /** 标签名称 */
  tag: string;
  /** 文章数量 */
  count: number;
  /** 标签颜色 */
  color?: string;
}

/**
 * 分类统计
 */
export interface CategoryWithCount {
  /** 分类名称 */
  name: string;
  /** 文章数量 */
  count: number;
}

/**
 * 博客文章Frontmatter
 */
export interface BlogFrontmatter {
  title: string;
  description?: string;
  date?: string | Date;
  update?: string | Date;
  category?: string;
  tags?: string[];
  published?: boolean;
  excerpt?: string;
  cover?: string;
}

// ================= 博客搜索相关类型 =================

/** 博客搜索结果 */
export interface BlogSearchResult {
  /** 文章标题 */
  title: string;
  /** 文章路径 */
  path: string;
  /** 文章摘要 */
  excerpt: string;
}

/** 博客搜索参数 */
export interface BlogSearchParams {
  /** 搜索查询 */
  query: string;
  /** 搜索限制 */
  limit?: number;
}

// ================= 内容搜索相关类型 =================

/** 内容搜索参数 */
export interface ContentSearchParams {
  /** 搜索查询 */
  query: string;
  /** 搜索限制 */
  limit?: number;
  /** 搜索类型 */
  type?: "blog" | "doc" | "all";
}

/** 内容页面状态 */
export interface ContentPageState {
  /** 当前页码 */
  page: number;
  /** 每页条数 */
  limit: number;
  /** 搜索关键词 */
  search?: string;
  /** 分类筛选 */
  category?: string;
  /** 标签筛选 */
  tag?: string;
  /** 排序方式 */
  sort?: "date" | "views" | "likes";
  /** 排序方向 */
  order?: "asc" | "desc";
}

// ================= 内容标题相关类型 =================

/** 内容标题 */
export interface TocHeading {
  /** 标题ID */
  id: string;
  /** 标题文本 */
  text: string;
  /** 标题级别 */
  level: number;
}
