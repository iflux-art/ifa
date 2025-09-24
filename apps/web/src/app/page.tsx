import type { Metadata } from "next";
import { HOME_CONFIG } from "@/components/home";
import { FeaturedLinks } from "@/components/home";
import { HeroSection } from "@/components/home";
import profileData from "@/components/home/profile.json";
import type { ProfileLink } from "@/components/home/link-card";

// 页面元数据
export const metadata: Metadata = {
  title: HOME_CONFIG.seo.title,
  description: HOME_CONFIG.seo.description,
  openGraph: {
    title: HOME_CONFIG.seo.title,
    description: HOME_CONFIG.seo.description,
    type: HOME_CONFIG.seo.type,
    url: "https://iflux.art",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: HOME_CONFIG.seo.title,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: HOME_CONFIG.seo.title,
    description: HOME_CONFIG.seo.description,
    images: ["/images/og-image.png"],
  },
};

// 处理个人资料数据，确保 iconType 类型正确
const processedProfileData: ProfileLink[] = profileData.map((item) => ({
  ...item,
  iconType:
    item.iconType && (item.iconType === "image" || item.iconType === "text")
      ? item.iconType
      : undefined,
}));

export default function Home() {
  return (
    <>
      {/* Hero区域 */}
      <HeroSection />

      {/* 特色链接 */}
      <FeaturedLinks profileData={processedProfileData} />
    </>
  );
}
