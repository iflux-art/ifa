"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { NavConfigItem } from "./nav-config";
import { NAV_ITEMS, NAV_PATHS } from "./nav-config";

interface NavListMenuProps {
  className?: string;
}

/**
 * 导航菜单列表组件
 * 显示主要导航项
 */
export const NavListMenu = ({ className = "" }: NavListMenuProps) => {
  const pathname = usePathname();

  // 如果没有导航项，则不渲染
  if (NAV_ITEMS.length === 0) {
    console.warn("导航项为空，不渲染导航菜单");
    return null;
  }

  return (
    <nav className={cn("flex items-center gap-6", className)} aria-label="主导航">
      {NAV_ITEMS.map((item: NavConfigItem) => {
        // 处理外部链接
        const href = item.external ? item.href || "" : NAV_PATHS[item.key] || `/${item.key}`;
        const isActive =
          !item.external && (pathname === href || (href !== "/" && pathname.startsWith(href)));

        return (
          <Link
            key={item.key}
            href={href}
            className={cn(
              "font-medium text-sm transition-colors hover:text-primary",
              isActive ? "text-primary" : "text-muted-foreground"
            )}
            aria-current={isActive ? "page" : undefined}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
};
