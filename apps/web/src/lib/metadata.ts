/**
 * 基础元数据生成工具函数
 * 整合了网站基础元数据生成的所有逻辑
 */

import type { Metadata } from "next";
import { SITE_METADATA } from "@/config";

/**
 * 生成视口配置
 */
export function generateViewport() {
  return {
    width: "device-width",
    initialScale: 1,
    maximumScale: 2,
    themeColor: [
      { media: "(prefers-color-scheme: light)", color: "#ffffff" },
      { media: "(prefers-color-scheme: dark)", color: "#000000" },
    ],
  };
}

/**
 * 生成基础元数据
 */
export function generateMetadata(): Metadata {
  return {
    title: SITE_METADATA.title,
    description: SITE_METADATA.description,
    keywords: [...SITE_METADATA.keywords],
    authors: [{ name: SITE_METADATA.author }],
    creator: SITE_METADATA.author,
    publisher: SITE_METADATA.author,
    metadataBase: new URL(SITE_METADATA.url),
    openGraph: {
      type: "website",
      locale: "zh_CN",
      url: SITE_METADATA.url,
      title: SITE_METADATA.title,
      description: SITE_METADATA.description,
      siteName: SITE_METADATA.title,
      images: [
        {
          url: SITE_METADATA.image,
          width: 1200,
          height: 630,
          alt: SITE_METADATA.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: SITE_METADATA.title,
      description: SITE_METADATA.description,
      images: [SITE_METADATA.image],
      creator: SITE_METADATA.twitter,
    },
  };
}
