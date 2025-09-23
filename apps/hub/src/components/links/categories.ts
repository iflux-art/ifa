/**
 * 链接分类相关功能
 * 提供链接分类的生成和管理能力
 */

import { type Dirent, promises as fs } from "node:fs";
import path from "node:path";
import type { CategoryId, LinksItem } from "./types";

/**
 * 链接分类接口
 */
export interface LinkCategory {
  id: string;
  name: string;
  count: number;
  children?: LinkCategory[];
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
 * 处理根目录下的 JSON 文件
 */
async function _processRootFiles(
  _contentDir: string,
  _categories: LinkCategory[],
): Promise<void> {
  try {
    // 不再处理根目录下的 JSON 文件，因为所有文件都在子目录中
    console.log(
      "Skipping root files processing as all files are in subdirectories",
    );
  } catch (error) {
    console.error("Error reading root directory:", error);
  }
}

/**
 * 处理子文件夹
 */
async function processSubdirectory(
  dir: Dirent,
  contentDir: string,
): Promise<LinkCategory | null> {
  const subDirPath = path.join(contentDir, dir.name);
  const subEntries = await fs.readdir(subDirPath, { withFileTypes: true });
  const jsonFiles = subEntries.filter(
    (entry) => entry.isFile() && entry.name.endsWith(".json"),
  );

  const children: LinkCategory[] = [];

  for (const file of jsonFiles) {
    try {
      const filePath = path.join(subDirPath, file.name);
      const fileContent = await fs.readFile(filePath, "utf-8");
      const items: LinksItem[] = JSON.parse(fileContent);
      const categoryId = `${dir.name}/${path.basename(file.name, ".json")}`;

      children.push({
        id: categoryId,
        name: getCategoryDisplayName(path.basename(file.name, ".json")),
        count: items.length,
      });
    } catch (error) {
      console.error(`Error processing file ${file.name}:`, error);
    }
  }

  if (children.length > 0) {
    const totalCount = children.reduce((sum, child) => sum + child.count, 0);
    return {
      id: dir.name,
      name: getCategoryDisplayName(dir.name),
      count: totalCount,
      children,
    };
  }

  return null;
}

/**
 * 处理子文件夹中的分类
 */
async function processSubdirectories(
  contentDir: string,
  categories: LinkCategory[],
): Promise<void> {
  const entries = await fs.readdir(contentDir, { withFileTypes: true });
  const directories = entries.filter((entry) => entry.isDirectory());

  for (const dir of directories) {
    const category = await processSubdirectory(dir, contentDir);
    if (category) {
      categories.push(category);
    }
  }
}

/**
 * 基于文件夹结构生成分类数据
 */
export async function generateCategoriesFromFiles(): Promise<LinkCategory[]> {
  const contentDir = path.join(process.cwd(), "src/content");
  const categories: LinkCategory[] = [];

  try {
    // 读取子文件夹中的分类
    await processSubdirectories(contentDir, categories);

    return categories;
  } catch (error) {
    console.error("Error generating categories:", error);
    return [];
  }
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

/**
 * 加载所有链接数据
 */
export async function loadAllLinksData(_cacheKey = ""): Promise<LinksItem[]> {
  try {
    const contentDir = path.join(process.cwd(), "src/content");
    const allItems: LinksItem[] = [];

    // 读取所有分类目录
    const entries = await fs.readdir(contentDir, { withFileTypes: true });
    const directories = entries.filter((entry) => entry.isDirectory());

    // 遍历每个分类目录
    for (const dir of directories) {
      const categoryDir = path.join(contentDir, dir.name);
      const categoryEntries = await fs.readdir(categoryDir, {
        withFileTypes: true,
      });
      const jsonFiles = categoryEntries.filter(
        (entry) => entry.isFile() && entry.name.endsWith(".json"),
      );

      // 读取每个分类目录下的JSON文件
      for (const file of jsonFiles) {
        try {
          const filePath = path.join(categoryDir, file.name);
          const fileContent = await fs.readFile(filePath, "utf-8");
          const items: LinksItem[] = JSON.parse(fileContent);

          // 为每个项目添加完整的分类ID和唯一ID
          const categoryId =
            `${dir.name}/${path.basename(file.name, ".json")}` as CategoryId;
          const itemsWithCategory = items.map((item, index) => {
            // 生成全局唯一ID，结合文件路径和原始ID
            const uniqueId = `${categoryId}-${item.id || index}`;
            return {
              ...item,
              id: uniqueId,
              category: categoryId,
            };
          });

          allItems.push(...itemsWithCategory);
        } catch (error) {
          console.error(`Error reading file ${file.name}:`, error);
        }
      }
    }

    return allItems;
  } catch (error) {
    console.error("Error loading all links data:", error);
    return [];
  }
}
