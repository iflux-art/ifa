"use client";

import { memo } from "react";
import { GitHubButton, TravelButton } from "@/components/features";
import { useScroll, useScrollToTop, useIsMobile, useIsDesktop } from "@/hooks";
import { ThemeToggle } from "@/components/theme";
import { Logo } from "./logo";
import { NavListMenu } from "./nav-menu";
import { MobileMenu } from "./mobile-menu";

interface MainNavbarProps {
  className?: string;
}

export const MainNavbar = memo<MainNavbarProps>(({ className = "" }) => {
  // 使用自定义 Hook 优化滚动检测
  const isScrolled = useScroll();

  // 使用自定义 Hook 优化滚动到顶部功能
  const scrollToTop = useScrollToTop();

  // 响应式断点检测
  const isMobile = useIsMobile();
  const isDesktop = useIsDesktop();

  return (
    <nav
      className={`sticky top-0 z-40 h-16 w-full backdrop-blur ${className}`}
      onDoubleClick={scrollToTop}
      aria-label="导航栏"
    >
      <div className="container mx-auto flex h-full items-center justify-between px-4">
        <div className="flex items-center opacity-100">
          <Logo />
        </div>

        {/* 桌面端导航菜单 - 仅在 md 断点及以上显示 */}
        {isDesktop && (
          <div className="hidden items-center justify-center gap-8 opacity-100 md:flex">
            <NavListMenu className="flex-1" />
          </div>
        )}

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <GitHubButton />
          <TravelButton />
          {/* 移动端菜单 - 仅在 md 断点以下显示 */}
          {isMobile && <MobileMenu />}
        </div>
      </div>
      <div className="relative h-px w-full overflow-hidden">
        <div
          className={`absolute inset-x-1/2 h-px w-0 bg-border transition-all duration-700 ease-[cubic-bezier(0.68,-0.55,0.27,1.55)] ${
            isScrolled ? "-translate-x-1/2 w-full opacity-100" : "opacity-0"
          }`}
        />
      </div>
    </nav>
  );
});

MainNavbar.displayName = "MainNavbar";
