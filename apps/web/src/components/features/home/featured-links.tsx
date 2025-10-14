"use client";

import { memo, useMemo } from "react";
import type { ProfileLink } from "@/types";
import { LinkCard } from "./link-card";
import profileData from "./profile.json";

export const FeaturedLinks = memo(() => {
  // 使用 useMemo 优化数据处理，避免每次渲染都重新计算
  const profileItems = useMemo<ProfileLink[]>(() => {
    return (profileData as ProfileLink[]).map((item) => ({
      ...item,
      iconType: item.iconType ?? "image",
    }));
  }, []);

  // 使用 useMemo 优化条件渲染
  const hasItems = useMemo(() => profileItems.length > 0, [profileItems.length]);

  return (
    <section className="bg-background py-12">
      <div className="container mx-auto px-4">
        <h2 className="mb-8 text-center font-bold text-3xl">关注我们</h2>
        <p className="mb-12 text-center text-lg text-muted-foreground">
          在以下平台关注我们，获取最新动态
        </p>

        {hasItems && (
          <div className="grid grid-cols-12 items-stretch gap-4">
            {profileItems.map((item) => (
              <div
                key={item.id}
                className="col-span-12 sm:col-span-12 md:col-span-4 xl:col-span-3 2xl:col-span-2"
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
});

FeaturedLinks.displayName = "FeaturedLinks";

export default FeaturedLinks;
