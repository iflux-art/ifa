import type { Metadata } from "next";
import { LazyFeaturedLinks, LazyHeroSection } from "@/components/home/lazy-components";

// ==================== SEO配置 ====================
const SEO_CONFIG = {
  title: "首页",
  description: "iFluxArt · 斐流艺创 - 智能技术与艺术创作的有机融合，探索AI与艺术的无限可能",
  type: "website" as const,
};

// 页面元数据
export const metadata: Metadata = {
  title: SEO_CONFIG.title,
  description: SEO_CONFIG.description,
  openGraph: {
    title: SEO_CONFIG.title,
    description: SEO_CONFIG.description,
    type: SEO_CONFIG.type,
    url: "https://iflux.art",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: SEO_CONFIG.title,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_CONFIG.title,
    description: SEO_CONFIG.description,
    images: ["/images/og-image.png"],
  },
};

export default function Home() {
  return (
    <>
      {/* Hero区域 - 懒加载 */}
      <LazyHeroSection />

      {/* 特色链接 - 懒加载 */}
      <LazyFeaturedLinks />
    </>
  );
}
