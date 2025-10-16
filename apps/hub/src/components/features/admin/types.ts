/**
 * 管理页面相关类型定义
 * 内联类型定义，避免外部依赖
 */

import type { LinksCategory } from "@/components/features/link-categories";
import type { LinksItem } from "@/components/features/links/links-types";

/**
 * 管理页面状态接口
 */
export interface AdminPageState {
  /** 链接项数组 */
  items: LinksItem[];
  /** 搜索关键词 */
  searchTerm: string;
  /** 选中的分类 */
  selectedCategory: string;
  /** 是否显示添加对话框 */
  showAddDialog: boolean;
  /** 正在编辑的项目 */
  editingItem: LinksItem | null;
  /** 正在删除的项目 */
  deletingItem: LinksItem | null;
  /** 加载状态 */
  loading: boolean;
  /** 错误信息 */
  error: string | null;
}

/**
 * 管理页面组件 Props
 */
export interface AdminPageProps {
  /** 初始数据 */
  initialData?: LinksItem[];
}

/**
 * 数据表格列配置
 */
export interface DataTableColumn<T> {
  /** 列键名 */
  key: keyof T;
  /** 列标题 */
  title: string;
  /** 列宽度 */
  width?: string;
  /** 自定义渲染函数 */
  render?: (value: unknown, record: T, index: number) => React.ReactNode;
}

/**
 * 数据表格操作配置
 */
export interface DataTableAction<T> {
  /** 操作标签 */
  label: string;
  /** 点击回调 */
  onClick: (record: T) => void;
  /** 图标组件 */
  icon: React.ComponentType;
  /** 按钮样式变体 */
  variant: "default" | "outline" | "destructive";
}

/**
 * 搜索过滤组件 Props
 */
export interface SearchFilterProps {
  /** 搜索关键词 */
  searchTerm: string;
  /** 搜索变化回调 */
  onSearchChange: (term: string) => void;
  /** 选中的分类 */
  selectedCategory: string;
  /** 分类变化回调 */
  onCategoryChange: (category: string) => void;
  /** 分类列表 */
  categories: LinksCategory[];
}

/**
 * 页面标题组件 Props
 */
export interface PageHeaderProps {
  /** 项目总数 */
  itemCount: number;
}

/**
 * 数据表格组件 Props
 */
export interface DataTableProps {
  /** 表格数据 */
  data: LinksItem[];
  /** 编辑回调 */
  onEdit: (item: LinksItem) => void;
  /** 删除回调 */
  onDelete: (item: LinksItem) => void;
}

/**
 * 管理对话框组件 Props
 */
export interface AdminDialogsProps {
  /** 是否显示添加对话框 */
  showAddDialog: boolean;
  /** 正在编辑的项目 */
  editingItem: LinksItem | null;
  /** 正在删除的项目 */
  deletingItem: LinksItem | null;
  /** 添加对话框状态变化回调 */
  onAddDialogChange: (open: boolean) => void;
  /** 编辑对话框状态变化回调 */
  onEditDialogChange: (open: boolean) => void;
  /** 删除对话框状态变化回调 */
  onDeleteDialogChange: (open: boolean) => void;
  /** 事件处理器 */
  eventHandlers: EventHandlers;
}

/**
 * 事件处理器接口
 */
export interface EventHandlers {
  /** 添加成功回调 */
  handleAddSuccess: (item: LinksItem) => void;
  /** 编辑成功回调 */
  handleEditSuccess: () => void;
  /** 删除成功回调 */
  handleDeleteSuccess: () => void;
  /** 添加错误回调 */
  handleAddError: () => void;
  /** 编辑错误回调 */
  handleEditError: () => void;
  /** 删除错误回调 */
  handleDeleteError: () => void;
}

/**
 * 页面操作配置
 */
export interface PageAction {
  /** 操作标签 */
  label: string;
  /** 点击回调 */
  onClick: () => void;
  /** 图标组件 */
  icon: React.ComponentType;
  /** 操作键名 */
  key: string;
}
