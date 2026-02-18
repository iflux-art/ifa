import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import type React from "react";
import { Footer, MainNavbar, ThemeProvider } from "@/components";
import { SITE_METADATA } from "@/config";

// 使用 next/font 优化字体加载
const inter = Inter({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-inter",
});

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	maximumScale: 5,
	themeColor: [
		{ media: "(prefers-color-scheme: light)", color: "#ffffff" },
		{ media: "(prefers-color-scheme: dark)", color: "#1a1a1a" },
	],
};

export const metadata: Metadata = {
	title: {
		default: SITE_METADATA.title,
		template: `%s | ${SITE_METADATA.title}`,
	},
	description: SITE_METADATA.description,
	authors: [{ name: SITE_METADATA.author }],
	creator: SITE_METADATA.author,
	publisher: SITE_METADATA.author,
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},
	openGraph: {
		type: "website",
		locale: "zh_CN",
		url: SITE_METADATA.url,
		siteName: SITE_METADATA.title,
		title: SITE_METADATA.title,
		description: SITE_METADATA.description,
		images: [
			{
				url: `${SITE_METADATA.url}/og-image.png`,
				width: 1200,
				height: 630,
				alt: SITE_METADATA.title,
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: SITE_METADATA.title,
		description: SITE_METADATA.description,
		creator: SITE_METADATA.author,
		images: [`${SITE_METADATA.url}/og-image.png`],
	},
	alternates: {
		canonical: SITE_METADATA.url,
		languages: {
			"zh-CN": SITE_METADATA.url,
		},
	},
	category: "technology",
	classification: "Blog",
};

// 静态生成配置 - 启用ISR增量静态再生成
// 每小时重新验证一次
// export const revalidate = 3600;

const RootLayout = ({ children }: { children: React.ReactNode }) => (
	<html
		lang="zh-CN"
		// 禁用hydration warning提示 - next-themes要求
		suppressHydrationWarning
		className={inter.variable}
	>
		<head>
			{/* Next.js 自动处理 favicon */}
			<link rel="icon" href="/favicon.ico" sizes="any" />
		</head>
		<body className={inter.className}>
			<Analytics />
			<SpeedInsights />
			<ThemeProvider
				attribute="class"
				defaultTheme="dark"
				enableSystem={false}
				disableTransitionOnChange
			>
				{/* 页面主体布局容器 */}
				<div className="flex min-h-screen flex-col">
					<MainNavbar className="sticky top-0 z-50 flex-shrink-0" />
					{/* 主内容区域 - 使用 flex-1 让 footer 固定底部 */}
					<main className="flex-1">{children}</main>
					<Footer className="flex-shrink-0" />
				</div>
			</ThemeProvider>
		</body>
	</html>
);

export default RootLayout;
