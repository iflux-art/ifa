"use client";

import type React from "react";
import { useCallback, useEffect, useId, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { NAV_ITEMS, NAV_PATHS, NAV_DESCRIPTIONS } from "./navbar-config";
import type { BaseNavItem } from "./navbar-types";

interface MobileMenuProps {
  className?: string;
}

/**
 * 移动端菜单组件
 * 在小屏幕设备上显示汉堡菜单和展开的导航项
 */
export const MobileMenu = ({ className = "" }: MobileMenuProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const menuId = useId();
  const menuButtonId = useId();
  const menuTitleId = useId();
  const menuDescriptionId = useId();
  const liveRegionId = useId();

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  // 关闭菜单
  const closeMenu = useCallback(() => {
    setIsOpen(false);
  }, []);

  // 切换菜单状态
  const toggleMenu = useCallback(() => {
    setIsOpen((prev: boolean) => {
      const newState = !prev;
      // 通知屏幕阅读器状态变化
      const liveRegion = document.getElementById(liveRegionId);
      if (liveRegion) {
        liveRegion.textContent = newState ? "菜单已打开" : "菜单已关闭";
      }
      return newState;
    });
  }, [liveRegionId]);

  // 点击外部区域关闭菜单 - 支持触摸和鼠标事件
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const menu = document.getElementById(menuId);
      const button = document.getElementById(menuButtonId);
      const target = event.target as Node;

      if (isOpen && menu && button && !menu.contains(target) && !button.contains(target)) {
        closeMenu();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside, { passive: true });
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isOpen, menuId, menuButtonId, closeMenu]);

  // 处理ESC键关闭菜单
  const handleEscapeKey = useCallback(() => {
    closeMenu();
    const menuButton = document.getElementById(menuButtonId);
    if (menuButton) {
      menuButton.focus();
    }
  }, [closeMenu, menuButtonId]);

  // 处理Tab键焦点陷阱
  const handleTabKey = useCallback(
    (event: KeyboardEvent) => {
      const menu = document.getElementById(menuId);
      if (!menu) {
        return;
      }

      const focusableElements = menu.querySelectorAll(
        'button:not([disabled]), [href]:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]):not([disabled])'
      );
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement?.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement?.focus();
      }
    },
    [menuId]
  );

  // 键盘导航处理
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!isOpen) {
        return;
      }

      if (event.key === "Escape") {
        event.preventDefault();
        handleEscapeKey();
      } else if (event.key === "Tab") {
        handleTabKey(event);
      }
    },
    [isOpen, handleEscapeKey, handleTabKey]
  );

  // ESC键关闭菜单和键盘导航
  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      // 菜单打开时，将焦点设置到第一个导航项
      setTimeout(() => {
        const menu = document.getElementById(menuId);
        if (menu) {
          const firstFocusableElement = menu.querySelector(
            'button:not([disabled]), [href]:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]):not([disabled])'
          ) as HTMLElement;
          if (firstFocusableElement) {
            firstFocusableElement.focus();
          }
        }
      }, 100);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, handleKeyDown, menuId]);

  // 防止背景滚动
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // 触摸手势支持 - 向右滑动关闭菜单
  useEffect(() => {
    let startX = 0;
    let startY = 0;

    const handleTouchStart = (event: TouchEvent) => {
      if (!isOpen) {
        return;
      }

      const touch = event.touches[0];
      startX = touch.clientX;
      startY = touch.clientY;
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (!isOpen || startX === 0) {
        return;
      }

      const touch = event.touches[0];
      const deltaX = touch.clientX - startX;
      const deltaY = touch.clientY - startY;

      // 检测是否为水平滑动手势
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
        // 向右滑动且距离足够时关闭菜单
        if (deltaX > 100) {
          closeMenu();
        }
      }
    };

    const handleTouchEnd = () => {
      startX = 0;
      startY = 0;
    };

    if (isOpen) {
      document.addEventListener("touchstart", handleTouchStart, { passive: true });
      document.addEventListener("touchmove", handleTouchMove, { passive: true });
      document.addEventListener("touchend", handleTouchEnd, { passive: true });
    }

    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isOpen, closeMenu]);

  if (!isMounted) {
    return null;
  }

  return (
    <div className={cn("block md:hidden", className)}>
      {/* 屏幕阅读器状态通知 */}
      <div id={liveRegionId} aria-live="polite" aria-atomic="true" className="sr-only" />

      {/* 汉堡菜单按钮 */}
      <Button
        id={menuButtonId}
        variant="ghost"
        size="icon"
        className="relative z-[60] h-11 w-11 touch-manipulation"
        onClick={toggleMenu}
        aria-expanded={isOpen}
        aria-controls={menuId}
        aria-label={isOpen ? "关闭菜单" : "打开菜单"}
        aria-haspopup="dialog"
      >
        <div className="relative">
          {isOpen ? (
            <X
              className="h-4 w-4 transition-transform duration-200 ease-in-out"
              aria-hidden="true"
            />
          ) : (
            <Menu
              className="h-4 w-4 transition-transform duration-200 ease-in-out"
              aria-hidden="true"
            />
          )}
        </div>
      </Button>

      {/* 全屏移动端菜单面板 */}
      {isOpen && (
        <div
          id={menuId}
          className="fixed inset-0 z-50 md:hidden"
          role="dialog"
          aria-modal="true"
          aria-labelledby={menuTitleId}
          aria-describedby={menuDescriptionId}
        >
          {/* 背景覆盖层 */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ease-out"
            aria-hidden="true"
            onClick={closeMenu}
          />

          {/* 全屏内容面板 */}
          <div className="fixed inset-0 overflow-y-auto bg-background transition-transform duration-300 ease-out">
            {/* 头部区域 */}
            <div className="border-b p-4 sm:p-6">
              <h2 id={menuTitleId} className="text-center font-semibold text-lg">
                导航菜单
              </h2>
            </div>

            {/* 内容区域 */}
            <div className="p-4 sm:p-6">
              <p id={menuDescriptionId} className="sr-only">
                使用Tab键导航，按Enter键或空格键选择，按Escape键关闭菜单，向右滑动也可关闭菜单
              </p>
              {/* 导航卡片网格 - 12列布局，每行2张卡片 */}
              <nav aria-label="主导航">
                <div className="grid grid-cols-12 gap-3 sm:gap-4">
                  {NAV_ITEMS.map((item: BaseNavItem) => {
                    // 处理链接
                    const href = item.external
                      ? item.href || ""
                      : NAV_PATHS[item.key] || `/${item.key}`;

                    const isExternal = item.external || href.startsWith("http");
                    const description = item.description || NAV_DESCRIPTIONS[item.key] || "";

                    // 安全渲染图标
                    const renderIcon = () => {
                      if (!item.icon) {
                        return (
                          <div
                            className="h-6 w-6 rounded bg-current opacity-50"
                            role="img"
                            aria-label="默认图标"
                          />
                        );
                      }

                      try {
                        // 所有图标都是来自 lucide-react 的 React 组件
                        const IconComponent = item.icon as React.ComponentType<{
                          className?: string;
                          "aria-hidden"?: boolean;
                        }>;
                        return <IconComponent className="h-6 w-6" aria-hidden={true} />;
                      } catch (error) {
                        console.warn(`Failed to render icon for ${item.key}:`, error);
                        // 图标渲染失败时的降级处理
                        return (
                          <div
                            className="h-6 w-6 rounded bg-current opacity-50"
                            role="img"
                            aria-label="图标加载失败"
                          />
                        );
                      }
                    };

                    // 导航卡片内容 - 每张卡片占6列（12列中的一半）
                    const cardContent = (
                      <div className="col-span-12 xs:col-span-6">
                        <div className="group relative touch-manipulation select-none overflow-hidden rounded-lg border bg-card p-4 shadow-sm transition-all duration-200 ease-out focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 hover:scale-[1.02] hover:border-primary/20 hover:shadow-md active:scale-[0.98]">
                          <div className="flex flex-col items-center space-y-3 text-center">
                            {/* 图标容器 */}
                            <div
                              className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary transition-all duration-200 group-hover:scale-110 group-hover:bg-primary/20"
                              aria-hidden="true"
                            >
                              {renderIcon()}
                            </div>
                            {/* 文本内容 */}
                            <div className="space-y-1">
                              <h3 className="font-medium text-sm leading-tight">{item.label}</h3>
                              {description && (
                                <p className="line-clamp-2 text-muted-foreground text-xs leading-tight">
                                  {description}
                                </p>
                              )}
                            </div>
                          </div>
                          {/* 卡片悬停效果指示器 */}
                          <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                        </div>
                      </div>
                    );

                    const handleKeyDown = (event: React.KeyboardEvent) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        // 对于链接，让浏览器处理导航
                        if (event.currentTarget.tagName === "A") {
                          (event.currentTarget as HTMLAnchorElement).click();
                        }
                        closeMenu();
                      }
                    };

                    // 外部链接处理
                    if (isExternal) {
                      return (
                        <a
                          key={item.key}
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={closeMenu}
                          onKeyDown={handleKeyDown}
                          className="contents focus:outline-none"
                          tabIndex={0}
                          aria-label={`${item.label} - ${description || "外部链接"}`}
                        >
                          {cardContent}
                        </a>
                      );
                    }

                    // 内部链接处理
                    return (
                      <Link
                        key={item.key}
                        href={href}
                        onClick={closeMenu}
                        onKeyDown={handleKeyDown}
                        className="contents focus:outline-none"
                        tabIndex={0}
                        aria-label={`${item.label} - ${description || "内部链接"}`}
                      >
                        {cardContent}
                      </Link>
                    );
                  })}
                </div>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
