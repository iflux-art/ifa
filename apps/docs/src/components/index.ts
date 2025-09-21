/**
 * 全局共享组件统一导出
 * 集中管理所有通用共享组件，便于引用和维护
 * 业务相关组件已移动到对应的 features 目录中
 */

// ==================== 主题提供者 ====================
export { ThemeProvider } from "@iflux-art/ui/theme-provider";
// MDX 组件导出
export {
  ClientMDXRenderer,
  MDXBlockquote,
  MDXCode,
  MDXComponents,
  MDXImg,
  MDXLink,
  MDXPre,
} from "@/features/mdx";
export type { CodeBlockProps } from "@/features/mdx/code";
// 代码高亮组件导出
export { CodeBlock } from "@/features/mdx/code";
// ==================== 面包屑组件 ====================
export { Breadcrumb } from "./breadcrumb";
// ==================== 布局组件 ====================
export { ClientLayout } from "./client-layout";
export type { ContentDisplayProps, ContentType } from "./content-display";
// ==================== 内容展示组件 ====================
export { ContentDisplay } from "./content-display";
// ==================== 页脚组件 ====================
export { Footer } from "@iflux-art/ui";
// ==================== 分页组件 ====================
export { DocPagination } from "./pagination";
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
