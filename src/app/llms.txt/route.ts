import { getAllPosts } from "@/components/features/posts/lib";
import { SITE_METADATA } from "@/config";

/**
 * LLMs.txt 配置
 * 为 AI/LLM 提供结构化的站点信息，便于读取和分析
 *
 * @see https://llmstxt.dottxt
 */
export const dynamic = "force-dynamic";

export async function GET() {
	const baseUrl = SITE_METADATA.url;

	// 获取所有博客文章
	const posts = await getAllPosts();

	// 生成内容分类
	const categories = new Set<string>();
	posts.forEach((post) => {
		if (post.category) {
			categories.add(post.category);
		}
	});

	// 生成标签列表
	const tags = new Set<string>();
	for (const post of posts) {
		if (post.tags && Array.isArray(post.tags)) {
			for (const tag of post.tags) {
				tags.add(tag);
			}
		}
	}

	// 构建 LLMs.txt 内容
	const llmsContent = `# Site: ${SITE_METADATA.title}
# Description: ${SITE_METADATA.description}
# Author: ${SITE_METADATA.author}
# URL: ${baseUrl}
# Sitemap: ${baseUrl}/sitemap.xml
# Generated: ${new Date().toISOString()}

## 站点介绍

${SITE_METADATA.title} - ${SITE_METADATA.description}

这是一个技术博客站点，主要分享前端开发、人工智能、广告创意等相关内容。

## 站点结构

- 首页: ${baseUrl}
- 博客文章列表: ${baseUrl}/posts
- 博客分类: ${baseUrl}/posts (按分类筛选)
- 友链页面: ${baseUrl}/friends

## 可用端点

### RSS/Atom 订阅
- Feed: ${baseUrl}/feed.xml

### API 端点
- 博客文章: ${baseUrl}/api/blog/posts
- 博客标签: ${baseUrl}/api/blog/tags
- 博客时间线: ${baseUrl}/api/blog/timeline
- 搜索: ${baseUrl}/api/search

### 其他端点
- 站点地图: ${baseUrl}/sitemap.xml
-  robots.txt: ${baseUrl}/robots.txt

## 内容分类

${Array.from(categories)
	.map((cat) => `- ${cat}`)
	.join("\n")}

## 热门标签

${Array.from(tags)
	.slice(0, 30)
	.map((tag) => `- ${tag}`)
	.join("\n")}

## 最近文章

${posts
	.slice(0, 20)
	.map((post) => {
		const postUrl = `${baseUrl}/posts/${post.slug}`;
		const date = post.date
			? new Date(post.date).toLocaleDateString("zh-CN")
			: "未知日期";
		return `- ${post.title} (${date}) - ${postUrl}`;
	})
	.join("\n")}

## 内容说明

此站点使用 Next.js App Router 构建，内容存储为 MDX 格式。

### AI/LLM 友好说明

1. 所有博客文章均采用 Markdown/MDX 格式，易于解析
2. 文章包含标题、日期、分类、标签等元数据
3. 支持 RSS 订阅，便于内容同步
4. 提供 API 端点用于数据获取
5. 建议使用 /feed.xml 订阅完整内容
6. 搜索功能可通过 /api/search 访问
7. 提供 OpenAPI 文档便于 AI 发现 API 端点
8. 提供 MCP 工具定义支持 AI Agent 调用
`;

	return new Response(llmsContent, {
		headers: {
			"Content-Type": "text/plain; charset=utf-8",
			"Cache-Control": "public, max-age=3600, s-maxage=86400",
		},
	});
}
