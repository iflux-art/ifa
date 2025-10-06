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
} from "@/features/blog/components/mdx";

// ==================== 主题提供者 ====================
// 主题组件已移动到 features/theme 目录

// ==================== 业务按钮组件 ====================
export { GitHubButton } from "./button/github-button";
export { SearchButton } from "./button/search-button";
export { TravelButton } from "./button/travel-button";

// ==================== 卡片组件 ====================
// 通用卡片组件目录
export {} from "./cards";
export { Alert, AlertDescription, AlertTitle } from "./ui/alert";
export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
// ==================== UI 组件库 ====================
export { BackButton } from "./ui/back-button";
export { Badge } from "./ui/badge";
export { Button, buttonVariants } from "./ui/button";
export {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
export { Input } from "./ui/input";
export { Label } from "./ui/label";
export { Switch } from "./ui/switch";
export { Textarea } from "./ui/textarea";

// ==================== Friends 组件 ====================
export { FriendLinkApplication, FriendsPageContainer } from "./friends";
