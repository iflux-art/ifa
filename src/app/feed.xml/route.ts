import { getAllPosts } from "@/components/features/posts/lib";
import { SITE_METADATA } from "@/config";

/**
 * RSS/Atom Feed 配置
 * 提供 RSS 2.0 格式的订阅源
 *
 * @see https://www.rssboard.org/rss-specification
 */
export const dynamic = "force-dynamic";

/**
 * XML 实体转义
 */
function escapeXml(unsafe: string): string {
	return unsafe
		.replace(/&/g, "\u0026amp;")
		.replace(/</g, "\u0026lt;")
		.replace(/>/g, "\u0026gt;")
		.replace(/"/g, "\u0026quot;")
		.replace(/'/g, "\u0026apos;");
}

/**
 * 生成 RSS 2.0 格式
 */
function generateRss2(
	posts: Array<{
		slug: string;
		title: string;
		description?: string;
		date?: string;
		category?: string;
		tags?: string[];
	}>,
) {
	const baseUrl = SITE_METADATA.url;
	const pubDate = new Date().toUTCString();

	const items = posts
		.map((post) => {
			const postUrl = `${baseUrl}/posts/${post.slug}`;
			const postDate = post.date ? new Date(post.date).toUTCString() : pubDate;
			const categories = post.category
				? `<category>${escapeXml(post.category)}</category>\n\t\t`
				: "";
			const tags = post.tags
				? post.tags
						.map((tag) => `<category>${escapeXml(tag)}</category>`)
						.join("\n\t\t")
				: "";

			return `	<item>
		<title>${escapeXml(post.title)}</title>
		<link>${postUrl}</link>
		<guid isPermaLink="true">${postUrl}</guid>
		<pubDate>${postDate}</pubDate>
		<description><![CDATA[${post.description || ""}]]></description>
		${categories}${tags}
	</item>`;
		})
		.join("\n");

	return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
	<channel>
		<title>${escapeXml(SITE_METADATA.title)}</title>
		<link>${baseUrl}</link>
		<description>${escapeXml(SITE_METADATA.description)}</description>
		<language>zh-CN</language>
		<lastBuildDate>${pubDate}</lastBuildDate>
		<atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml"/>
		<generator>iFluxArt Blog RSS Generator</generator>
		<managingEditor>${SITE_METADATA.author}</managingEditor>
${items}
	</channel>
</rss>`;
}

export async function GET() {
	const posts = await getAllPosts();

	// 只获取已发布的文章
	const publishedPosts = posts
		.filter((post) => post.status === "published" || !post.status)
		.sort((a, b) => {
			const dateA = a.date ? new Date(a.date).getTime() : 0;
			const dateB = b.date ? new Date(b.date).getTime() : 0;
			return dateB - dateA;
		})
		.slice(0, 50);

	return new Response(generateRss2(publishedPosts), {
		headers: {
			"Content-Type": "application/rss+xml; charset=utf-8",
			"Cache-Control": "public, max-age=3600, s-maxage=86400",
			"X-Content-Type-Options": "nosniff",
		},
	});
}
