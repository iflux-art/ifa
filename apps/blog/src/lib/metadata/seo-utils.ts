import type { Metadata } from "next";
import { SITE_METADATA } from "@/config";
import { filterUndefinedValues } from "@/lib/utils/helpers";

/**
 * SEO页面选项接口
 */
interface SEOPageOptions {
  title: string;
  description?: string;
  keywords?: string[];
  type?: "website" | "article" | "profile";
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  tags?: string[];
  category?: string;
  image?: string;
  noIndex?: boolean;
  noFollow?: boolean;
  canonicalUrl?: string;
}

/**
 * 默认站点配置
 */
const DEFAULT_SITE_CONFIG = {
  name: SITE_METADATA.title,
  description: SITE_METADATA.description,
  url: SITE_METADATA.url,
  locale: "zh-CN",
  keywords: SITE_METADATA.keywords,
  twitterHandle: SITE_METADATA.twitter,
};

/**
 * 生成完整的SEO元数据
 */
export function generateSEOMetadata(
  options: SEOPageOptions,
  siteConfig = DEFAULT_SITE_CONFIG,
): Metadata {
  const {
    title,
    description,
    keywords = [],
    type = "website",
    publishedTime,
    modifiedTime,
    authors = [],
    tags = [],
    category,
    image,
    noIndex = false,
    noFollow = false,
    canonicalUrl,
  } = options;

  const fullTitle = title.includes(siteConfig.name)
    ? title
    : `${title} - ${siteConfig.name}`;
  const fullDescription = description || siteConfig.description;
  const allKeywords = [...(keywords || []), ...(siteConfig.keywords || [])];
  const siteUrl = canonicalUrl || siteConfig.url;

  // 构建基础元数据
  const baseMetadata = {
    title: fullTitle,
    description: fullDescription,
    keywords: allKeywords.join(","),
    authors: authors.length > 0 ? authors.map((name) => ({ name })) : undefined,
    category,
    robots: {
      index: !noIndex,
      follow: !noFollow,
      googleBot: {
        index: !noIndex,
        follow: !noFollow,
      },
    },
    alternates: canonicalUrl ? { canonical: canonicalUrl } : undefined,
  };

  // 构建 Open Graph 元数据
  const openGraphMetadata = {
    title: fullTitle,
    description: fullDescription,
    type: type as "website" | "article",
    url: canonicalUrl || siteUrl,
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    images: image ? [{ url: image, alt: title }] : undefined,
    publishedTime,
    modifiedTime,
    authors: authors.length > 0 ? authors : undefined,
    tags: tags.length > 0 ? tags : undefined,
  };

  // 构建 Twitter 元数据
  const twitterMetadata = {
    card: "summary_large_image" as const,
    title: fullTitle,
    description: fullDescription,
    creator: siteConfig.twitterHandle,
    images: image ? [image] : undefined,
  };

  // 构建其他元数据
  const otherMetadata: Record<string, string> = {};

  if (category) {
    otherMetadata["article:section"] = category;
  }

  if (tags.length > 0) {
    otherMetadata["article:tag"] = tags.join(",");
  }

  // 合并所有元数据
  const metadata: Metadata = {
    ...baseMetadata,
    openGraph: openGraphMetadata,
    twitter: twitterMetadata,
  };

  if (Object.keys(otherMetadata).length > 0) {
    metadata.other = {
      ...metadata.other,
      ...otherMetadata,
    };
  }

  return filterUndefinedValues(metadata);
}
