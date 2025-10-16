import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import type React from "react";
import { ChunkLoadErrorBoundary, Footer, GlobalErrorHandler, MainNavbar } from "@/components";
import { ThemeProvider } from "@/components/theme";
import { SITE_METADATA } from "@/config";

export const metadata: Metadata = {
  title: SITE_METADATA.title,
  description: SITE_METADATA.description,
  authors: [{ name: SITE_METADATA.author }],
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
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
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
