/**
 * 全局共享组件统一导出
 * 集中管理所有通用共享组件，便于引用和维护
 * 业务相关组件已移动到对应的 features 目录中
 */

// ==================== MDX 组件 ====================
export {
  ClientMDXRenderer,
  MDXBlockquote,
  MDXCode,
  MDXComponents,
  MDXImg,
  MDXLink,
} from "@/components/mdx";

// ==================== 主题提供者 ====================
// 主题组件已移动到 features/theme 目录

// ==================== 业务按钮组件 ====================
export { GitHubButton } from "./button/github-button";
export { SearchButton } from "./button/search-button";
export { TravelButton } from "./button/travel-button";
// ==================== 卡片组件 ====================
// 通用卡片组件目录

// ==================== 底栏组件 ====================
export { Footer } from "./footer";
// ==================== Friends 组件 ====================
export {
  FriendLinkApplication,
  FriendsPage,
} from "./friends";
// ==================== Navbar 组件 ====================
export { MainNavbar } from "./navbar";
export type { NavConfigItem } from "./navbar/nav-config";
export {
  NAV_DESCRIPTIONS,
  NAV_ITEMS,
  NAV_PATHS,
} from "./navbar/nav-config";
export type {
  BaseNavItem,
  BaseSearchResult,
  BreadcrumbItem,
  Heading,
  NavbarSearchResult,
  NestedNavItem,
  SidebarItem,
  SidebarProps,
} from "./navbar/types";
export { useActiveSection } from "./navbar/use-active-section";
// ==================== 侧边栏组件 ====================
export {
  LatestPostsCard,
  RelatedPostsCard,
  TagCloudCard,
} from "./sidebar";
export {
  Alert,
  AlertDescription,
  AlertTitle,
} from "./ui/alert";
// ==================== UI 组件库 ====================
export { BackButton } from "./ui/back-button";
export { Badge } from "./ui/badge";
export {
  Button,
  buttonVariants,
} from "./ui/button";
export {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
export { Input } from "./ui/input";
export { Textarea } from "./ui/textarea";
