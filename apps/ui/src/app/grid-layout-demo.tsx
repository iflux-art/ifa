"use client";

import type { PageLayoutType } from "@iflux-art/ui";
import { Button, GridLayout } from "@iflux-art/ui";
import { useState } from "react";

export default function GridLayoutDemo() {
  const [layoutType, setLayoutType] = useState<PageLayoutType>("full-width");

  // 定义侧边栏示例内容
  const sidebars = [
    {
      id: "left-sidebar",
      position: "left" as const,
      content: (
        <div className="bg-card rounded-lg border p-4">
          <h3 className="font-bold mb-2">左侧边栏</h3>
          <p>这是左侧边栏的内容示例</p>
          <Button variant="outline" size="sm" className="mt-2">
            操作按钮
          </Button>
        </div>
      ),
    },
    {
      id: "right-sidebar",
      position: "right" as const,
      content: (
        <div className="bg-card rounded-lg border p-4">
          <h3 className="font-bold mb-2">右侧边栏</h3>
          <p>这是右侧边栏的内容示例</p>
          <Button variant="outline" size="sm" className="mt-2">
            操作按钮
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">网格布局组件演示</h1>
        <p className="text-muted-foreground">
          展示GridLayout组件支持的四种布局类型
        </p>
      </div>

      {/* 布局类型选择器 */}
      <div className="mb-8 bg-card rounded-lg border p-6">
        <h2 className="text-xl font-semibold mb-4">选择布局类型</h2>
        <div className="flex flex-wrap gap-4">
          <Button
            variant={layoutType === "full-width" ? "default" : "outline"}
            onClick={() => setLayoutType("full-width")}
          >
            宽布局 (12列)
          </Button>
          <Button
            variant={layoutType === "narrow" ? "default" : "outline"}
            onClick={() => setLayoutType("narrow")}
          >
            窄布局 (8列居中)
          </Button>
          <Button
            variant={layoutType === "three-column" ? "default" : "outline"}
            onClick={() => setLayoutType("three-column")}
          >
            三栏布局 (2+8+2)
          </Button>
          <Button
            variant={layoutType === "two-column" ? "default" : "outline"}
            onClick={() => setLayoutType("two-column")}
          >
            双栏布局 (2+10)
          </Button>
        </div>
      </div>

      {/* 布局演示区域 */}
      <GridLayout
        layoutType={layoutType}
        sidebars={
          layoutType === "three-column" || layoutType === "two-column"
            ? sidebars
            : []
        }
      >
        <div className="bg-card rounded-lg border p-6">
          <h2 className="text-2xl font-semibold mb-4">
            {layoutType === "full-width" && "宽布局 (12列)"}
            {layoutType === "narrow" && "窄布局 (8列居中)"}
            {layoutType === "three-column" && "三栏布局 (2+8+2)"}
            {layoutType === "two-column" && "双栏布局 (2+10)"}
          </h2>
          <div className="space-y-4">
            <p>
              当前使用的是{" "}
              <code className="bg-muted px-1.5 py-0.5 rounded">
                {layoutType}
              </code>{" "}
              布局类型。
            </p>

            {layoutType === "full-width" && (
              <p>宽布局占满整个容器的12列，适合需要充分利用屏幕空间的页面。</p>
            )}

            {layoutType === "narrow" && (
              <p>
                窄布局将内容居中显示在8列宽度内，适合需要聚焦注意力的页面，如文章阅读页。
              </p>
            )}

            {layoutType === "three-column" && (
              <div className="space-y-4">
                <p>三栏布局包含左右两个侧边栏，主内容区域占8列。</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>左侧边栏：占2列</li>
                  <li>主内容区域：占8列</li>
                  <li>右侧边栏：占2列</li>
                </ul>
              </div>
            )}

            {layoutType === "two-column" && (
              <div className="space-y-4">
                <p>双栏布局包含一个左侧边栏，主内容区域占10列。</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>左侧边栏：占2列</li>
                  <li>主内容区域：占10列</li>
                </ul>
              </div>
            )}

            <div className="mt-6 p-4 bg-muted rounded">
              <h3 className="font-semibold mb-2">布局特点：</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>响应式设计，在不同屏幕尺寸下自动调整</li>
                <li>支持侧边栏的粘性定位和响应式显示控制</li>
                <li>统一的间距和对齐方式</li>
              </ul>
            </div>
          </div>
        </div>
      </GridLayout>
    </div>
  );
}
