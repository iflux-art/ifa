/**
 * 链接管理服务层
 * 提供统一的链接数据访问接口
 */

import type { LinksItem } from "@/components/links/links-types";
import { linkDataService } from "./link-data-service";

// 服务层接口定义
export interface LinkService {
  getAllLinks: () => Promise<LinksItem[]>;
  addLink: (data: Omit<LinksItem, "id" | "createdAt" | "updatedAt">) => Promise<LinksItem>;
  updateLink: (id: string, data: Partial<LinksItem>) => Promise<LinksItem | null>;
  deleteLink: (id: string) => Promise<boolean>;
  checkUrlExists: (url: string, excludeId?: string) => Promise<boolean>;
}

// 链接服务实现
class LinkServiceImpl implements LinkService {
  /**
   * 获取所有链接数据
   */
  async getAllLinks(): Promise<LinksItem[]> {
    try {
      const items = await linkDataService.fetchLinks();
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
    try {
      const newItem = await linkDataService.createLink(data);
      return newItem;
    } catch (error) {
      console.error("Error adding link:", error);
      throw error;
    }
  }

  /**
   * 更新链接
   */
  async updateLink(id: string, data: Partial<LinksItem>): Promise<LinksItem | null> {
    try {
      const updatedItem = await linkDataService.updateLink(id, data);
      return updatedItem;
    } catch (error) {
      console.error("Error updating link:", error);
      throw error;
    }
  }

  /**
   * 删除链接
   */
  async deleteLink(id: string): Promise<boolean> {
    try {
      const result = await linkDataService.deleteLink(id);
      return result;
    } catch (error) {
      console.error("Error deleting link:", error);
      throw error;
    }
  }

  /**
   * 检查URL是否已存在
   */
  async checkUrlExists(_url: string, _excludeId?: string): Promise<boolean> {
    try {
      // URL检查功能在linkDataService中未实现，这里简单返回false
      // 在实际应用中，您可能需要实现这个功能
      console.warn("URL existence check not implemented in linkDataService");
      // 添加一个微任务以满足 async/await 要求
      await Promise.resolve();
      return false;
    } catch (error) {
      console.error("Error checking URL existence:", error);
      // 如果检查失败，假设URL不存在以避免阻止用户操作
      return false;
    }
  }
}

// 导出服务实例
export const linkService = new LinkServiceImpl();
