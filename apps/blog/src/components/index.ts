/**
 * 全局共享组件统一导出
 * 集中管理所有通用共享组件，便于引用和维护
 * 业务相关组件已移动到对应的 features 目录中
 */

// ==================== 主题提供者 ====================
export { ThemeProvider } from "@iflux-art/ui/client";
// ==================== MDX 组件 ====================
export {
  ClientMDXRenderer,
  MDXBlockquote,
  MDXCode,
  MDXComponents,
  MDXImg,
  MDXLink,
} from "@/components/mdx";
// ==================== 卡片组件 ====================
// 通用卡片组件目录
export {} from "./cards";
// ==================== 布局组件 ====================
export { ClientLayout } from "./client-layout";
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
