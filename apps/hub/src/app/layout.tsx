import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import type React from "react";
import { ChunkLoadErrorBoundary } from "@/components/error-boundary";
import { GlobalErrorHandler } from "@/components/global-error-handler";
import { Footer } from "@/components/layout";
import { MainNavbar } from "@/components/navbar/main-navbar";
import { PerformanceInitializer } from "@/components/performance-initializer";
import { ThemeProvider } from "@/components/theme";
import { SITE_METADATA } from "@/config";

// 直接使用 Next.js 的 Metadata API 构建元数据，简化 SEO 配置
export const metadata: Metadata = {
  title: SITE_METADATA.title,
  description: SITE_METADATA.description,
  keywords: [...SITE_METADATA.keywords],
  authors: [{ name: SITE_METADATA.author }],
  creator: SITE_METADATA.author,
  publisher: SITE_METADATA.author,
  metadataBase: new URL(SITE_METADATA.url),
  openGraph: {
    type: "website",
    locale: SITE_METADATA.locale,
    url: SITE_METADATA.url,
    title: SITE_METADATA.title,
    description: SITE_METADATA.description,
    siteName: SITE_METADATA.title,
    images: [
      {
        url: SITE_METADATA.image,
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
    images: [SITE_METADATA.image],
    creator: SITE_METADATA.twitter,
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 2,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <ClerkProvider>
    <html
      lang="zh-CN"
      // 禁用hydration warning提示 - next-themes要求
      suppressHydrationWarning
    >
      <head />
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <PerformanceInitializer />
          <GlobalErrorHandler />
          <ChunkLoadErrorBoundary>
            {/* 页面主体布局容器 */}
            <div className="flex flex-col">
              <MainNavbar className="flex-shrink-0" />
              {/* 主内容区域 */}
              <main>{children}</main>
              <Footer />
            </div>
          </ChunkLoadErrorBoundary>
        </ThemeProvider>
      </body>
    </html>
  </ClerkProvider>
);

export default RootLayout;
