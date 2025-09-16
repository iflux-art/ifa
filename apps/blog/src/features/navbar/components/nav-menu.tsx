"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/utils";
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

  return (
    <nav
      className={cn("flex items-center gap-6", className)}
      aria-label="主导航"
    >
      {NAV_ITEMS.map((item) => {
        // 类型断言确保 item 包含 external 和 href 属性
        const navItem = item as NavConfigItem;
        // 处理外部链接
        const href = navItem.external
          ? navItem.href || ""
          : NAV_PATHS[navItem.key] || `/${navItem.key}`;
        const isActive =
          !navItem.external &&
          (pathname === href || (href !== "/" && pathname.startsWith(href)));

        return (
          <Link
            key={navItem.key}
            href={href}
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              isActive ? "text-primary" : "text-muted-foreground",
            )}
            aria-current={isActive ? "page" : undefined}
            target={navItem.external ? "_blank" : undefined}
            rel={navItem.external ? "noopener noreferrer" : undefined}
          >
            {navItem.label}
          </Link>
        );
      })}
    </nav>
  );
};
