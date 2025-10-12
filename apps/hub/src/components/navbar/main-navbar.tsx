"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { AuthButtons } from "@/components/auth";
import { GitHubButton, TravelButton } from "@/components/button";
import { ThemeToggle } from "@/components/theme";
import { Logo } from "./logo";
import { NavListMenu } from "./nav-menu";

// 动态导入搜索按钮组件
const SearchButton = dynamic(
  () => import("@/components/search/search-button").then((mod) => mod.SearchButton),
  { ssr: false }
);

export const MainNavbar = ({ className = "" }: { className?: string }) => {
  const [isScrolled, setIsScrolled] = useState(false);

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

  // 双击返回顶部功能
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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

        <div className="flex items-center justify-center gap-8 opacity-100">
          <NavListMenu className="flex-1" />
        </div>

        <div className="flex items-center gap-2">
          <SearchButton />
          <ThemeToggle />
          <AuthButtons />
          <GitHubButton />
          <TravelButton />
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
};
