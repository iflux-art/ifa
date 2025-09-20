import { Button, GitHubButton, ThemeToggle, TravelButton } from "@iflux-art/ui";
import type { Metadata } from "next";

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
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">UI 组件展示</h1>
        <p className="text-lg text-muted-foreground">
          用于展示和测试 @iflux-art/ui 组件库中的所有组件
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* 按钮组件展示 */}
        <div className="bg-card rounded-lg border p-6">
          <h2 className="text-2xl font-semibold mb-4">按钮组件</h2>
          <div className="flex flex-wrap gap-4">
            <Button>默认按钮</Button>
            <Button variant="destructive">危险按钮</Button>
            <Button variant="outline">轮廓按钮</Button>
            <Button variant="secondary">次要按钮</Button>
            <Button variant="ghost">幽灵按钮</Button>
            <Button variant="link">链接按钮</Button>
          </div>
        </div>

        {/* 图标按钮展示 */}
        <div className="bg-card rounded-lg border p-6">
          <h2 className="text-2xl font-semibold mb-4">图标按钮</h2>
          <div className="flex flex-wrap gap-4">
            <GitHubButton />
            <TravelButton />
            <ThemeToggle />
          </div>
        </div>

        {/* 不同尺寸的按钮 */}
        <div className="bg-card rounded-lg border p-6">
          <h2 className="text-2xl font-semibold mb-4">按钮尺寸</h2>
          <div className="flex flex-wrap items-center gap-4">
            <Button size="sm">小按钮</Button>
            <Button size="default">默认按钮</Button>
            <Button size="lg">大按钮</Button>
            <Button size="icon">图标按钮</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
