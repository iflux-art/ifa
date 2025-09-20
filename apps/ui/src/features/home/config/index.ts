/**
 * @file src/features/home/config/index.ts
 * @description 主页模块配置文件
 */

// 主页特定的配置
export const HOME_CONFIG = {
  // 主页标题
  title: "UI 组件展示",

  // 主页描述
  description: "用于展示和测试 @iflux-art/ui 组件库的 Next.js 应用",

  // Hero区域配置
  hero: {
    title: "UI 组件展示",
    subtitle: "展示和测试 @iflux-art/ui 组件库中的所有组件",
    ctaButtons: [],
  },

  // SEO配置
  seo: {
    title: "UI 组件展示",
    description: "用于展示和测试 @iflux-art/ui 组件库的 Next.js 应用",
    type: "website",
  },
} as const;
