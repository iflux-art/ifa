/**
 * Friends 功能相关类型定义
 */

/**
 * 友链数据模型
 * 独立的友链类型定义，替代对 LinksItem 的依赖
 */
export interface FriendLink {
  /** 唯一标识符 */
  id: string;
  /** 友链标题 */
  title: string;
  /** 叶链URL */
  url: string;
  /** 友链描述 */
  description?: string;
  /** 所属分类，友链固定为 "friends" */
  category: "friends";
  /** 标签列表 */
  tags?: string[];
  /** 是否推荐 */
  featured?: boolean;
  /** 友链图标 */
  icon?: string;
  /** 图标类型 */
  iconType?: "image" | "text";
  /** 创建时间 */
  createdAt?: string;
  /** 更新时间 */
  updatedAt?: string;
}

export interface FriendLinkFormConfig {
  /** 友链申请表单URL */
  formUrl: string;
  /** 表单标题 */
  title?: string;
  /** 表单描述 */
  description?: string;
}

export interface FriendLinkRequirement {
  /** 要求图标 */
  icon: string;
  /** 要求标题 */
  title: string;
  /** 要求描述 */
  description: string;
}

export interface FriendsPageConfig {
  /** 友链申请表单配置 */
  application: FriendLinkFormConfig;
  /** 友链申请要求 */
  requirements: FriendLinkRequirement[];
  /** 是否显示评论区 */
  showComments?: boolean;
}
