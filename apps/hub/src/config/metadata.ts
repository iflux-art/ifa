/**
 * @file metadata.ts
 * @description Next.js 元数据配置文件
 *
 * 本文件聚合所有元数据配置，包括：
 * - 基础站点信息（标题、描述等）
 * - iOS设备特定配置
 * - Windows平台特定配置
 * - 图标配置
 *
 * @usage
 * 在 layout.tsx 中使用：
 * ```typescript
 * import { generateMetadata, generateViewport } from '@/lib/metadata';
 *
 * export { generateMetadata as metadata, generateViewport as viewport };
 * ```
 */

import type { SiteMetadata } from "@/types";

/**
 * 站点基础配置
 * 包含网站的基本信息
 */
export const SITE_METADATA: SiteMetadata = {
  title: "iFluxArt · 斐流艺创",
  description:
    '"斐流艺创" 是 "iFluxArt" 的中文翻译，代表智能技术与艺术创作的有机融合，"斐然成章" 的创作力与 "川流不息" 的技术流。我们致力于通过智能技术推动艺术创作，让创意与技术交融共生。探索未来艺术的可能性，共创数字时代的视觉盛宴。',
  author: "iFluxArt Team",
  url: "https://hub.iflux.art",
  image: "/images/og-image.png",
  keywords: ["iFluxArt", "斐流艺创", "人工智能", "AI", "艺术创作", "数字艺术"],
  twitter: "@ifluxart",
  github: "iflux-art",
  email: "hello@iflux.art",
  copyright: `© ${new Date().getFullYear()} iFluxArt · 斐流艺创`,
};
export const SITE_AUTHOR = "iFluxArt Team";
export const SITE_URL = "https://hub.iflux.art";
export const SITE_TWITTER = "@ifluxart";
export const SITE_GITHUB = "iflux-art";
export const SITE_EMAIL = "hello@iflux.art";
export const SITE_COPYRIGHT = `© ${new Date().getFullYear()} iFluxArt · 斐流艺创`;

/**
 * 视口配置
 * @description 控制页面在移动设备上的显示
 */
export const VIEWPORT_CONFIG = {
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  themeColor: "#000000",
};
