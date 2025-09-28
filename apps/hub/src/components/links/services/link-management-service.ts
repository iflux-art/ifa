/**
 * 链接管理客户端服务
 * 提供与链接管理API交互的客户端接口
 */

import { del, get, post, put } from "@/lib/api";
import { CONTENT_API_PATHS } from "@/lib/api/api-paths";
import type { LinksCategory, LinksItem } from "../types";

// 链接管理服务接口
export interface LinkManagementService {
  fetchLinksData: () => Promise<{
    categories: LinksCategory[];
    items: LinksItem[];
  }>;
  fetchCategories: () => Promise<LinksCategory[]>;
  fetchTags: () => Promise<string[]>;
  createLink: (
    data: Omit<LinksItem, "id" | "createdAt" | "updatedAt">,
  ) => Promise<LinksItem>;
  updateLink: (id: string, data: Partial<LinksItem>) => Promise<LinksItem>;
  deleteLink: (id: string) => Promise<boolean>;
  writeLinksData: (data: {
    categories: LinksCategory[];
    items: LinksItem[];
  }) => Promise<void>;
}

// 链接管理服务实现
class LinkManagementServiceImpl implements LinkManagementService {
  /**
   * 获取所有链接数据
   */
  async fetchLinksData(): Promise<{
    categories: LinksCategory[];
    items: LinksItem[];
  }> {
    try {
      const data = await get<{
        categories: LinksCategory[];
        items: LinksItem[];
      }>(`${CONTENT_API_PATHS.Links}/manage?action=data`);
      return data;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "Unknown error");
    }
  }

  /**
   * 获取分类数据
   */
  async fetchCategories(): Promise<LinksCategory[]> {
    try {
      const data = await get<LinksCategory[]>(
        `${CONTENT_API_PATHS.Links}/manage?action=categories`,
      );
      return data;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "Unknown error");
    }
  }

  /**
   * 获取所有标签
   */
  async fetchTags(): Promise<string[]> {
    try {
      const data = await get<string[]>(
        `${CONTENT_API_PATHS.Links}/manage?action=tags`,
      );
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
      const newItem = await post<LinksItem>(
        `${CONTENT_API_PATHS.Links}/manage`,
        { action: "add", data },
      );
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
        `${CONTENT_API_PATHS.Link(id)}?id=${id}`,
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
      await del<{ success: boolean }>(`${CONTENT_API_PATHS.Link(id)}?id=${id}`);
      return true;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "Unknown error");
    }
  }

  /**
   * 写入链接数据
   */
  async writeLinksData(data: {
    categories: LinksCategory[];
    items: LinksItem[];
  }): Promise<void> {
    try {
      await post(`${CONTENT_API_PATHS.Links}/manage`, {
        action: "write",
        data,
      });
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "Unknown error");
    }
  }
}

// 导出服务实例
export const linkManagementService = new LinkManagementServiceImpl();
