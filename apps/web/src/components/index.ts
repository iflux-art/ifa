/**
 * 组件统一导出文件
 * 按模块分组导出，便于管理和使用
 */

// ==================== UI 组件导出 ====================
export { BackButton } from "./ui/back-button";
export { Button, buttonVariants } from "./ui/button";
export { Card, CardContent } from "./ui/card";

// ==================== 布局组件导出 ====================
export { Footer } from "./layout/footer";
export { MainNavbar } from "./layout/navbar";
export { ThemeProvider, ThemeToggle } from "./layout/theme";

// ==================== 功能组件导出 ====================
export { GitHubButton, TravelButton } from "./features/buttons";
export { FeaturedLinks, HeroSection, LinkCard } from "./features/home";
export { LazyFeaturedLinks, LazyHeroSection } from "./features/home/lazy-components";
