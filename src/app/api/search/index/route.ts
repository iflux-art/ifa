import { NextResponse } from "next/server";
import { getSearchIndex } from "@/components/features/search/local-search-index";
import { setCacheHeaders } from "@/lib/api/cache-utils";

export const revalidate = 3600; // 1小时重新验证

export async function GET() {
	try {
		const index = await getSearchIndex();

		// 设置缓存控制头
		const headers = setCacheHeaders("dynamic");

		return NextResponse.json({ index }, { headers });
	} catch (error) {
		console.error("Failed to get search index:", error);
		return NextResponse.json(
			{ error: "Failed to load search index" },
			{ status: 500 },
		);
	}
}
