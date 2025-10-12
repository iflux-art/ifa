"use client";

import { Sparkles } from "lucide-react";

// 主页配置
const HOME_CONFIG = {
  title: "iFluxArt · 斐流艺创",
  hero: {
    title: "斐启智境，流韵新生",
    subtitle: "探索 AI 与艺术的无限可能，分享技术与创意的完美结合",
  },
} as const;

// 背景装饰组件
const BackgroundDecorations = () => (
  <>
    <div className="absolute inset-0 bg-[size:50px_50px] bg-grid-white/[0.01] dark:bg-grid-white/[0.01]" />
    <div className="-translate-x-1/2 absolute top-1/4 left-1/2 h-[1000px] w-[1000px] animate-pulse rounded-full bg-gradient-to-r from-primary/30 via-transparent to-primary/30 opacity-30 blur-3xl dark:from-primary/20 dark:to-primary/20 dark:opacity-20" />
    <div
      className="absolute top-20 left-20 h-20 w-20 animate-bounce rounded-full bg-primary/25 blur-xl dark:bg-primary/10"
      style={{ animationDelay: "0s", animationDuration: "3s" }}
    />
    <div
      className="absolute top-40 right-32 h-16 w-16 animate-bounce rounded-full bg-purple-500/25 blur-xl dark:bg-purple-500/10"
      style={{ animationDelay: "1s", animationDuration: "4s" }}
    />
    <div
      className="absolute bottom-32 left-1/4 h-24 w-24 animate-bounce rounded-full bg-blue-500/25 blur-xl dark:bg-blue-500/10"
      style={{ animationDelay: "2s", animationDuration: "5s" }}
    />
  </>
);

export const HeroSection = () => {
  return (
    <section className="relative flex h-[calc(100vh-4rem)] items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background to-muted/30">
      {/* 背景装饰 */}
      <BackgroundDecorations />

      <div className="container relative mx-auto px-4 py-6">
        <div className="mx-auto max-w-5xl text-center">
          <div className="mb-3">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-5 py-1.5 font-medium text-primary text-sm backdrop-blur-sm">
              <Sparkles className="h-4 w-4 animate-spin" />
              {HOME_CONFIG.title}
            </div>
            <h1 className="mb-5 font-bold text-5xl leading-tight tracking-tight lg:text-7xl">
              <span className="bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
                {HOME_CONFIG.hero.title}
              </span>
            </h1>
            <p className="mx-auto max-w-3xl text-muted-foreground text-xl leading-relaxed lg:text-2xl">
              {HOME_CONFIG.hero.subtitle}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
