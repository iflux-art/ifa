import type { Metadata } from "next";
import { GridLayout } from "@iflux-art/ui/layout";
import { NotFound } from "@iflux-art/ui/not-found";

export const metadata: Metadata = {
  title: "404 - 页面未找到",
  description: "抱歉，您访问的页面不存在或已被移除。",
};

/**
 * 全局404页面
 * 符合404页面设计规范，使用通用的布局和组件
 */
export default function NotFoundPage() {
  return (
    <GridLayout layoutType="centered">
      <NotFound backUrl="https://www.iflux.art/" />
    </GridLayout>
  );
}
