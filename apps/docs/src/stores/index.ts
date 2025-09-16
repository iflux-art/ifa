// Zustand stores 入口文件
// 标准化store实现（重构完成）

// export { useFriendsStore } from "./friends-store.standard";  // 已移除友链版块
export { useLayoutStore } from "@/features/layout/layout-store.standard";
// 已移动到 src/features/navbar 目录下集中管理
// export { useNavbarStore } from "./navbar-store.standard";
// 已移动到 src/features/search 目录下集中管理
// export { useSearchStore } from "./search-store.standard";
// 已移动到 src/features/theme 目录下集中管理
export { useThemeStore } from "@/features/theme";
export { useAppStore } from "./app-store.standard";
// export { useBlogPageStore } from "./blog-page-store.standard";  // 已移除 blog 版块
// export { useBlogStore } from "./blog-store.standard";  // 已移除 blog 版块
export { useDocsGlobalStructureStore } from "./docs-global-structure-store.standard";
export { useDocsStore } from "./docs-store.standard";
