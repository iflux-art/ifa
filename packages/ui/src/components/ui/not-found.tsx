"use client";

import { Home } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { useId } from "react";
import { BackButton } from "./back-button";
import { Button } from "./button/button";

export const metadata: Metadata = {
  title: "404 - 页面未找到",
  description: "抱歉，您访问的页面不存在或已被移除。",
};

export interface NotFoundProps {
  /**
   * 错误代码，默认为 '404'
   */
  code?: string;
  /**
   * 错误标题
   */
  title?: string;
  /**
   * 错误描述
   */
  description?: string;
  /**
   * 返回按钮文本
   */
  buttonText?: string;
  /**
   * 返回链接地址
   */
  backUrl?: string;
  /**
   * 自定义类名
   */
  className?: string;
  /**
   * 是否显示图标
   */
  showIcon?: boolean;
}

const DEFAULT_TEXTS = {
  code: "404",
  title: "页面未找到",
  description: "抱歉，您访问的页面不存在或已被移除。",
  buttonText: "返回首页",
  backUrl: "/",
} as const;

/**
 * 通用404页面组件
 * 符合404页面设计规范，使用通用的布局和组件
 */
export const NotFound: React.FC<NotFoundProps> = ({
  code = DEFAULT_TEXTS.code,
  title = DEFAULT_TEXTS.title,
  description = DEFAULT_TEXTS.description,
  buttonText = DEFAULT_TEXTS.buttonText,
  backUrl = DEFAULT_TEXTS.backUrl,
  className = "",
  showIcon = true,
}) => {
  const errorTitleId = useId();

  return (
    <div
      className={`flex min-h-[70vh] flex-col items-center justify-center p-4 text-center ${className}`}
    >
      <h1 id={errorTitleId} className="text-9xl font-bold text-primary">
        {code}
      </h1>

      <hr className="my-6 h-0.5 w-full max-w-md bg-muted" />

      <h2 className="mb-4 text-3xl font-bold">{title}</h2>

      <p className="mb-8 max-w-md text-lg text-muted-foreground">
        {description}
      </p>

      <div className="flex flex-wrap justify-center gap-4">
        <Button asChild size="lg">
          <Link href={backUrl} className="flex items-center gap-2">
            {showIcon && <Home className="h-4 w-4" aria-hidden="true" />}
            {buttonText}
          </Link>
        </Button>

        <BackButton />
      </div>
    </div>
  );
};
