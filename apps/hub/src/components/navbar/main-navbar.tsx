"use client";

import { GitHubButton, ThemeToggle, TravelButton } from "@iflux-art/ui/client";
import { Logo } from "@iflux-art/ui";
import { useEffect, useState } from "react";
import { SearchButton } from "@/components/search/search-button";
import { NavListMenu } from "./nav-menu";
import { useNavbarScroll } from "./use-navbar-scroll";

export const MainNavbar = ({ className = "" }: { className?: string }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const {
    pageTitle,
    showTitle,
    scrollToTop,
    shouldShowPageTitle,
    showNavMenu,
  } = useNavbarScroll();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    // 初始检查
    handleScroll();

    // 添加滚动事件监听器
    window.addEventListener("scroll", handleScroll, { passive: true });

    // 清理事件监听器
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav
      className={`sticky top-0 z-40 h-16 w-full backdrop-blur ${className}`}
      onDoubleClickCapture={scrollToTop}
      title={showTitle ? "双击返回顶部" : ""}
      aria-label="导航栏"
    >
      <div className="container mx-auto flex h-full items-center justify-between px-4">
        <div className="flex items-center opacity-100">
          <Logo
            href="https://www.iflux.art/"
            isExternal
            ariaLabel="iFluxArt - 访问官网"
          />
        </div>

        <div className="hidden items-center justify-center gap-8 opacity-100 lg:flex">
          {shouldShowPageTitle && showTitle ? (
            <button
              className="max-w-md cursor-pointer truncate text-lg font-medium tracking-tight hover:text-primary"
              onClick={scrollToTop}
              onKeyDown={(e) => e.key === "Enter" && scrollToTop()}
              title="点击返回顶部"
              tabIndex={0}
              type="button"
            >
              {pageTitle}
            </button>
          ) : null}
          {showNavMenu && <NavListMenu className="flex-1" />}
        </div>

        <div className="flex items-center gap-2">
          <SearchButton />
          <ThemeToggle />
          <GitHubButton url="https://github.com/iflux-art/ifa" />
          <TravelButton />
        </div>
      </div>
      <div className="relative h-px w-full overflow-hidden">
        <div
          className={`absolute inset-x-1/2 h-px w-0 bg-border transition-all duration-700 ease-[cubic-bezier(0.68,-0.55,0.27,1.55)] ${
            isScrolled ? "w-full -translate-x-1/2 opacity-100" : "opacity-0"
          }`}
        />
      </div>
    </nav>
  );
};
