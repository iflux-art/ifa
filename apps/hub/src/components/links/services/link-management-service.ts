/**
 * 链接管理客户端服务
 * 提供与链接管理API交互的客户端接口
 */

import { del, get, post, put } from "@/lib/api/api-client";
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
    const { data, error } = await get<{
      categories: LinksCategory[];
      items: LinksItem[];
    }>(`${CONTENT_API_PATHS.Links}/manage?action=data`);

    if (error) {
      throw new Error(error);
    }

    return data;
  }

  /**
   * 获取分类数据
   */
  async fetchCategories(): Promise<LinksCategory[]> {
    const { data, error } = await get<LinksCategory[]>(
      `${CONTENT_API_PATHS.Links}/manage?action=categories`,
    );

    if (error) {
      throw new Error(error);
    }

    return data;
  }

  /**
   * 获取所有标签
   */
  async fetchTags(): Promise<string[]> {
    const { data, error } = await get<string[]>(
      `${CONTENT_API_PATHS.Links}/manage?action=tags`,
    );

    if (error) {
      throw new Error(error);
    }

    return data;
  }

  /**
   * 创建新链接
   */
  async createLink(
    data: Omit<LinksItem, "id" | "createdAt" | "updatedAt">,
  ): Promise<LinksItem> {
    const { data: newItem, error } = await post<LinksItem>(
      `${CONTENT_API_PATHS.Links}/manage`,
      { action: "add", data },
    );

    if (error) {
      throw new Error(error);
    }

    return newItem;
  }

  /**
   * 更新链接
   */
  async updateLink(id: string, data: Partial<LinksItem>): Promise<LinksItem> {
    const { data: updatedItem, error } = await put<LinksItem>(
      `${CONTENT_API_PATHS.Link(id)}?id=${id}`,
      data,
    );

    if (error) {
      throw new Error(error);
    }

    return updatedItem;
  }

  /**
   * 删除链接
   */
  async deleteLink(id: string): Promise<boolean> {
    const { data, error } = await del<{ success: boolean }>(
      `${CONTENT_API_PATHS.Link(id)}?id=${id}`,
    );

    if (error) {
      throw new Error(error);
    }

    return data.success;
  }

  /**
   * 写入链接数据
   */
  async writeLinksData(data: {
    categories: LinksCategory[];
    items: LinksItem[];
  }): Promise<void> {
    const { error } = await post(`${CONTENT_API_PATHS.Links}/manage`, {
      action: "write",
      data,
    });

    if (error) {
      throw new Error(error);
    }
  }
}

// 导出服务实例
export const linkManagementService = new LinkManagementServiceImpl();
