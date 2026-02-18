"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

/**
 * 全局错误页面
 * 捕获应用中的未处理错误
 *
 * @see https://nextjs.org/docs/app/building-your-application/routing/error-handling
 */
export default function GlobalError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		// 记录错误到控制台（生产环境可以发送到错误追踪服务）
		console.error("Global error:", error);
	}, [error]);

	return (
		<div className="flex min-h-screen w-full items-center justify-center bg-background">
			<div className="container mx-auto px-4">
				<div className="flex flex-col items-center justify-center text-center">
					<h2 className="font-bold text-3xl text-foreground">出现了一些问题</h2>
					<p className="mt-4 text-muted-foreground">
						抱歉，应用程序遇到了意外错误。
					</p>
					{error.digest && (
						<p className="mt-2 text-muted-foreground text-sm">
							错误摘要: {error.digest}
						</p>
					)}
					<Button onClick={() => reset()} className="mt-6" variant="default">
						重试
					</Button>
				</div>
			</div>
		</div>
	);
}
