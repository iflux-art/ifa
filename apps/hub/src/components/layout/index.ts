/**
 * 通用布局组件导出
 * 集中导出所有通用布局组件，便于引用
 *
 * 注意：为了向后兼容性，这里重新导出了新的组件结构
 * LinksPage -> OptimizedHomePage (from @/components/home)
 * AdminPage -> OptimizedAdminPage (from @/components/admin)
 * LinksContent -> LinksContent (from @/components/home)
 */

// 向后兼容性导出 - 重新导出新的组件结构
// 管理页面组件 - 从新的 admin 模块导出
export { OptimizedAdminPage as AdminPage } from "@/components/admin";
// 导航相关组件
export { Footer } from "@/components/footer";
// 链接内容组件 - 从新的 home 模块导出
// 链接页面组件 - 重新导出为 OptimizedHomePage，保持 LinksPage 别名以兼容现有代码
export { OptimizedHomePage as LinksPage, LinksContent } from "@/components/home";
// 配置信息
export {
  ADMIN_MENU_ITEMS,
  NAV_DESCRIPTIONS,
  NAV_ITEMS,
  NAV_PATHS,
} from "@/components/navbar/nav-config";
