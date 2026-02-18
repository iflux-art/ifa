"use client";

import type React from "react";
import { useCallback, useEffect, useState } from "react";
import { SearchButton, TravelButton } from "@/components/features/buttons";
import { ThemeToggle } from "@/components/theme";
import { Logo } from "./logo";
import { NavListMenu } from "./nav-menu";

interface MainNavbarProps {
	className?: string;
}

export const MainNavbar = ({ className = "" }: MainNavbarProps) => {
	const [isScrolled, setIsScrolled] = useState(false);

	const handleScroll = useCallback(() => {
		setIsScrolled(window.scrollY > 0);
	}, []);

	useEffect(() => {
		// 初始检查
		handleScroll();

		// 添加滚动事件监听器
		window.addEventListener("scroll", handleScroll, { passive: true });

		// 清理事件监听器
		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, [handleScroll]);

	// 双击返回顶部功能
	const scrollToTop = useCallback(() => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	}, []);

	return (
		<nav
			className={`sticky top-0 z-40 h-16 w-full backdrop-blur ${className}`}
			onDoubleClick={scrollToTop}
			aria-label="导航栏"
		>
			<div className="container mx-auto flex h-full items-center justify-between px-4">
				<Logo />

				{/* 桌面端导航菜单 */}
				<NavListMenu className="hidden gap-8 md:flex" />

				<div className="flex items-center gap-2">
					<SearchButton />
					<ThemeToggle />
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
