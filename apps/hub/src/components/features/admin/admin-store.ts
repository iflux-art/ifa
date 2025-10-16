/**
 * 优化的管理页面状态管理
 * 使用 Zustand 进行状态管理，优化数据流和状态更新逻辑
 */

import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import type { LinksItem } from "@/components/features/links/links-types";
import type { AdminPageState } from "./types";

/**
 * 对话框状态类型
 */
export interface DialogState {
  showAddDialog: boolean;
  editingItem: LinksItem | null;
  deletingItem: LinksItem | null;
}

/**
 * 过滤状态类型
 */
export interface AdminFilterState {
  searchTerm: string;
  selectedCategory: string;
}

/**
 * 管理Store接口
 */
interface AdminStore extends AdminPageState {
  // 基础数据操作
  setItems: (items: LinksItem[]) => void;
  addItem: (item: LinksItem) => void;
  updateItem: (item: LinksItem) => void;
  deleteItem: (id: string) => void;

  // 过滤操作
  setSearchTerm: (term: string) => void;
  setSelectedCategory: (category: string) => void;
  setFilterState: (filter: Partial<AdminFilterState>) => void;

  // 对话框操作
  setShowAddDialog: (show: boolean) => void;
  setEditingItem: (item: LinksItem | null) => void;
  setDeletingItem: (item: LinksItem | null) => void;
  closeAllDialogs: () => void;

  // 状态管理
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;

  // 重置操作
  reset: () => void;
  resetFilters: () => void;

  // 便捷方法
  hasActiveFilters: () => boolean;
  getDialogState: () => DialogState;
}

/**
 * 初始状态常量
 */
const INITIAL_ADMIN_STATE: AdminPageState = {
  items: [],
  searchTerm: "",
  selectedCategory: "",
  showAddDialog: false,
  editingItem: null,
  deletingItem: null,
  loading: false,
  error: null,
};

/**
 * 创建对话框操作辅助函数
 */
const createDialogActions = (set: (fn: (state: AdminStore) => Partial<AdminStore>) => void) => ({
  setShowAddDialog: (showAddDialog: boolean) => set(() => ({ showAddDialog })),
  setEditingItem: (editingItem: LinksItem | null) => set(() => ({ editingItem })),
  setDeletingItem: (deletingItem: LinksItem | null) => set(() => ({ deletingItem })),
  closeAllDialogs: () =>
    set(() => ({
      showAddDialog: false,
      editingItem: null,
      deletingItem: null,
    })),
});

/**
 * 创建过滤操作辅助函数
 */
const createFilterActions = (set: (fn: (state: AdminStore) => Partial<AdminStore>) => void) => ({
  setSearchTerm: (searchTerm: string) => set(() => ({ searchTerm })),
  setSelectedCategory: (selectedCategory: string) => set(() => ({ selectedCategory })),
  setFilterState: (filter: Partial<AdminFilterState>) => set((state) => ({ ...state, ...filter })),
  resetFilters: () =>
    set(() => ({
      searchTerm: "",
      selectedCategory: "",
    })),
});

/**
 * 管理Store实例
 */
export const useAdminStore = create<AdminStore>()(
  subscribeWithSelector((set, get) => ({
    ...INITIAL_ADMIN_STATE,

    // 基础数据操作
    setItems: (items) => set({ items, error: null }),

    addItem: (item) => {
      const { items } = get();
      set({ items: [...items, item] });
    },

    updateItem: (updatedItem) => {
      const { items } = get();
      set({
        items: items.map((item) => (item.id === updatedItem.id ? updatedItem : item)),
      });
    },

    deleteItem: (id) => {
      const { items } = get();
      set({ items: items.filter((item) => item.id !== id) });
    },

    // 过滤操作 - 使用辅助函数
    ...createFilterActions(set),

    // 对话框操作 - 使用辅助函数
    ...createDialogActions(set),

    // 状态管理
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),
    clearError: () => set({ error: null }),

    // 重置操作
    reset: () => set(INITIAL_ADMIN_STATE),

    // 便捷方法
    hasActiveFilters: () => {
      const state = get();
      return Boolean(state.searchTerm || state.selectedCategory);
    },

    getDialogState: () => {
      const state = get();
      return {
        showAddDialog: state.showAddDialog,
        editingItem: state.editingItem,
        deletingItem: state.deletingItem,
      };
    },
  }))
);
