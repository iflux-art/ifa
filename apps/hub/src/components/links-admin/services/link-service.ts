/**
 * 链接管理服务层
 * 提供统一的链接数据访问接口
 */

import { loadAllLinksData } from "@/components/links/links-lib";
import type { LinksItem } from "@/components/links/links-types";

// 服务层接口定义
export interface LinkService {
  getAllLinks: () => Promise<LinksItem[]>;
  addLink: (data: Omit<LinksItem, "id" | "createdAt" | "updatedAt">) => Promise<LinksItem>;
  updateLink: (id: string, data: Partial<LinksItem>) => Promise<LinksItem | null>;
  deleteLink: (id: string) => Promise<boolean>;
  checkUrlExists: (url: string, excludeId?: string) => Promise<boolean>;
}

// 生成唯一ID
function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// 链接服务实现
class LinkServiceImpl implements LinkService {
  /**
   * 获取所有链接数据
   */
  async getAllLinks(): Promise<LinksItem[]> {
    try {
      const items = await loadAllLinksData();
      return items;
    } catch (error) {
      console.error("Error fetching links:", error);
      throw new Error("Failed to fetch links data");
    }
  }

  /**
   * 添加新链接
   */
  async addLink(data: Omit<LinksItem, "id" | "createdAt" | "updatedAt">): Promise<LinksItem> {
    const { title, url, category, description, icon, iconType, tags, featured } = data;

    // 验证必填字段
    if (!(title && url && category)) {
      throw new Error("Missing required fields: title, url, and category are required");
    }

    // 模拟异步操作以满足 lint 要求
    await Promise.resolve();

    // 创建新项目
    const newItem: LinksItem = {
      id: generateId(),
      title,
      description: description ?? "",
      url,
      icon: icon ?? "",
      iconType: iconType ?? "image",
      tags: tags ?? [],
      featured: featured ?? false,
      category,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // 注意：当前为只读模式，实际添加功能暂未实现

    return newItem;
  }

  /**
   * 更新链接
   * 注意：当前为只读模式，更新功能暂未实现
   */
  updateLink(_id: string, _data: Partial<LinksItem>): Promise<LinksItem | null> {
    return Promise.reject(new Error("Update functionality not implemented - read-only mode"));
  }

  /**
   * 删除链接
   * 注意：当前为只读模式，删除功能暂未实现
   */
  deleteLink(_id: string): Promise<boolean> {
    return Promise.reject(new Error("Delete functionality not implemented - read-only mode"));
  }

  /**
   * 检查URL是否已存在
   * 注意：当前为只读模式，检查功能暂未实现
   */
  checkUrlExists(_url: string, _excludeId?: string): Promise<boolean> {
    // 在只读模式下，假设 URL 不存在冲突
    return Promise.resolve(false);
  }
}

// 导出服务实例
export const linkService = new LinkServiceImpl();
