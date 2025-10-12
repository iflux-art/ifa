import { type NextRequest, NextResponse } from "next/server";
import { performServerSearch } from "@/components/search/server-search";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query");
    const limit = Number.parseInt(searchParams.get("limit") ?? "10", 10);

    if (!query) {
      return NextResponse.json({ error: "Query parameter is required" }, { status: 400 });
    }

    const searchResponse = await performServerSearch(query, "blog", limit);

    // 直接返回搜索结果，无需转换
    return NextResponse.json(searchResponse.results);
  } catch (error) {
    console.error("Error searching blog posts:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
