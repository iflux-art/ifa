import type { Metadata } from "next";
import { AppGrid, PageContainer } from "@/components/layout";
import { TwikooComment } from "@/features/comment";
import {
  FriendLinkApplication,
  FriendLinkCard,
} from "@/features/friends/components";
import friendsData from "@/features/friends/data/friends.json";
import {
  DEFAULT_FRIENDS_CONFIG,
  hasFriendsData,
  processFriendsData,
} from "@/features/friends/lib";
import type { FriendLink } from "@/features/friends/types";

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
      <PageContainer config={{ layout: "narrow" }}>
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="text-center">
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
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer config={{ layout: "narrow" }}>
      <div>
        {/* 友链列表网格 */}
        <AppGrid columns={4} className="items-stretch">
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
        </AppGrid>

        {/* 友链申请版块 */}
        <FriendLinkApplication config={config} />

        {/* 评论区 */}
        {config.showComments && (
          <div className="mt-8">
            <TwikooComment />
          </div>
        )}
      </div>
    </PageContainer>
  );
};

export default FriendsPage;
