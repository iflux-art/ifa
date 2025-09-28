/**
 * 链接数据服务
 * 提供客户端链接数据访问接口
 */

import { del, get, post, put } from "@/lib/api";
import { CONTENT_API_PATHS } from "@/lib/api/api-paths";
import type { LinksItem } from "../types";

// 链接数据服务接口
export interface LinkDataService {
  fetchLinks: () => Promise<LinksItem[]>;
  createLink: (
    data: Omit<LinksItem, "id" | "createdAt" | "updatedAt">,
  ) => Promise<LinksItem>;
  updateLink: (id: string, data: Partial<LinksItem>) => Promise<LinksItem>;
  deleteLink: (id: string) => Promise<boolean>;
}

// 链接数据服务实现
class LinkDataServiceImpl implements LinkDataService {
  /**
   * 获取所有链接
   */
  async fetchLinks(): Promise<LinksItem[]> {
    try {
      const data = await get<LinksItem[]>(CONTENT_API_PATHS.Links, {
        // 5分钟重新验证
      });
      return data;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "Unknown error");
    }
  }

  /**
   * 创建新链接
   */
  async createLink(
    data: Omit<LinksItem, "id" | "createdAt" | "updatedAt">,
  ): Promise<LinksItem> {
    try {
      const newItem = await post<LinksItem>(CONTENT_API_PATHS.Links, data);
      return newItem;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "Unknown error");
    }
  }

  /**
   * 更新链接
   */
  async updateLink(id: string, data: Partial<LinksItem>): Promise<LinksItem> {
    try {
      const updatedItem = await put<LinksItem>(
        CONTENT_API_PATHS.Link(id),
        data,
      );
      return updatedItem;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "Unknown error");
    }
  }

  /**
   * 删除链接
   */
  async deleteLink(id: string): Promise<boolean> {
    try {
      await del<{ success: boolean }>(CONTENT_API_PATHS.Link(id));
      return true;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "Unknown error");
    }
  }
}

// 导出服务实例
export const linkDataService = new LinkDataServiceImpl();
