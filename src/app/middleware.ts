import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export default function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;
	const response = NextResponse.next();

	// 基础安全头
	response.headers.set("X-Frame-Options", "SAMEORIGIN");
	response.headers.set("X-Content-Type-Options", "nosniff");
	response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

	// 静态资源缓存
	if (
		/\.(js|css|png|jpg|jpeg|gif|webp|svg|woff|woff2)$/.test(pathname) ||
		pathname.startsWith("/_next/static/")
	) {
		response.headers.set("Cache-Control", "public, max-age=86400");
	}

	// API 路由短缓存
	if (pathname.startsWith("/api/")) {
		response.headers.set("Cache-Control", "public, max-age=60");
	}

	return response;
}

export const config = {
	matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
