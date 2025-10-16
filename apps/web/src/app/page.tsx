import type { Metadata } from "next";
import { FeaturedLinks, HeroSection } from "@/components";

export const metadata: Metadata = {
  title: "首页",
  description: "智能技术与艺术创作的有机融合",
};

export default function Home() {
  return (
    <>
      {/* Hero区域 */}
      <HeroSection />

      {/* 特色链接 */}
      <FeaturedLinks />
    </>
  );
}
