"use client";

import type React from "react";
import { useCallback, useEffect, useState } from "react";
import { SearchButton, TravelButton } from "@/components/features/buttons";
import { ThemeToggle } from "@/components/theme";
import { Logo } from "./logo";
import { MobileMenu } from "./mobile-menu";
import { useMobileMenu } from "./mobile-menu-context";
import { NavListMenu } from "./nav-menu";

interface MainNavbarProps {
	className?: string;
}

export const MainNavbar = ({ className = "" }: MainNavbarProps) => {
	const [isScrolled, setIsScrolled] = useState(false);
	const { sidebar } = useMobileMenu();

	const handleScroll = useCallback(() => {
		setIsScrolled(window.scrollY > 0);
	}, []);

	useEffect(() => {
		handleScroll();

		window.addEventListener("scroll", handleScroll, { passive: true });

		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, [handleScroll]);

	const scrollToTop = useCallback(() => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	}, []);

	const mobileActions = (
		<>
			<SearchButton />
			<ThemeToggle />
			<TravelButton />
		</>
	);

	return (
		<nav
			className={`sticky top-0 z-40 h-16 w-full backdrop-blur ${className}`}
			onDoubleClick={scrollToTop}
			aria-label="导航栏"
		>
			<div className="container mx-auto flex h-full items-center justify-between px-4">
				<Logo />

				<NavListMenu className="hidden gap-8 md:flex" />

				<div className="flex items-center gap-2">
					{/* 桌面端显示搜索、主题切换、开往按钮 */}
					<div className="hidden md:flex">
						<SearchButton />
						<ThemeToggle />
						<TravelButton />
					</div>
					{/* 移动端只显示汉堡菜单 */}
					<MobileMenu actions={mobileActions}>{sidebar}</MobileMenu>
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
