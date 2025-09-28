import type { Metadata } from "next";
import type { LinkCardProps } from "@repo/ui/components/ui/card";
import { HeroSection } from "@/components/home";
import profileData from "@/components/home/profile.json";
import { LinkCard } from "@repo/ui/components/ui/card";

// 重新定义 ProfileLink 类型，与 LinkCard 组件保持一致
type ProfileLink = LinkCardProps & {
  category?: string;
  tags?: string[];
  url: string; // 添加 url 字段以匹配 profile.json 数据结构
};

// SEO 配置
const seoConfig = {
  title: "iFluxArt - 创意与技术的交汇点",
  description: "探索创意与技术的无限可能，分享前沿开发经验和设计思考",
  type: "website" as const,
};

// 页面元数据
export const metadata: Metadata = {
  title: seoConfig.title,
  description: seoConfig.description,
  openGraph: {
    title: seoConfig.title,
    description: seoConfig.description,
    type: seoConfig.type,
    url: "https://www.iflux.art",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: seoConfig.title,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: seoConfig.title,
    description: seoConfig.description,
    images: ["/images/og-image.png"],
  },
};

// 处理个人资料数据，确保 iconType 类型正确，并将 url 转换为 href
const processedProfileData: Omit<ProfileLink, "url">[] = profileData.map(
  (item) => ({
    ...item,
    href: item.url, // 将 url 转换为 href
    iconType:
      item.iconType && (item.iconType === "image" || item.iconType === "text")
        ? item.iconType
        : undefined,
  }),
);

export default function Home() {
  return (
    <>
      {/* Hero区域 */}
      <HeroSection />

      {/* 特色链接 */}
      <div className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-center text-3xl font-bold">关注我们</h2>
          <p className="mb-12 text-center text-lg text-muted-foreground">
            在以下平台关注我们，获取最新动态
          </p>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 items-stretch">
            {processedProfileData.map((item) => (
              <LinkCard
                key={item.href}
                title={item.title}
                description={item.description || item.href}
                href={item.href}
                icon={item.icon}
                iconType={item.iconType}
                isExternal={true}
                className="h-full"
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
