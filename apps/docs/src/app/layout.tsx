import './globals.css'
import { Footer } from '@/components'
import { MainNavbar } from '@/features/navbar/components'
import { generateMetadata, generateViewport } from '@/features/seo'
import { ThemeProvider } from '@/features/theme/theme-provider'

// 导出元数据配置 - Next.js会在构建时处理这些导出
export const metadata = generateMetadata()
export const viewport = generateViewport()

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
      </ThemeProvider>
    </body>
  </html>
)

export default RootLayout
