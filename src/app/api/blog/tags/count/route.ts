import { NextResponse } from "next/server";
import { getAllTagsWithCount } from "@/components/features/posts/lib";
import { setCacheHeaders } from "@/lib/api/cache-utils";

/**
 * 获取所有标签及其文章数量的 API 路由
 *
 * @returns 所有标签及其文章数量
 * @deprecated 请使用 /api/blog/tags 端点
 */
export function GET() {
	try {
		const tagCounts = getAllTagsWithCount();
		// 设置缓存控制头
		const headers = setCacheHeaders("semiStatic");
		return NextResponse.json(tagCounts, { headers });
	} catch (error) {
		console.error("获取标签统计失败:", error);
		return NextResponse.json({ error: "获取标签统计失败" }, { status: 500 });
	}
}
