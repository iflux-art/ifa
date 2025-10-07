import { type NextRequest, NextResponse } from "next/server";
import { performServerSearch } from "@/components/search/server-search";
import type { BlogSearchResult } from "@/components/posts/blog-types";
import type { SearchResult } from "@/components/search/search-types";

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

    const searchResponse = await performServerSearch(query, "blog", limit);

    // 转换 SearchResult 到 BlogSearchResult
    const searchResults: BlogSearchResult[] = searchResponse.results.map(
      (result: SearchResult, index) => ({
        id: `search-result-${index}`,
        title: result.title,
        description: result.description,
        category: undefined,
        tags: result.tags,
        date: undefined,
        url: result.path || "",
        score: result.score,
      }),
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
