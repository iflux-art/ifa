"use client";

import { LinkCard } from "@/components/cards";
import profileData from "./profile.json";

// 定义个人资料链接类型
interface ProfileLink {
  id: string;
  title: string;
  url: string;
  description?: string;
  icon?: string;
  iconType?: "image" | "text";
}

export const FeaturedLinks = () => {
  // 处理个人资料数据，转换为 ProfileLink 格式
  const profileItems: ProfileLink[] = (
    profileData as unknown as ProfileLink[]
  ).map((item) => {
    return {
      ...item,
      iconType: item.iconType ?? "image",
    };
  });

  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="mb-8 text-center text-3xl font-bold">关注我们</h2>
        <p className="mb-12 text-center text-lg text-muted-foreground">
          在以下平台关注我们，获取最新动态
        </p>

        {profileItems.length > 0 && (
          <div className="grid grid-cols-12 gap-4 items-stretch">
            {profileItems.map((item) => (
              <div
                key={item.id}
                className="
                  col-span-12
                  sm:col-span-6
                  md:col-span-3
                  lg:col-span-2
                "
              >
                <LinkCard
                  title={item.title}
                  description={item.description || item.url}
                  href={item.url}
                  icon={item.icon}
                  isExternal={true}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
