import { clearAllCaches } from "@/components/features/links/links-lib";

/**
 * 开发工具：手动清除所有缓存
 * 在浏览器控制台中调用 window.clearAppCaches() 来清除缓存
 */
export function setupCacheUtils(): void {
  if (typeof window === "undefined") return;

  // 在开发环境中添加全局函数
  if (process.env.NODE_ENV === "development") {
    (window as unknown as { clearAppCaches: () => void }).clearAppCaches = () => {
      clearAllCaches();
      console.log("✅ 所有应用缓存已清除");
    };

    (window as unknown as { reloadWithCacheClear: () => void }).reloadWithCacheClear = () => {
      clearAllCaches();
      console.log("🔄 清除缓存并重新加载页面...");
      setTimeout(() => {
        window.location.reload();
      }, 500);
    };

    console.log("🛠️ 开发工具已加载:");
    console.log("  - window.clearAppCaches() - 清除应用缓存");
    console.log("  - window.reloadWithCacheClear() - 清除缓存并重新加载");
  }
}
