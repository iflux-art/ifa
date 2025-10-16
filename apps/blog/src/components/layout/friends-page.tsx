"use client";

import type { Metadata } from "next";
import { TwikooComment } from "@/components/features/comment";
import { FriendLinkApplication } from "@/components/features/friends/friend-link-application";
import { FriendLinkCard } from "@/components/features/friends/link-card";
import type { FriendLink } from "@/components/features/friends/types";
import { cn } from "@/lib/utils";

// 页面元数据
export const metadata: Metadata = {
  title: "友情链接",
  description: "友情链接列表和申请方式",
  keywords: "友链,网站,合作",
  openGraph: {
    title: "友情链接",
    description: "友情链接列表和申请方式",
    type: "website",
  },
};

interface FriendsPageProps {
  /** 友链数据 */
  friendsData: unknown[];
  /** 自定义类名 */
  className?: string;
}

/**
 * 处理友链数据，转换为标准格式
 * @param friendsData 原始友链数据
 * @returns 处理后的友链数据
 */
function processFriendsData(friendsData: unknown[]): FriendLink[] {
  return friendsData.map((item) => {
    const friendItem = item as FriendLink & {
      iconType?: "image" | "text";
      createdAt?: string;
      updatedAt?: string;
    };

    return {
      ...friendItem,
      category: "friends" as const,
      iconType: friendItem.iconType ?? "image",
    };
  });
}

/**
 * 检查是否有友链数据
 * @param friendsItems 友链数据
 * @returns 是否有数据
 */
function hasFriendsData(friendsItems: FriendLink[]): boolean {
  return friendsItems.length > 0;
}

/**
 * 友链页面组件
 *
 * 整合友链列表展示、申请表单和评论功能的完整页面组件。
 * 从原始 friends 页面中提取的业务逻辑，遵循项目架构分离原则。
 */
export const FriendsPage = ({ friendsData, className = "" }: FriendsPageProps) => {
  // 处理友链数据
  const friendsItems: FriendLink[] = processFriendsData(friendsData);

  // 如果没有友链数据，显示空状态
  if (!hasFriendsData(friendsItems)) {
    return (
      <div className="min-h-screen w-full bg-background">
        <div className="container mx-auto px-4 py-4">
          <div className="flex min-h-[50vh] items-center justify-center">
            <div className="text-center">
              <h1 className="mb-4 font-extrabold text-4xl tracking-tight lg:text-5xl">友情链接</h1>
              <p className="mb-4 text-muted-foreground">暂无友情链接</p>
              <FriendLinkApplication />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("min-h-screen w-full bg-background", className)}>
      <div className="container mx-auto px-4 py-4">
        <div className="pb-8">
          <div className="grid grid-cols-12 gap-4 sm:gap-6">
            {/* 左侧空列 - 占2列，只在xl和2xl断点下显示 */}
            <div className="hidden xl:col-span-2 xl:block"></div>

            {/* 主内容区域 - 在小屏幕上占12列，在xl及以上占8列 */}
            <div className="col-span-12 xl:col-span-8">
              {/* 友链列表网格 */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
                {friendsItems.map((item) => (
                  <FriendLinkCard
                    key={item.id}
                    title={item.title}
                    description={item.description || item.url}
                    href={item.url}
                    icon={item.icon}
                    iconType={item.iconType}
                    isExternal
                    className="h-full"
                  />
                ))}
              </div>

              {/* 友链申请版块 */}
              <div className="mt-8">
                <FriendLinkApplication />
              </div>

              {/* 评论区 */}
              <div className="mt-8">
                <TwikooComment />
              </div>
            </div>

            {/* 右侧空列 - 占2列，只在xl和2xl断点下显示 */}
            <div className="hidden xl:col-span-2 xl:block"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FriendsPage;
