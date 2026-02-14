import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/**
 * WebSocket 升级请求处理
 *
 * 注意: Next.js API Routes 不直接支持 WebSocket。
 * 如需 WebSocket 支持，请使用以下方案：
 * 1. Vercel: 使用第三方服务如 Pusher 或 Ably
 * 2. 独立部署: 使用独立的 WebSocket 服务器
 *
 * 此端点返回 501 表示功能未实现。
 */
export function GET(request: NextRequest) {
	// 检查是否是WebSocket升级请求
	if (request.headers.get("upgrade") !== "websocket") {
		return new NextResponse("Expected WebSocket upgrade", { status: 426 });
	}

	// Next.js API 路由不直接支持 WebSocket
	return new NextResponse(
		"WebSocket is not supported in Next.js API Routes. Consider using a third-party service like Pusher or Ably.",
		{ status: 501 },
	);
}
