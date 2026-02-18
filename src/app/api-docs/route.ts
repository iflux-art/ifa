import { getAllPosts } from "@/components/features/posts/lib";
import { SITE_METADATA } from "@/config";

/**
 * OpenAPI 规范文档
 * 提供符合 OpenAPI 3.0 规范的 API 文档，便于 AI Agent 发现和调用
 *
 * @see https://swagger.io/specification/
 */
export const dynamic = "force-dynamic";

/**
 * 生成 OpenAPI 规范
 */
function generateOpenApiSpec() {
	const baseUrl = SITE_METADATA.url;

	return {
		openapi: "3.0.3",
		info: {
			title: `${SITE_METADATA.title} API`,
			description: `${SITE_METADATA.description} - 提供博客文章、标签、搜索等功能的 API 接口`,
			version: "1.0.0",
			contact: {
				name: SITE_METADATA.author,
			},
		},
		servers: [
			{
				url: baseUrl,
				description: "当前服务器",
			},
		],
		paths: {
			"/api/blog/posts": {
				get: {
					summary: "获取博客文章列表",
					description: "获取所有博客文章的列表，支持分页",
					parameters: [
						{
							name: "page",
							in: "query",
							description: "页码",
							schema: {
								type: "integer",
								default: 1,
							},
						},
						{
							name: "limit",
							in: "query",
							description: "每页数量",
							schema: {
								type: "integer",
								default: 10,
							},
						},
					],
					responses: {
						"200": {
							description: "成功获取博客文章列表",
							content: {
								"application/json": {
									schema: {
										type: "object",
										properties: {
											posts: {
												type: "array",
												items: {
													$ref: "#/components/schemas/BlogPost",
												},
											},
											total: {
												type: "integer",
											},
											page: {
												type: "integer",
											},
										},
									},
								},
							},
						},
					},
				},
			},
			"/api/blog/tags": {
				get: {
					summary: "获取所有标签",
					description: "获取博客中使用的所有标签",
					responses: {
						"200": {
							description: "成功获取标签列表",
							content: {
								"application/json": {
									schema: {
										type: "object",
										properties: {
											tags: {
												type: "array",
												items: {
													type: "string",
												},
											},
										},
									},
								},
							},
						},
					},
				},
			},
			"/api/blog/tags/{tag}": {
				get: {
					summary: "获取指定标签的文章",
					description: "获取使用指定标签的博客文章",
					parameters: [
						{
							name: "tag",
							in: "path",
							required: true,
							description: "标签名称",
							schema: {
								type: "string",
							},
						},
					],
					responses: {
						"200": {
							description: "成功获取指定标签的文章",
							content: {
								"application/json": {
									schema: {
										type: "array",
										items: {
											$ref: "#/components/schemas/BlogPost",
										},
									},
								},
							},
						},
					},
				},
			},
			"/api/blog/timeline": {
				get: {
					summary: "获取博客时间线",
					description: "按年份获取博客文章时间线",
					responses: {
						"200": {
							description: "成功获取时间线",
							content: {
								"application/json": {
									schema: {
										type: "object",
										additionalProperties: {
											type: "array",
											items: {
												$ref: "#/components/schemas/BlogPost",
											},
										},
									},
								},
							},
						},
					},
				},
			},
			"/api/search": {
				get: {
					summary: "搜索博客",
					description: "搜索博客文章",
					parameters: [
						{
							name: "q",
							in: "query",
							required: true,
							description: "搜索关键词",
							schema: {
								type: "string",
							},
						},
					],
					responses: {
						"200": {
							description: "成功搜索",
							content: {
								"application/json": {
									schema: {
										type: "array",
										items: {
											$ref: "#/components/schemas/BlogPost",
										},
									},
								},
							},
						},
					},
				},
			},
			"/posts": {
				get: {
					summary: "博客文章列表页面",
					description: "获取博客文章列表的 HTML 页面",
					responses: {
						"200": {
							description: "成功获取页面",
							content: {
								"text/html": {
									schema: {
										type: "string",
									},
								},
							},
						},
					},
				},
			},
			"/posts/{slug}": {
				get: {
					summary: "博客文章详情页面",
					description: "获取单篇博客文章的 HTML 页面",
					parameters: [
						{
							name: "slug",
							in: "path",
							required: true,
							description: "文章 slug",
							schema: {
								type: "string",
							},
						},
					],
					responses: {
						"200": {
							description: "成功获取文章",
							content: {
								"text/html": {
									schema: {
										type: "string",
									},
								},
							},
						},
					},
				},
			},
			"/friends": {
				get: {
					summary: "友链页面",
					description: "获取友链页面的 HTML",
					responses: {
						"200": {
							description: "成功获取页面",
							content: {
								"text/html": {
									schema: {
										type: "string",
									},
								},
							},
						},
					},
				},
			},
			"/llms.txt": {
				get: {
					summary: "LLMs.txt 文件",
					description: "获取站点信息文档，便于 AI/LLM 读取",
					responses: {
						"200": {
							description: "成功获取 LLMs.txt",
							content: {
								"text/plain": {
									schema: {
										type: "string",
									},
								},
							},
						},
					},
				},
			},
			"/feed.xml": {
				get: {
					summary: "RSS 订阅源",
					description: "获取 RSS 2.0 格式的订阅源",
					responses: {
						"200": {
							description: "成功获取 RSS 订阅",
							content: {
								"application/rss+xml": {
									schema: {
										type: "string",
									},
								},
							},
						},
					},
				},
			},
		},
		components: {
			schemas: {
				BlogPost: {
					type: "object",
					description: "博客文章",
					properties: {
						slug: {
							type: "string",
							description: "文章 slug",
						},
						title: {
							type: "string",
							description: "文章标题",
						},
						description: {
							type: "string",
							description: "文章描述",
						},
						date: {
							type: "string",
							description: "发布日期 (ISO 8601)",
						},
						category: {
							type: "string",
							description: "文章分类",
						},
						tags: {
							type: "array",
							items: {
								type: "string",
							},
							description: "文章标签",
						},
					},
				},
			},
		},
	};
}

export async function GET() {
	const spec = generateOpenApiSpec();

	return new Response(JSON.stringify(spec, null, 2), {
		headers: {
			"Content-Type": "application/json; charset=utf-8",
			"Cache-Control": "public, max-age=3600, s-maxage=86400",
		},
	});
}
