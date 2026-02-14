import { NextResponse } from "next/server";
import { getPostsByYear } from "@/components/features/posts/lib";
import { setCacheHeaders } from "@/lib/api/cache-utils";

/**
 * GET 处理程序
 * 返回按年份分组的博客文章
 */
export function GET() {
	try {
		const postsByYear = getPostsByYear();
		// 设置缓存控制头
		const headers = setCacheHeaders("semiStatic");
		return NextResponse.json(postsByYear, { headers });
	} catch (error) {
		console.error("Error fetching timeline posts:", error);
		return NextResponse.json(
			{ error: "Failed to fetch timeline posts" },
			{ status: 500 },
		);
	}
}
