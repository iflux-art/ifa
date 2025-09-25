"use client";

import { Sparkles } from "lucide-react";
import { HOME_CONFIG } from "@/components/home";
import { BackgroundDecorations } from "@/components/home/background-decorations";

export const HeroSection = () => {
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
              {HOME_CONFIG.title}
            </div>
            <h1 className="mb-5 text-5xl leading-tight font-bold tracking-tight lg:text-7xl">
              <span className="bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
                {HOME_CONFIG.hero.title}
              </span>
            </h1>
            <p className="mx-auto max-w-3xl text-xl leading-relaxed text-muted-foreground lg:text-2xl">
              {HOME_CONFIG.hero.subtitle}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
