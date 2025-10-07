"use client";

import { TwikooComment } from "@/components/comment";
import {
  DEFAULT_FRIENDS_CONFIG,
  hasFriendsData,
  processFriendsData,
  type FriendLink,
  type FriendsPageConfig,
} from "@/components/friends";
import { FriendLinkApplication } from "./friend-link-application";
import { FriendLinkCard } from "./link-card";
import { cn } from "@/lib/utils";

// 创建一个可重用的网格容器组件
const GridContainer = ({ children }: { children: React.ReactNode }) => (
  <div className="grid grid-cols-12 gap-4 sm:gap-6">
    {/* 左侧空列 - 占2列 */}
    <div className="hidden md:col-span-2 lg:col-span-2 xl:col-span-2 md:block"></div>

    {/* 主内容区域 - 占8列 */}
    <div className="col-span-12 md:col-span-8 lg:col-span-8 xl:col-span-8">
      {children}
    </div>

    {/* 右侧空列 - 占2列 */}
    <div className="hidden md:col-span-2 lg:col-span-2 xl:col-span-2 md:block"></div>
  </div>
);

interface FriendsPageContainerProps {
  /** 友链数据 */
  friendsData: unknown[];
  /** 友链页面配置，可选，使用默认配置 */
  config?: Partial<FriendsPageConfig>;
  /** 自定义类名 */
  className?: string;
}

/**
 * 友链页面容器组件
 *
 * 整合友链列表展示、申请表单和评论功能的完整页面组件。
 * 从原始 friends 页面中提取的业务逻辑，遵循项目架构分离原则。
 */
export const FriendsPageContainer = ({
  friendsData,
  config: partialConfig = {},
  className = "",
}: FriendsPageContainerProps) => {
  // 合并配置
  const config: FriendsPageConfig = {
    ...DEFAULT_FRIENDS_CONFIG,
    ...partialConfig,
    application: {
      ...DEFAULT_FRIENDS_CONFIG.application,
      ...partialConfig.application,
    },
  };

  // 处理友链数据
  const friendsItems: FriendLink[] = processFriendsData(friendsData);

  // 如果没有友链数据，显示空状态
  if (!hasFriendsData(friendsItems)) {
    return (
      <div className="min-h-screen bg-background w-full">
        <div className="container mx-auto px-4 py-4">
          <div className="flex min-h-[50vh] items-center justify-center">
            <div className="text-center">
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
        </div>
      </div>
    );
  }

  return (
    <div className={cn("min-h-screen bg-background w-full", className)}>
      <div className="container mx-auto px-4 py-4">
        <div className="pb-8">
          {/* 友链列表网格 */}
          <GridContainer>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
          </GridContainer>

          {/* 友链申请版块 */}
          <GridContainer>
            <div className="mt-8">
              <FriendLinkApplication config={config} />
            </div>
          </GridContainer>

          {/* 评论区 */}
          {config.showComments && (
            <GridContainer>
              <div className="mt-12">
                <TwikooComment />
              </div>
            </GridContainer>
          )}
        </div>
      </div>
    </div>
  );
};
