// ==================== 核心导出 ====================

// ==================== 主题组件导出 ====================
export { ThemeProvider, ThemeToggle } from "./components/client";
// ==================== 组件导出 ====================
export { Button, buttonVariants } from "./components/ui/button/button";
export { GitHubButton } from "./components/ui/button/github-button";
export { TravelButton } from "./components/ui/button/travel-button";
export { BackButton } from "./components/ui/back-button";
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
// ==================== 卡片组件导出 ====================
export {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  CardAction,
} from "./components/ui/card";
// LinkCard is now exported from ./components/ui/card
export type { LogoProps } from "./components/ui/logo";
export { Logo } from "./components/ui/logo";
// ==================== 工具函数导出 ====================
export { cn } from "./lib/utils";

// ==================== 样式导出 ====================
import "./styles.css";

// ==================== 服务端组件导出 ====================
// 以下组件专门用于服务端导入，只导出不依赖客户端 hooks 的组件
// 客户端组件（需要"use client"指令的组件）应从 ./components/client 导入
