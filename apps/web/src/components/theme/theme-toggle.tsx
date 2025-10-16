"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { memo, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { useMounted } from "@/hooks";

export const ThemeToggle = memo(() => {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useMounted();

  // 使用 useCallback 优化切换主题函数
  const toggleTheme = useCallback(() => {
    if (resolvedTheme === "dark") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  }, [resolvedTheme, setTheme]);

  // 使用 useMemo 优化计算属性
  const isDark = useMemo(() => resolvedTheme === "dark", [resolvedTheme]);
  const title = useMemo(() => (isDark ? "切换到浅色模式" : "切换到深色模式"), [isDark]);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" disabled aria-label="切换主题" className="h-9 w-9">
        <div className="h-[1.2rem] w-[1.2rem]" />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label="切换主题"
      title={title}
      className="h-9 w-9"
    >
      <Sun className="dark:-rotate-90 h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">{title}</span>
    </Button>
  );
});

ThemeToggle.displayName = "ThemeToggle";
