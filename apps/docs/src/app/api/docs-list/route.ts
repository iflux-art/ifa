import { NextResponse } from "next/server";
import { getDocCategories, getDocDirectoryStructure } from "@/features/docs/lib";
import type { DocListItem, SidebarItem } from "@/features/docs/types";
import { setCacheHeaders } from "@/lib/api/cache-utils";

/**
 * 递归展开sidebar项目为扁平的文档列表
 */
const flattenSidebarItems = (
  items: Array<{
    title: string;
    href?: string;
    items?: SidebarItem[];
    type?: string;
    filePath?: string;
  }>,
  categoryId: string,
  docs: DocListItem[],
  parentPath = ""
): void => {
  items.forEach(item => {
    if (item.type === "page" && item.href) {
      const slug = item.filePath?.split("/").pop() ?? item.href.split("/").pop() ?? "";

      docs.push({
        slug,
        title: item.title,
        path: item.href,
        description: item.title,
        category: categoryId,
      });
    }

    if (item.items && item.items.length > 0) {
      flattenSidebarItems(
        item.items,
        categoryId,
        docs,
        parentPath + (item.filePath ? `/${item.filePath}` : "")
      );
    }
  });
};

/**
 * 获取所有文档列表的 API 路由
 *
 * @returns 所有文档的扁平化列表
 */
export function GET() {
  try {
    const categories = getDocCategories();
    const allDocs: DocListItem[] = [];

    // 遍历所有分类，获取每个分类下的文档
    categories.forEach(category => {
      const sidebarItems = getDocDirectoryStructure(`${process.cwd()}/src/content`, category.id);
      flattenSidebarItems(sidebarItems, category.id, allDocs);
    });

    // 设置缓存控制头
    const headers = setCacheHeaders("semiStatic");
    return NextResponse.json(allDocs, { headers });
  } catch (error) {
    // Failed to get document list
    return NextResponse.json(
      {
        error: "获取文档列表失败",
        details: error instanceof Error ? error.message : "未知错误",
      },
      { status: 500 }
    );
  }
}
