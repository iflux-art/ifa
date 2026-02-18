import type { MetadataRoute } from "next";
import { SITE_METADATA } from "@/config";

/**
 * Robots.txt 配置
 * 指导搜索引擎爬虫行为
 *
 * @see https://nextjs.org/docs/app/api-reference/functions/generate-metadata#robots
 */
export default function robots(): MetadataRoute.Robots {
	const baseUrl = SITE_METADATA.url;

	return {
		rules: {
			userAgent: "*",
			allow: "/",
			disallow: ["/api/", "/_next/", "/404", "/500"],
		},
		sitemap: `${baseUrl}/sitemap.xml`,
	};
}
