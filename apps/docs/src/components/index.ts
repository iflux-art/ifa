/**
 * 全局共享组件统一导出
 * 集中管理所有通用共享组件，便于引用和维护
 * 业务相关组件已移动到对应的 features 目录中
 */

// ==================== 主题提供者 ====================
export { ThemeProvider } from "@iflux-art/ui/client";
// ==================== 页脚组件 ====================
export { Footer } from "@iflux-art/ui/footer";
// MDX 组件导出
export {
  ClientMDXRenderer,
  MDXBlockquote,
  MDXCode,
  MDXComponents,
  MDXImg,
  MDXLink,
  MDXPre,
} from "@/components/mdx";
export type { CodeBlockProps } from "@/components/mdx/code";
// 代码高亮组件导出
export { CodeBlock } from "@/components/mdx/code";
// ==================== 面包屑组件 ====================
export { Breadcrumb } from "./content-header/breadcrumb";
// ==================== 布局组件 ====================
export { ClientLayout } from "./client-layout";
// ==================== 评论组件 ====================
export { TwikooComment } from "@iflux-art/ui/client";
export type { ContentDisplayProps, ContentType } from "./content-display";
// ==================== 内容展示组件 ====================
export { ContentDisplay } from "./content-display";
// ==================== 分页组件 ====================
export { DocPagination } from "./widgets/pagination";
export type { SearchOptions, SearchResponse, SearchResult } from "./search";
// ==================== 搜索组件 ====================
export { SearchBar } from "./search/search-bar";
export { SearchButton } from "./search/search-button";
export { SearchDialog } from "./search/search-dialog";
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
