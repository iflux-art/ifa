// ==================== 核心导出 ====================

// ==================== 主题组件导出 ====================
export { ThemeProvider, ThemeToggle } from "./components/client";
export { BackButton } from "./components/ui/back-button";
// ==================== 徽章组件导出 ====================
export { Badge, badgeVariants } from "./components/ui/badge";
// ==================== 组件导出 ====================
export { Button, buttonVariants } from "./components/ui/button/button";
export { GitHubButton } from "./components/ui/button/github-button";
export { TravelButton } from "./components/ui/button/travel-button";
// ==================== 卡片组件导出 ====================
export {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
export { COPYRIGHT_TEXT, Footer } from "./components/ui/footer";
// ==================== 页脚组件导出 ====================
export type {
  GridLayoutProps,
  PageLayoutType,
  SidebarConfig,
  SidebarPosition,
} from "./components/ui/layout/grid-layout";
export {
  GridLayout,
  getMainContentClasses,
  getSidebarClasses,
} from "./components/ui/layout/grid-layout";
// LinkCard is now exported from ./components/ui/card
export type { LogoProps } from "./components/ui/logo";
export { Logo } from "./components/ui/logo";
export type { NotFoundProps } from "./components/ui/not-found";
// ==================== 404页面组件导出 ====================
export { NotFound } from "./components/ui/not-found";
// ==================== 工具函数导出 ====================
export { cn } from "./lib/utils";

// ==================== 样式导出 ====================
import "./styles.css";

// ==================== 服务端组件导出 ====================
// 以下组件专门用于服务端导入，只导出不依赖客户端 hooks 的组件
// 客户端组件（需要"use client"指令的组件）应从 ./components/client 导入

// ==================== MDX 组件导出 ====================
// MDX客户端组件已移至 ./components/client
// MDX服务端组件
export * from "./components/mdx/server";
