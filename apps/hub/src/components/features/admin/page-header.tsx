/**
 * 管理页面标题组件
 * 显示页面标题和项目计数
 */

import { memo } from "react";
import type { PageHeaderProps } from "./types";

export const PageHeader = memo(({ itemCount }: PageHeaderProps) => (
  <div className="mb-8">
    <h1 className="font-bold text-3xl tracking-tight">网址管理</h1>
    <p className="mt-2 text-muted-foreground">
      管理网站导航中的所有网址，当前共有 {itemCount} 个网址
    </p>
  </div>
));

PageHeader.displayName = "PageHeader";
