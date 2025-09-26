/**
 * 链接分类客户端服务
 * 提供与链接分类API交互的客户端接口
 */

import { get } from "@/lib/api/api-client";
import { CONTENT_API_PATHS } from "@/lib/api/api-paths";

// 链接分类服务接口
export interface LinkCategoryService {
  fetchCategories: () => Promise<LinkCategory[]>;
}

// 链接分类接口
export interface LinkCategory {
  id: string;
  name: string;
  count: number;
  children?: LinkCategory[];
}

// 分类显示名称配置
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
  agents: "智能体",
  chat: "AI 对话",
  models: "AI 模型",
  "ai-tools": "工具平台",
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
  "design-tools": "设计工具",

  // 开发子分类
  apis: "API",
  cloud: "云服务",
  containers: "容器化",
  databases: "数据库",
  frameworks: "开发框架",
  git: "版本控制",
  hosting: "托管服务",
  monitoring: "监控工具",
  security: "安全工具",
  "dev-tools": "开发工具",

  // 办公子分类
  "office-documents": "文档处理",
  "office-pdf": "PDF 工具",

  // 运营子分类
  ecommerce: "电商工具",
  marketing: "营销工具",

  // 效率子分类
  browsers: "浏览器",
  "cloud-storage": "云存储",
  "productivity-documents": "文档处理",
  email: "邮箱服务",
  "productivity-pdf": "PDF 工具",
  search: "搜索引擎",
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
 * 链接分类服务实现
 */
class LinkCategoryServiceImpl implements LinkCategoryService {
  /**
   * 获取分类数据
   */
  async fetchCategories(): Promise<LinkCategory[]> {
    const { data, error } = await get<LinkCategory[]>(
      CONTENT_API_PATHS.LinkCategories,
    );

    if (error) {
      throw new Error(error);
    }

    return data;
  }
}

// 导出服务实例
export const linkCategoryService = new LinkCategoryServiceImpl();
