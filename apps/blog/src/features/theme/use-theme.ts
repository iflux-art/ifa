import { useTheme as useNextTheme } from "next-themes";
import { useThemeStore } from "@/features/theme/theme-store";

/**
 * 自定义 hook，用于主题管理
 * 封装了 next-themes 和 Zustand store 的功能
 */
export const useTheme = () => {
  const nextTheme = useNextTheme();
  const themeStore = useThemeStore();

  return {
    ...nextTheme,
    ...themeStore,
  };
};
