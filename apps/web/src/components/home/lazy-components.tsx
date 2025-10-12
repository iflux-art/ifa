"use client";

import { createLazyComponent } from "@/lib/lazy-loading";

// 懒加载 Hero Section
export const LazyHeroSection = createLazyComponent(
  () => import("@/components/home/hero-section"),
  () => (
    <div className="min-h-[60vh] bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-16">
        <div className="flex min-h-[40vh] items-center justify-center">
          <div className="space-y-4 text-center">
            <div className="animate-pulse">
              <div className="mx-auto mb-4 h-12 w-96 rounded-lg bg-muted"></div>
              <div className="mx-auto mb-2 h-6 w-64 rounded bg-muted"></div>
              <div className="mx-auto h-6 w-48 rounded bg-muted"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
);

// 懒加载 Featured Links
export const LazyFeaturedLinks = createLazyComponent(
  () => import("@/components/home/featured-links"),
  () => (
    <div className="bg-muted/10 py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="rounded-lg border bg-card p-6">
                <div className="mb-3 h-6 w-3/4 rounded bg-muted"></div>
                <div className="mb-2 h-4 w-full rounded bg-muted"></div>
                <div className="h-4 w-2/3 rounded bg-muted"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
);
