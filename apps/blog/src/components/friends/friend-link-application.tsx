"use client";

import { ExternalLink, HandHeart } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// 内联类型定义，保持组件独立性
export interface FriendLinkFormConfig {
  /** 友链申请表单URL */
  formUrl: string;
  /** 表单标题 */
  title?: string;
  /** 表单描述 */
  description?: string;
}

export interface FriendsPageConfig {
  /** 友链申请表单配置 */
  application: FriendLinkFormConfig;
  /** 是否显示评论区 */
  showComments?: boolean;
}

interface FriendLinkApplicationProps {
  /** 友链页面配置 */
  config?: FriendsPageConfig;
  /** 自定义类名 */
  className?: string;
}

/**
 * 友链表单URL配置
 */
const FRIEND_LINK_FORM_URL =
  "https://ocnzi0a8y98s.feishu.cn/share/base/form/shrcnB0sog9RdZVM8FLJNXVsFFb";

/**
 * 默认友链页面配置
 */
const DEFAULT_FRIENDS_CONFIG: FriendsPageConfig = {
  application: {
    formUrl: FRIEND_LINK_FORM_URL,
    title: "申请友情链接",
    description: "如果您的网站内容优质、更新活跃，欢迎申请友链！",
  },
  showComments: true,
};

/**
 * 友链申请卡片组件
 * 简化版，采用类似博客文章卡片的样式
 */
export const FriendLinkApplication = ({
  config = DEFAULT_FRIENDS_CONFIG,
  className = "",
}: FriendLinkApplicationProps) => {
  const { application } = config;

  return (
    <div className={cn("mt-8", className)}>
      <Card
        className={cn(
          "group h-full overflow-hidden border transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10",
          "touch-manipulation"
        )}
      >
        <div className="flex h-full">
          {/* 左侧内容区域 */}
          <div className="flex flex-1 flex-col p-5 md:p-6">
            {/* 标题 */}
            <h2 className="mb-2 font-bold text-lg leading-tight transition-colors group-hover:text-primary sm:mb-3 sm:text-xl">
              {application.title}
            </h2>

            {/* 描述 */}
            <p className="mb-3 line-clamp-2 text-muted-foreground text-sm leading-relaxed sm:mb-4">
              {application.description}
            </p>

            {/* 推动底部按钮的间隔 */}
            <div className="flex-1" />

            {/* 底部按钮 */}
            <Link
              href={application.formUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-fit"
            >
              <Button
                variant="secondary"
                size="sm"
                className="group mt-2 px-3 text-sm transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                点击申请
                <ExternalLink className="ml-1 h-4 w-4 transition-transform" />
              </Button>
            </Link>
          </div>

          {/* 右侧图标区域 */}
          <div
            className="relative hidden flex-shrink-0 overflow-hidden rounded-r-[calc(var(--radius)-1px)] bg-gradient-to-br from-primary/5 via-background to-primary/10 lg:flex lg:items-center lg:justify-center"
            style={{ width: "50%", minWidth: "120px" }}
          >
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
              <HandHeart className="h-10 w-10 text-primary" />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
