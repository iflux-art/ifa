/**
 * 链接分类相关功能（客户端可用）
 * 提供链接分类的生成和管理能力
 */

import type { LinksCategory } from "@/components/link-categories/categories-types";

/**
 * 链接分类接口
 */
export interface LinkCategory extends LinksCategory {
  count: number;
}

/**
 * 分类显示名称配置
 */
const CATEGORY_DISPLAY_NAMES: { [key: string]: string } = {
  // 主分类
  ai: "AI 工具",
  audio: "音频处理",
  design: "设计工具",
  development: "开发工具",
  office: "办公软件",
  operation: "运营工具",
  productivity: "效率工具",
  video: "视频处理",

  // AI 子分类
  chat: "AI 对话",
  models: "AI 模型",
  tools: "工具平台",
  platforms: "综合平台",
  api: "API 服务",
  services: "在线服务",
  creative: "创意工具",
  resources: "学习资源",

  // 音频子分类
  daw: "数字音频工作站",
  processing: "音频处理",
  distribution: "音乐发行",

  // 设计子分类
  fonts: "字体资源",
  colors: "配色工具",
  "image-processing": "图像处理",

  // 开发子分类
  frameworks: "开发框架",

  // 办公子分类
  documents: "文档处理",
  notes: "笔记工具",
  mindmaps: "思维导图",
  presentation: "演示文稿",
  pdf: "PDF 工具",
  ocr: "OCR 识别",

  // 运营子分类
  "social-media": "社交媒体",
  "video-platforms": "视频平台",
  ecommerce: "电商工具",
  marketing: "营销工具",

  // 效率子分类
  search: "搜索引擎",
  browsers: "浏览器",
  "cloud-storage": "云存储",
  email: "邮箱服务",
  translation: "翻译工具",
  "system-tools": "系统工具",

  // 视频子分类
  editing: "视频编辑",
};

/**
 * 获取分类显示名称
 */
export function getCategoryDisplayName(categoryId: string): string {
  return CATEGORY_DISPLAY_NAMES[categoryId] || categoryId;
}

/**
 * 检查URL是否已存在
 */
export function checkUrlExists(_url: string, _excludeId?: string): boolean {
  // 这个函数需要访问所有链接数据来检查URL是否已存在
  // 在实际实现中，可能需要从状态管理或API获取数据
  console.warn("checkUrlExists is not fully implemented");
  return false;
}
