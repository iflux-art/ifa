"use client";

import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { NavConfigItem } from "./nav-config";
import { ADMIN_MENU_ITEMS, NAV_DESCRIPTIONS, NAV_ITEMS } from "./nav-config";
import { useActiveSection } from "./use-active-section";

interface NavProps {
  onClose: () => void;
  className?: string;
}

const NavCards = ({ onClose }: NavProps) => {
  const isActiveSection = useActiveSection(NAV_ITEMS.map((item: NavConfigItem) => item.key));

  // 如果没有导航项，则不渲染
  if (NAV_ITEMS.length === 0) {
    console.warn("导航项为空，不渲染导航卡片");
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {NAV_ITEMS.map((item: NavConfigItem) => {
          const Icon = item.icon;
          const href = item.external ? item.href || "" : `/${item.key}`;
          return (
            <Link
              key={item.key}
              href={href}
              onClick={onClose}
              className={cn(
                "group relative overflow-hidden rounded-lg border bg-card p-6 transition-colors duration-300 hover:bg-accent hover:text-accent-foreground",
                isActiveSection === item.key
                  ? "border-primary bg-accent text-accent-foreground"
                  : "border-border"
              )}
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {Icon && <Icon className="h-5 w-5" />}
                  <h3 className="font-medium text-base">{item.label}</h3>
                </div>
                <p className="text-muted-foreground text-sm">{NAV_DESCRIPTIONS[item.key]}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

const AdminMenu = ({ onClose }: NavProps) => {
  const isActiveSection = useActiveSection(ADMIN_MENU_ITEMS.map((item: NavConfigItem) => item.key));

  return (
    <div className="space-y-6">
      <div className="mb-2">
        <h3 className="font-medium text-muted-foreground text-sm">管理后台</h3>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {ADMIN_MENU_ITEMS.map((item: NavConfigItem) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.key}
              href={`/${item.key}`}
              onClick={onClose}
              className={cn(
                "group relative overflow-hidden rounded-lg border bg-card p-6 transition-colors duration-300 hover:bg-accent hover:text-accent-foreground",
                isActiveSection === item.key
                  ? "border-primary bg-accent text-accent-foreground"
                  : "border-border"
              )}
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {Icon && <Icon className="h-5 w-5" />}
                  <h3 className="font-medium text-base">{item.label}</h3>
                </div>
                <p className="text-muted-foreground text-sm">{item.description}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export const NavCardMenu = ({ onClose, className }: NavProps) => {
  const { isSignedIn } = useUser();

  return (
    <div className={cn("space-y-6", className)}>
      <NavCards onClose={onClose} />
      {isSignedIn && <AdminMenu onClose={onClose} />}
    </div>
  );
};
