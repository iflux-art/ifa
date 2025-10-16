import "./globals.css";
import type { Metadata } from "next";
import type React from "react";
import { Footer } from "@/components";
import { MainNavbar } from "@/components";
import { ThemeProvider } from "@/components";
import { SITE_METADATA } from "@/config";

export const metadata: Metadata = {
  title: SITE_METADATA.title,
  description: SITE_METADATA.description,
  authors: [{ name: SITE_METADATA.author }],
};

const RootLayout = ({ children }: { children: React.ReactNode }) => (
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
        {/* 页面主体布局容器 */}
        <div className="flex flex-col">
          <MainNavbar className="flex-shrink-0" />
          {/* 主内容区域 */}
          <main>{children}</main>
          <Footer />
        </div>
      </ThemeProvider>
    </body>
  </html>
);

export default RootLayout;
