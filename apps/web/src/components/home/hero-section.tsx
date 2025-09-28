"use client";

import { Sparkles } from "lucide-react";
import { BackgroundDecorations } from "@/components/home/background-decorations";

export const HeroSection = () => {
  // Hero 配置
  const heroConfig = {
    title: "创意与技术的交汇点",
    subtitle: "探索无限可能，创造独特价值",
  };

  // 站点标题
  const siteTitle = "iFluxArt · 斐流艺创";

  return (
    <section className="relative flex h-[calc(100vh-4rem)] items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background to-muted/30">
      {/* 背景装饰 */}
      <BackgroundDecorations />

      <div className="relative container mx-auto px-4 py-6">
        <div className="mx-auto max-w-5xl text-center">
          {/* 标题区域 */}
          <div className="mb-3">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-5 py-1.5 text-sm font-medium text-primary backdrop-blur-sm">
              <Sparkles className="h-4 w-4 animate-spin" />
              {siteTitle}
            </div>
            <h1 className="mb-5 text-5xl leading-tight font-bold tracking-tight lg:text-7xl">
              <span className="bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
                {heroConfig.title}
              </span>
            </h1>
            <p className="mx-auto max-w-3xl text-xl leading-relaxed text-muted-foreground lg:text-2xl">
              {heroConfig.subtitle}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
