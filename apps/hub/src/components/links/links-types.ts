/**
 * Links 功能相关类型定义
 * 统一管理 links 相关类型定义，供前后端、hooks、组件复用
 */

/** 链接条目 */
export interface LinksItem {
  id: string;
  title: string;
  description: string;
  url: string;
  icon: string;
  iconType?: "image" | "text";
  tags: string[];
  category: string; // 使用 string 类型而不是 CategoryId，让使用者从 link-categories 导入具体的类型
  createdAt?: string;
  updatedAt?: string;
}

// 表单数据类型（如有需要）
export interface LinksFormData {
  title: string;
  description: string;
  url: string;
  icon: string;
  iconType: "image" | "text";
  tags: string[];
  category: string; // 使用 string 类型而不是 CategoryId，让使用者从 link-categories 导入具体的类型
}
