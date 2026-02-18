import type { MetadataRoute } from "next";
import { getAllPosts } from "@/components/features/posts/lib";
import { SITE_METADATA } from "@/config";

/**
 * 站点地图配置
 * 自动生成 XML 站点地图用于 SEO
 *
 * @see https://nextjs.org/docs/app/api-reference/functions/generate-metadata#sitemap
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const baseUrl = SITE_METADATA.url;

	// 获取所有博客文章
	const posts = await getAllPosts();

	// 静态页面
	const staticPages: MetadataRoute.Sitemap = [
		{
			url: baseUrl,
			lastModified: new Date(),
			changeFrequency: "daily",
			priority: 1,
		},
		{
			url: `${baseUrl}/posts`,
			lastModified: new Date(),
			changeFrequency: "daily",
			priority: 0.8,
		},
		{
			url: `${baseUrl}/friends`,
			lastModified: new Date(),
			changeFrequency: "weekly",
			priority: 0.6,
		},
	];

	// 博客文章页面
	const blogPages: MetadataRoute.Sitemap = posts.map((post) => ({
		url: `${baseUrl}/posts/${post.slug}`,
		lastModified: post.date ? new Date(post.date) : new Date(),
		changeFrequency: "weekly" as const,
		priority: 0.7,
	}));

	return [...staticPages, ...blogPages];
}
