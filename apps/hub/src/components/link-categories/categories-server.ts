/**
 * 链接分类相关功能（服务端专用）
 * 提供链接分类的生成和管理能力
 */

import { type Dirent, promises as fs } from "node:fs";
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
 * 处理根目录下的 JSON 文件
 */
async function processRootFiles(linksDir: string, categories: LinkCategory[]): Promise<void> {
  try {
    // 检查目录是否存在
    try {
      await fs.access(linksDir);
    } catch {
      console.warn(`Links directory does not exist: ${linksDir}`);
      return;
    }

    const entries = await fs.readdir(linksDir, { withFileTypes: true });
    const jsonFiles = entries.filter(
      (entry) => entry.isFile() && entry.name.endsWith(".json") && entry.name !== "friends.json"
    );

    // 并行处理所有文件
    const filePromises = jsonFiles.map(async (file) => {
      try {
        const filePath = path.join(linksDir, file.name);
        const fileContent = await fs.readFile(filePath, "utf-8");
        const items: LinksItem[] = JSON.parse(fileContent);
        const categoryId = path.basename(file.name, ".json");

        return {
          id: categoryId as CategoryId,
          name: getCategoryDisplayName(categoryId),
          count: items.length,
        };
      } catch (error) {
        console.error(`Error processing file ${file.name}:`, error);
        return null;
      }
    });

    // 等待所有文件处理完成
    const results = await Promise.all(filePromises);

    // 过滤掉处理失败的文件并添加到分类列表
    for (const result of results) {
      if (result !== null) {
        categories.push(result);
      }
    }
  } catch (error) {
    console.error("Error reading root directory:", error);
  }
}

/**
 * 处理子文件夹
 */
async function processSubdirectory(dir: Dirent, linksDir: string): Promise<LinkCategory | null> {
  const subDirPath = path.join(linksDir, dir.name);
  try {
    const subEntries = await fs.readdir(subDirPath, { withFileTypes: true });
    const jsonFiles = subEntries.filter((entry) => entry.isFile() && entry.name.endsWith(".json"));

    // 并行处理所有子分类文件
    const filePromises = jsonFiles.map(async (file) => {
      try {
        const filePath = path.join(subDirPath, file.name);
        const fileContent = await fs.readFile(filePath, "utf-8");
        const items: LinksItem[] = JSON.parse(fileContent);
        const categoryId = `${dir.name}/${path.basename(file.name, ".json")}`;

        return {
          id: categoryId as CategoryId,
          name: getCategoryDisplayName(path.basename(file.name, ".json")),
          count: items.length,
        };
      } catch (error) {
        console.error(`Error processing file ${file.name}:`, error);
        return null;
      }
    });

    // 等待所有文件处理完成
    const results = await Promise.all(filePromises);

    // 过滤掉处理失败的文件
    const childrenWithCount = results.filter(
      (result): result is { id: CategoryId; name: string; count: number } => result !== null
    );

    if (childrenWithCount.length > 0) {
      const totalCount = childrenWithCount.reduce((sum, child) => sum + child.count, 0);
      // 创建带有 children 属性的 LinkCategory 对象
      const category: LinkCategory = {
        id: dir.name as CategoryId,
        name: getCategoryDisplayName(dir.name),
        count: totalCount,
        children: childrenWithCount.map((child) => ({
          id: child.id,
          name: child.name,
          // 其他可选属性保持默认
        })),
      };
      return category;
    }
  } catch (error) {
    console.error(`Error processing subdirectory ${dir.name}:`, error);
  }

  return null;
}

/**
 * 处理子文件夹中的分类
 */
async function processSubdirectories(linksDir: string, categories: LinkCategory[]): Promise<void> {
  try {
    // 检查目录是否存在
    try {
      await fs.access(linksDir);
    } catch {
      console.warn(`Links directory does not exist: ${linksDir}`);
      return;
    }

    const entries = await fs.readdir(linksDir, { withFileTypes: true });
    const directories = entries.filter((entry) => entry.isDirectory());

    // 并行处理所有子目录
    const directoryPromises = directories.map((dir) => processSubdirectory(dir, linksDir));

    // 等待所有目录处理完成
    const results = await Promise.all(directoryPromises);

    // 过滤掉处理失败的目录并添加到分类列表
    for (const result of results) {
      if (result !== null) {
        categories.push(result);
      }
    }
  } catch (error) {
    console.error("Error processing subdirectories:", error);
  }
}

/**
 * 基于文件夹结构生成分类数据（服务端专用）
 */
export async function generateCategoriesFromFiles(): Promise<LinkCategory[]> {
  // 修复路径，使用正确的 content 目录而不是 links 子目录
  const linksDir = path.join(process.cwd(), "src/content");
  const categories: LinkCategory[] = [];

  try {
    // 检查目录是否存在
    try {
      await fs.access(linksDir);
    } catch {
      console.warn(`Links directory does not exist: ${linksDir}`);
      return categories;
    }

    // 并行处理根目录文件和子目录
    await Promise.all([
      processRootFiles(linksDir, categories),
      processSubdirectories(linksDir, categories),
    ]);

    return categories;
  } catch (error) {
    console.error("Error generating categories:", error);
    return [];
  }
}
