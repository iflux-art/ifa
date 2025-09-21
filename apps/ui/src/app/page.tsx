import { Button, GitHubButton, ThemeToggle, TravelButton, Footer, COPYRIGHT_TEXT } from "@iflux-art/ui";
import type { Metadata } from "next";
import Link from "next/link";
import { useId } from "react";

// 页面元数据
export const metadata: Metadata = {
  title: "UI 组件展示",
  description: "用于展示和测试 @iflux-art/ui 组件库的 Next.js 应用",
  openGraph: {
    title: "UI 组件展示",
    description: "用于展示和测试 @iflux-art/ui 组件库的 Next.js 应用",
    type: "website",
    url: "https://iflux.art",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "UI 组件展示",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "UI 组件展示",
    description: "用于展示和测试 @iflux-art/ui 组件库的 Next.js 应用",
    images: ["/images/og-image.png"],
  },
};

export default function Home() {
  const buttonsId = useId();
  const layoutId = useId();
  const footerId = useId();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">UI 组件展示</h1>
        <p className="text-lg text-muted-foreground">
          用于展示和测试 @iflux-art/ui 组件库中的所有组件
        </p>
      </div>

      {/* 按钮组件展示 */}
      <div id={buttonsId} className="mb-12 bg-card rounded-lg border p-6">
        <h2 className="text-2xl font-semibold mb-4">按钮组件</h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-3">基础按钮</h3>
            <div className="flex flex-wrap gap-4">
              <Button>默认按钮</Button>
              <Button variant="destructive">危险按钮</Button>
              <Button variant="outline">轮廓按钮</Button>
              <Button variant="secondary">次要按钮</Button>
              <Button variant="ghost">幽灵按钮</Button>
              <Button variant="link">链接按钮</Button>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-3">图标按钮</h3>
            <div className="flex flex-wrap gap-4">
              <GitHubButton />
              <TravelButton />
              <ThemeToggle />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-3">不同尺寸</h3>
            <div className="flex flex-wrap items-center gap-4">
              <Button size="sm">小按钮</Button>
              <Button size="default">默认按钮</Button>
              <Button size="lg">大按钮</Button>
              <Button size="icon">图标按钮</Button>
            </div>
          </div>
        </div>
      </div>

      {/* 布局组件展示 */}
      <div id={layoutId} className="mb-12 bg-card rounded-lg border p-6">
        <h2 className="text-2xl font-semibold mb-4">布局组件</h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-3">网格布局组件</h3>
            <div className="space-y-4">
              <p>GridLayout 组件支持四种布局类型：</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>full-width</strong>: 宽布局，主内容占满12列
                </li>
                <li>
                  <strong>narrow</strong>: 窄布局，主内容居中显示在8列中
                </li>
                <li>
                  <strong>three-column</strong>:
                  三栏布局，左右侧栏各占2列，主内容占8列
                </li>
                <li>
                  <strong>two-column</strong>:
                  双栏布局，左侧栏占2列，主内容占10列
                </li>
              </ul>
              <p>
                更多详细信息请查看{" "}
                <a
                  href="/grid-layout-demo"
                  className="text-primary hover:underline"
                >
                  网格布局演示页面
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 页脚组件展示 */}
      <div id={footerId} className="mb-12 bg-card rounded-lg border p-6">
        <h2 className="text-2xl font-semibold mb-4">页脚组件</h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-3">Footer 组件</h3>
            <div className="flex flex-wrap gap-4">
              <Footer />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-3">COPYRIGHT_TEXT 常量</h3>
            <div className="flex flex-wrap gap-4">
              <p className="text-sm text-muted-foreground">{COPYRIGHT_TEXT}</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-3">版权文本测试页面</h3>
            <div className="flex flex-wrap gap-4">
              <Link href="/copyright-test" className="text-primary hover:underline">
                前往版权文本测试页面
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}