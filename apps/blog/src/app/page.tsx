import type { Metadata } from "next";
import dynamic from "next/dynamic";

// 页面元数据
export const metadata: Metadata = {
  title: "博客",
  description: "技术分享和创作心得",
  openGraph: {
    title: "博客",
    description: "技术分享和创作心得",
    type: "website",
  },
};

// 动态导入博客页面容器组件
const BlogPageContainer = dynamic(
  () =>
    import("@/components/layout/blog-page").then(
      (mod) => mod.BlogPageContainer,
    ),
  {
    ssr: true,
    // 移除自定义加载动画，使用全局的加载状态
  },
);

export default function Home() {
  return <BlogPageContainer />;
}
