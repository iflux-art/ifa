import { getAllPosts, getPostsByTag } from "@/components/features/posts/lib";
import { SITE_METADATA } from "@/config";

/**
 * MCP (Model Context Protocol) 工具定义
 * 提供符合 MCP 规范的 AI Agent 可调用工具
 *
 * @see https://modelcontextprotocol.io/
 */
export const dynamic = "force-dynamic";

/**
 * MCP 工具类型定义
 */
interface McpTool {
	name: string;
	description: string;
	inputSchema: {
		type: "object";
		properties: Record<string, unknown>;
		required?: string[];
	};
}

/**
 * 生成 MCP 工具列表
 */
function generateMcpTools(): McpTool[] {
	return [
		{
			name: "get_blog_posts",
			description: "获取博客文章列表。可以指定分页参数获取文章列表。",
			inputSchema: {
				type: "object",
				properties: {
					page: {
						type: "number",
						description: "页码，从 1 开始",
						default: 1,
					},
					limit: {
						type: "number",
						description: "每页文章数量，默认 10",
						default: 10,
					},
				},
			},
		},
		{
			name: "get_blog_post",
			description:
				"获取单篇博客文章的详细内容，包括标题、描述、日期、分类、标签等信息。",
			inputSchema: {
				type: "object",
				properties: {
					slug: {
						type: "string",
						description: "博客文章的 slug（路径标识符）",
					},
				},
				required: ["slug"],
			},
		},
		{
			name: "get_blog_tags",
			description: "获取博客中使用的所有标签列表。",
			inputSchema: {
				type: "object",
				properties: {},
			},
		},
		{
			name: "get_posts_by_tag",
			description: "获取使用指定标签的所有博客文章。",
			inputSchema: {
				type: "object",
				properties: {
					tag: {
						type: "string",
						description: "标签名称",
					},
				},
				required: ["tag"],
			},
		},
		{
			name: "get_blog_timeline",
			description: "获取按年份组织的博客文章时间线。",
			inputSchema: {
				type: "object",
				properties: {},
			},
		},
		{
			name: "search_blog",
			description: "搜索博客文章，通过关键词查找文章。",
			inputSchema: {
				type: "object",
				properties: {
					query: {
						type: "string",
						description: "搜索关键词",
					},
				},
				required: ["query"],
			},
		},
		{
			name: "get_site_info",
			description: "获取站点基本信息，包括标题、描述、作者、URL 等。",
			inputSchema: {
				type: "object",
				properties: {},
			},
		},
		{
			name: "get_llms_txt",
			description:
				"获取 LLMs.txt 文件内容，这是站点为 AI/LLM 提供的结构化文档。",
			inputSchema: {
				type: "object",
				properties: {},
			},
		},
		{
			name: "get_rss_feed",
			description: "获取 RSS 订阅源，包含最新的博客文章。",
			inputSchema: {
				type: "object",
				properties: {},
			},
		},
	];
}

/**
 * 处理 MCP 工具调用
 */
async function handleToolCall(
	toolName: string,
	args: Record<string, unknown>,
): Promise<unknown> {
	const baseUrl = SITE_METADATA.url;

	switch (toolName) {
		case "get_blog_posts": {
			const posts = await getAllPosts();
			const page = Number(args.page) || 1;
			const limit = Number(args.limit) || 10;
			const start = (page - 1) * limit;
			const end = start + limit;

			return {
				posts: posts.slice(start, end).map((post) => ({
					slug: post.slug,
					title: post.title,
					description: post.description,
					date: post.date,
					category: post.category,
					tags: post.tags,
					url: `${baseUrl}/posts/${post.slug}`,
				})),
				total: posts.length,
				page,
				limit,
			};
		}

		case "get_blog_post": {
			const slug = args.slug as string;
			const posts = await getAllPosts();
			const post = posts.find((p) => p.slug === slug);

			if (!post) {
				return { error: "文章未找到", slug };
			}

			return {
				slug: post.slug,
				title: post.title,
				description: post.description,
				date: post.date,
				category: post.category,
				tags: post.tags,
				url: `${baseUrl}/posts/${post.slug}`,
			};
		}

		case "get_blog_tags": {
			const posts = await getAllPosts();
			const tags = new Set<string>();

			posts.forEach((post) => {
				if (post.tags) {
					for (const tag of post.tags) {
						tags.add(tag);
					}
				}
			});

			return {
				tags: Array.from(tags).sort(),
			};
		}

		case "get_posts_by_tag": {
			const tag = args.tag as string;
			const posts = await getPostsByTag(tag);

			return {
				tag,
				posts: posts.map((post) => ({
					slug: post.slug,
					title: post.title,
					description: post.description,
					date: post.date,
					url: `${baseUrl}/posts/${post.slug}`,
				})),
			};
		}

		case "get_blog_timeline": {
			const posts = await getAllPosts();
			const timeline: Record<
				string,
				Array<{ slug: string; title: string; date: string }>
			> = {};

			posts.forEach((post) => {
				if (post.date) {
					const year = new Date(post.date).getFullYear().toString();
					if (!timeline[year]) {
						timeline[year] = [];
					}
					timeline[year].push({
						slug: post.slug,
						title: post.title,
						date: post.date,
					});
				}
			});

			return { timeline };
		}

		case "search_blog": {
			const query = args.query as string;
			const posts = await getAllPosts();
			const lowerQuery = query.toLowerCase();

			const results = posts.filter(
				(post) =>
					post.title?.toLowerCase().includes(lowerQuery) ||
					post.description?.toLowerCase().includes(lowerQuery) ||
					post.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery)),
			);

			return {
				query,
				results: results.map((post) => ({
					slug: post.slug,
					title: post.title,
					description: post.description,
					url: `${baseUrl}/posts/${post.slug}`,
				})),
				total: results.length,
			};
		}

		case "get_site_info": {
			return {
				title: SITE_METADATA.title,
				description: SITE_METADATA.description,
				author: SITE_METADATA.author,
				url: baseUrl,
			};
		}

		case "get_llms_txt": {
			return {
				message: "请访问 /llms.txt 获取 LLMs.txt 内容",
				url: `${baseUrl}/llms.txt`,
			};
		}

		case "get_rss_feed": {
			return {
				message: "请访问 /feed.xml 获取 RSS 订阅源",
				url: `${baseUrl}/feed.xml`,
			};
		}

		default:
			return { error: `未知工具: ${toolName}` };
	}
}

export async function GET() {
	// 返回工具列表
	const tools = generateMcpTools();

	return new Response(JSON.stringify({ tools }, null, 2), {
		headers: {
			"Content-Type": "application/json; charset=utf-8",
			"Cache-Control": "public, max-age=3600, s-maxage=86400",
		},
	});
}

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const { name, arguments: args } = body;

		if (!name) {
			return new Response(JSON.stringify({ error: "缺少工具名称" }), {
				status: 400,
				headers: { "Content-Type": "application/json" },
			});
		}

		const result = await handleToolCall(name, args || {});

		return new Response(JSON.stringify(result, null, 2), {
			headers: {
				"Content-Type": "application/json; charset=utf-8",
			},
		});
	} catch (error) {
		return new Response(JSON.stringify({ error: `服务器错误: ${error}` }), {
			status: 500,
			headers: { "Content-Type": "application/json" },
		});
	}
}
