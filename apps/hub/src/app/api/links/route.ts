import { type NextRequest, NextResponse } from "next/server";
import type { LinksItem } from "@/components/links/links-types";
import { LinkFileServiceImpl } from "@/components/links-admin/services/link-file-service";
import { setCacheHeaders } from "@/lib/api/cache-utils";

// 创建文件服务实例（仅在服务器端）
const linkFileService = new LinkFileServiceImpl();

// 添加缓存变量
let cachedLinksData: LinksItem[] | null = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5分钟缓存

export async function GET() {
  try {
    // 检查缓存是否有效
    const now = Date.now();
    if (cachedLinksData && now - cacheTimestamp < CACHE_DURATION) {
      // 使用缓存数据
      return NextResponse.json(cachedLinksData);
    }

    // 通过文件服务获取数据
    const items = await linkFileService.readLinks();

    // 更新缓存
    cachedLinksData = items;
    cacheTimestamp = now;

    // 设置缓存控制头
    const headers = setCacheHeaders("semiStatic");
    return NextResponse.json(items, { headers });
  } catch (error) {
    console.error("Error in links API:", error);
    return NextResponse.json(
      {
        error: "Failed to read links data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 通过文件服务创建新链接
    const newItem = await linkFileService.addLink(body);

    // 清除缓存
    cachedLinksData = null;

    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    console.error("Error creating item:", error);

    // 处理特定错误类型
    if (error instanceof Error) {
      if (error.message.includes("Missing required fields")) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
      if (error.message.includes("URL already exists")) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
    }

    return NextResponse.json(
      {
        error: "Failed to create item",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing item ID" }, { status: 400 });
    }

    const body = await request.json();

    // 通过文件服务更新链接
    const updatedItem = await linkFileService.updateLink(id, body);

    if (!updatedItem) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    // 清除缓存
    cachedLinksData = null;

    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error("Error updating item:", error);

    // 处理特定错误类型
    if (error instanceof Error) {
      if (error.message.includes("Missing required fields")) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
      if (error.message.includes("URL already exists")) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
    }

    return NextResponse.json(
      {
        error: "Failed to update item",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing item ID" }, { status: 400 });
    }

    // 通过文件服务删除链接
    const success = await linkFileService.deleteLink(id);

    if (!success) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    // 清除缓存
    cachedLinksData = null;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting item:", error);
    return NextResponse.json(
      {
        error: "Failed to delete item",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
