import { type NextRequest, NextResponse } from "next/server";
import { performServerSearch } from "@/components/search/server-search";

// 搜索博客文章的API路由
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query");
    const limit = Number.parseInt(searchParams.get("limit") ?? "10", 10);

    if (!query) {
      return NextResponse.json(
        { error: "Query parameter is required" },
        { status: 400 },
      );
    }

    // 使用服务器端搜索功能
    const { results: searchResults } = await performServerSearch(
      query,
      "blog",
      limit,
    );

    return NextResponse.json(searchResults);
  } catch (error) {
    console.error("Error searching blog posts:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
