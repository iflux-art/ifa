import "./globals.css";
import { ThemeProvider } from "@iflux-art/ui/client";
import { Footer } from "@iflux-art/ui/footer";
import { ClientLayout } from "@/components/client-layout";
import { MainNavbar } from "@/features/navbar/components";
import { generateMetadata, generateViewport } from "@/features/seo";

// 导出元数据配置 - Next.js会在构建时处理这些导出
export const metadata = generateMetadata();
export const viewport = generateViewport();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
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
          {/* 页面主体布局容器 */}
          <div className="flex flex-col">
            <MainNavbar className="flex-shrink-0" />
            {/* 主内容区域 */}
            <main>{children}</main>
            <Footer />
          </div>
          <ClientLayout />
        </ThemeProvider>
      </body>
    </html>
  );
}