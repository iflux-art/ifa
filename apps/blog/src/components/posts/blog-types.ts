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

// ==================== 博客元数据类型 ====================
export interface BlogFrontmatter {
  /** 文章标题 */
  title: string;
  /** 文章描述 */
  description?: string;
  /** 文章分类 */
  category?: string;
  /** 文章标签 */
  tags?: string[];
  /** 文章创建日期 */
  date?: string;
  /** 文章更新日期 */
  update?: string;
  /** 文章作者 */
  author?: string;
  /** 文章封面图片 */
  cover?: string;
  /** 文章状态 */
  status?: "draft" | "published" | "archived";
  /** 文章访问权限 */
  access?: "public" | "private" | "protected";
}

// ==================== 搜索相关类型 ====================
export interface BlogSearchParams {
  /** 搜索关键词 */
  query?: string;
  /** 限制返回结果数量 */
  limit?: number;
  /** 搜索类型 */
  type?: "all" | "title" | "content" | "tags";
  /** 分类筛选 */
  category?: string;
  /** 标签筛选 */
  tag?: string;
  /** 日期范围开始 */
  dateFrom?: string;
  /** 日期范围结束 */
  dateTo?: string;
}

export interface BlogSearchResult {
  /** 搜索结果唯一标识符 */
  id: string;
  /** 搜索结果标题 */
  title: string;
  /** 搜索结果描述 */
  description?: string;
  /** 搜索结果分类 */
  category?: string;
  /** 搜索结果标签 */
  tags?: string[];
  /** 搜索结果创建日期 */
  date?: string;
  /** 搜索结果URL */
  url: string;
  /** 搜索结果匹配度分数 */
  score?: number;
}

// ==================== 内容页面状态类型 ====================
export interface ContentPageState {
  /** 当前页码 */
  page: number;
  /** 每页显示数量 */
  limit: number;
  /** 搜索关键词 */
  query?: string;
  /** 分类筛选 */
  category?: string;
  /** 标签筛选 */
  tag?: string;
  /** 排序方式 */
  sort?: "date" | "title" | "readingTime";
  /** 排序方向 */
  order?: "asc" | "desc";
}

// ==================== 内容搜索参数类型 ====================
export interface ContentSearchParams {
  /** 搜索关键词 */
  query: string;
  /** 限制返回结果数量 */
  limit: number;
  /** 搜索类型 */
  type: "all" | "title" | "content" | "tags";
  /** 分类筛选 */
  category?: string;
  /** 标签筛选 */
  tag?: string;
}

// ==================== 内容统计类型 ====================
export interface ContentStats {
  /** 总文章数 */
  totalPosts: number;
  /** 总分类数 */
  totalCategories: number;
  /** 总标签数 */
  totalTags: number;
  /** 最新文章日期 */
  latestPostDate?: string;
  /** 最早文章日期 */
  earliestPostDate?: string;
}
