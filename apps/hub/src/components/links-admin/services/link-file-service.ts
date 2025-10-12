/**
 * 链接文件服务
 * 提供直接读写 links-data.json 文件的功能
 * 注意：此服务仅通过API路由调用，不直接在客户端或服务端组件中使用
 */

import type { LinksItem } from "@/components/links/links-types";

// 生成唯一ID
function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// 链接文件服务接口
export interface LinkFileService {
  readLinks: () => Promise<LinksItem[]>;
  writeLinks: (links: LinksItem[]) => Promise<void>;
  addLink: (data: Omit<LinksItem, "id" | "createdAt" | "updatedAt">) => Promise<LinksItem>;
  updateLink: (id: string, data: Partial<LinksItem>) => Promise<LinksItem | null>;
  deleteLink: (id: string) => Promise<boolean>;
  checkUrlExists: (url: string, excludeId?: string) => Promise<boolean>;
}

// 链接文件服务实现 - 仅在API路由中使用
export class LinkFileServiceImpl implements LinkFileService {
  private filePath: string;

  constructor() {
    // 在服务器端使用绝对路径
    this.filePath = require("node:path").join(
      process.cwd(),
      "src",
      "components",
      "links",
      "links-data.json"
    );
  }

  /**
   * 读取所有链接
   */
  async readLinks(): Promise<LinksItem[]> {
    try {
      const fs = require("node:fs");
      const fileContent = await fs.promises.readFile(this.filePath, "utf8");
      const links: LinksItem[] = JSON.parse(fileContent);
      return links;
    } catch (error) {
      console.error("Error reading links data:", error);
      throw new Error("Failed to read links data");
    }
  }

  /**
   * 写入所有链接
   */
  async writeLinks(links: LinksItem[]): Promise<void> {
    try {
      const fs = require("node:fs");
      // 格式化JSON并写入文件
      const formattedData = JSON.stringify(links, null, 2);
      await fs.promises.writeFile(this.filePath, formattedData, "utf8");
    } catch (error) {
      console.error("Error writing links data:", error);
      throw new Error("Failed to write links data");
    }
  }

  /**
   * 添加新链接
   */
  async addLink(data: Omit<LinksItem, "id" | "createdAt" | "updatedAt">): Promise<LinksItem> {
    const { title, url, category, description, icon, iconType, tags } = data;

    // 验证必填字段
    if (!(title && url && category)) {
      throw new Error("Missing required fields: title, url, and category are required");
    }

    // 检查URL是否已存在
    const existingLinks = await this.readLinks();
    const urlExists = existingLinks.some((link) => link.url === url);
    if (urlExists) {
      throw new Error("URL already exists");
    }

    // 创建新项目
    const newItem: LinksItem = {
      id: generateId(),
      title,
      description: description ?? "",
      url,
      icon: icon ?? "",
      iconType: iconType ?? "image",
      tags: tags ?? [],
      category,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // 添加到现有链接并保存
    const updatedLinks = [...existingLinks, newItem];
    await this.writeLinks(updatedLinks);

    return newItem;
  }

  /**
   * 更新链接
   */
  async updateLink(id: string, data: Partial<LinksItem>): Promise<LinksItem | null> {
    const existingLinks = await this.readLinks();
    const index = existingLinks.findIndex((link) => link.id === id);

    if (index === -1) {
      return null;
    }

    // 更新项目
    const updatedItem: LinksItem = {
      ...existingLinks[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };

    // 更新链接数组
    const updatedLinks = [...existingLinks];
    updatedLinks[index] = updatedItem;

    // 保存更新后的数据
    await this.writeLinks(updatedLinks);

    return updatedItem;
  }

  /**
   * 删除链接
   */
  async deleteLink(id: string): Promise<boolean> {
    const existingLinks = await this.readLinks();
    const initialLength = existingLinks.length;
    const updatedLinks = existingLinks.filter((link) => link.id !== id);

    // 如果没有删除任何项目，返回false
    if (updatedLinks.length === initialLength) {
      return false;
    }

    // 保存更新后的数据
    await this.writeLinks(updatedLinks);
    return true;
  }

  /**
   * 检查URL是否已存在
   */
  async checkUrlExists(url: string, excludeId?: string): Promise<boolean> {
    const existingLinks = await this.readLinks();
    return existingLinks.some(
      (link) => link.url === url && (excludeId ? link.id !== excludeId : true)
    );
  }
}

// 注意：不导出实例，而是在API路由中创建实例
// export const linkFileService = new LinkFileServiceImpl();
