import type { Metadata } from "next";
import { GridLayout } from "@iflux-art/ui/layout";
import { TwikooComment } from "@iflux-art/ui/client";
import { FriendLinkApplication, FriendLinkCard } from "@/components/friends";
import friendsData from "@/components/friends/friends.json";
import {
  DEFAULT_FRIENDS_CONFIG,
  hasFriendsData,
  processFriendsData,
} from "@/components/friends/lib";
import type { FriendLink } from "@/components/friends/types";

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

const FriendsPage = () => {
  // 处理友链数据
  const friendsItems: FriendLink[] = processFriendsData(friendsData);
  const config = DEFAULT_FRIENDS_CONFIG;

  // 如果没有友链数据，显示空状态
  if (!hasFriendsData(friendsItems)) {
    return (
      <GridLayout layoutType="narrow">
        <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight lg:text-5xl">
            友情链接
          </h1>
          <p className="mb-4 text-muted-foreground">暂无友情链接</p>
          <a
            href={config.application.formUrl}
            target="_blank"
            rel="noreferrer"
            className="text-primary hover:underline"
          >
            申请友链
          </a>
        </div>
      </GridLayout>
    );
  }

  return (
    <GridLayout layoutType="narrow">
      {/* 友链列表 - 直接在GridLayout主内容区域中布局 */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
        {friendsItems.map((item) => (
          <FriendLinkCard
            key={item.url}
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
      <FriendLinkApplication config={config} />

      {/* 评论区 */}
      {config.showComments && (
        <div className="mt-8">
          <TwikooComment />
        </div>
      )}
    </GridLayout>
  );
};

export default FriendsPage;
