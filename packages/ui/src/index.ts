// ==================== 核心导出 ====================

// ==================== 组件导出 ====================
export { ThemeToggle } from "./components/theme/theme-toggle";
export { Button, buttonVariants } from "./components/ui/button/button";
export { GitHubButton } from "./components/ui/button/github-button";
export { TravelButton } from "./components/ui/button/travel-button";
export { Logo } from "./components/ui/logo";
export type { LogoProps } from "./components/ui/logo";
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
// ==================== 页脚组件导出 ====================
export { Footer, COPYRIGHT_TEXT } from "./components/ui/footer";
// ==================== 工具函数导出 ====================
export { cn } from "./lib/utils";

// ==================== 样式导出 ====================
import "./styles.css";

// ==================== 服务端组件导出 ====================
// 以下组件专门用于服务端导入，只导出不依赖客户端 hooks 的组件
export { ThemeProvider } from "./components/theme/theme-provider";