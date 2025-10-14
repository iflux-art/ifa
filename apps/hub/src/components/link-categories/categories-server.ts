/**
 * 链接分类相关功能（服务端专用）
 * 提供链接分类的生成和管理能力
 */

import { promises as fs } from "node:fs";
import path from "node:path";
import type { LinkCategory } from "@/components/link-categories/categories";
import type { CategoryId } from "@/components/link-categories/categories-types"; // 从 categories-types 导入
import type { LinksItem } from "@/components/links/links-types";

/**
 * 分类显示名称配置
 */
const CATEGORY_DISPLAY_NAMES: { [key: string]: string } = {
  // 主分类
  ai: "AI 工具",
  audio: "音频处理",
  business: "商业工具",
  design: "设计工具",
  development: "开发工具",
  media: "媒体工具",
  office: "办公软件",
  operation: "运营工具",
  productivity: "效率工具",
  video: "视频处理",

  // AI 子分类
  chat: "AI 对话",
  models: "AI 模型",
  "ai/tools": "工具平台",
  platforms: "综合平台",
  api: "API 服务",
  "ai/services": "在线服务",
  creative: "创意工具",
  resources: "学习资源",

  // 音频子分类
  daw: "数字音频工作站",
  processing: "音频处理",
  distribution: "音乐发行",

  // 商业子分类
  "business/ecommerce": "电商工具",
  "business/marketing": "营销工具",
  "business/services": "商业服务",

  // 设计子分类
  fonts: "字体资源",
  colors: "配色工具",
  "image-processing": "图像处理",
  "design/tools": "设计工具",

  // 开发子分类
  frameworks: "开发框架",
  apis: "API 工具",
  cloud: "云服务",
  containers: "容器技术",
  databases: "数据库",
  git: "版本控制",
  hosting: "托管服务",
  monitoring: "监控工具",
  security: "安全工具",
  "development/tools": "开发工具",

  // 媒体子分类
  "media/audio": "音频工具",

  // 办公子分类
  "office/documents": "文档处理",
  "office/pdf": "PDF 工具",

  // 运营子分类
  "operation/ecommerce": "电商工具",
  "operation/marketing": "营销工具",

  // 效率子分类
  browsers: "浏览器",
  "cloud-storage": "云存储",
  "productivity/documents": "文档处理",
  email: "邮箱服务",
  "productivity/pdf": "PDF 工具",
  search: "搜索引擎",
  "system-tools": "系统工具",

  // 视频子分类
  editing: "视频编辑",
};

/**
 * 获取分类显示名称
 */
export function getCategoryDisplayName(categoryId: string): string {
  // 首先尝试直接匹配
  if (CATEGORY_DISPLAY_NAMES[categoryId]) {
    return CATEGORY_DISPLAY_NAMES[categoryId];
  }

  // 如果是子分类路径（包含/），尝试匹配最后一部分
  if (categoryId.includes("/")) {
    const parts = categoryId.split("/");
    const lastPart = parts[parts.length - 1];
    if (CATEGORY_DISPLAY_NAMES[lastPart]) {
      return CATEGORY_DISPLAY_NAMES[lastPart];
    }
  }

  // 如果都没有匹配到，返回原始ID
  return categoryId;
}

/**
 * 基于 links-data.json 生成分类数据（服务端专用）
 */
export async function generateCategoriesFromFiles(): Promise<LinkCategory[]> {
  const categories: LinkCategory[] = [];

  try {
    // 从 links-data.json 读取数据
    const linksFilePath = path.join(process.cwd(), "src/components/links/links-data.json");
    const fileContent = await fs.readFile(linksFilePath, "utf8");
    const items: LinksItem[] = JSON.parse(fileContent);

    // 按分类分组
    const categoryMap: { [key: string]: { items: LinksItem[]; children: Set<string> } } = {};

    // 处理每个项目
    items.forEach((item) => {
      const categoryId = item.category;

      // 如果分类不存在，初始化它
      if (!categoryMap[categoryId]) {
        categoryMap[categoryId] = { items: [], children: new Set() };
      }

      // 添加项目到分类
      categoryMap[categoryId].items.push(item);

      // 如果是子分类（包含/），确保父分类也被记录
      if (categoryId.includes("/")) {
        const parentCategory = categoryId.split("/")[0];
        if (!categoryMap[parentCategory]) {
          categoryMap[parentCategory] = { items: [], children: new Set() };
        }
        categoryMap[parentCategory].children.add(categoryId);
      }
    });

    // 构建分类结构
    Object.keys(categoryMap).forEach((categoryId) => {
      const categoryData = categoryMap[categoryId];

      // 只处理根分类（不包含/的分类）
      if (!categoryId.includes("/")) {
        const children = Array.from(categoryData.children).map((childId) => {
          const childData = categoryMap[childId];
          // 对于中文分类，子分类名称应该是斜杠后部分
          let childName = getCategoryDisplayName(childId);
          if (childName === childId && childId.includes("/")) {
            // 如果没有找到映射且包含斜杠，使用斜杠后部分作为名称
            childName = childId.split("/")[1];
          }
          return {
            id: childId as CategoryId,
            name: childName,
            count: childData ? childData.items.length : 0,
          };
        });

        // 对于中文分类，父分类名称就是分类ID本身
        let parentName = getCategoryDisplayName(categoryId);
        if (parentName === categoryId) {
          // 如果没有找到映射，直接使用分类ID作为名称
          parentName = categoryId;
        }

        categories.push({
          id: categoryId as CategoryId,
          name: parentName,
          count: categoryData.items.length,
          children: children.length > 0 ? children : undefined,
        });
      }
    });

    return categories;
  } catch (error) {
    console.error("Error generating categories from links data:", error);
    return [];
  }
}
