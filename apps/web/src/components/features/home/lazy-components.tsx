"use client";

import { createLazyComponent } from "@/lib/utils/lazy-loading";
import { HeroSkeleton, FeaturedLinksSkeleton } from "@/components/shared";

// 懒加载 Hero Section
export const LazyHeroSection = createLazyComponent(
  () => import("@/components/features/home/hero-section"),
  HeroSkeleton
);

// 懒加载 Featured Links
export const LazyFeaturedLinks = createLazyComponent(
  () => import("@/components/features/home/featured-links"),
  FeaturedLinksSkeleton
);
