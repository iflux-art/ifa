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
        // 类型断言，确保 TypeScript 知道 item 包含 external 和 href 属性
        const navItem = item as NavConfigItem;

        // 处理外部链接
        if (navItem.external && navItem.href) {
          return (
            <a
              key={navItem.key}
              href={navItem.href}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary text-muted-foreground",
              )}
            >
              {navItem.label}
            </a>
          );
        }

        // 处理内部链接
        const href = NAV_PATHS[navItem.key] || `/${navItem.key}`;
        const isActive =
          pathname === href || (href !== "/" && pathname.startsWith(href));

        return (
          <Link
            key={navItem.key}
            href={href}
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              isActive ? "text-primary" : "text-muted-foreground",
            )}
            aria-current={isActive ? "page" : undefined}
          >
            {navItem.label}
          </Link>
        );
      })}
    </nav>
  );
};
