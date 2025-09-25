/**
 * 组件库统一导出
 * 按功能模块组织导出，便于按需导入
 */

// 底栏组件
export { Footer } from "@iflux-art/ui/footer";
// 布局组件
export { ClientLayout } from "./client-layout";
// 类型导出
export type { PageContainerProps } from "./layout";
// 布局组件
export { PageContainer } from "./layout";
// 链接组件
export {
  DataTable,
  getPageActions,
  getTableActions,
  getTableColumns,
  LinkCard,
  LinksContent,
  LinksForm,
  LinksPageContainer,
  LinksSidebar,
} from "./links";
// UI 组件
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
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  Switch,
} from "./ui";
