import "./globals.css";
import { ThemeProvider } from "@iflux-art/ui/client";
import { Footer } from "@iflux-art/ui/footer";
import { MainNavbar } from "@/components/navbar";
import { generateMetadata, generateViewport } from "@/lib/metadata";

export const metadata = generateMetadata();
export const viewport = generateViewport();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head />
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex flex-col min-h-screen">
            <MainNavbar className="flex-shrink-0" />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
