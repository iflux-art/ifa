/**
 * 优化的管理页面状态管理
 * 使用 Zustand 进行状态管理，优化数据流和状态更新逻辑
 */

import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import type { LinksItem } from "@/components/links/links-types";
import type { AdminPageState } from "./types";

interface AdminStore extends AdminPageState {
  // Actions
  setItems: (items: LinksItem[]) => void;
  setSearchTerm: (term: string) => void;
  setSelectedCategory: (category: string) => void;
  setShowAddDialog: (show: boolean) => void;
  setEditingItem: (item: LinksItem | null) => void;
  setDeletingItem: (item: LinksItem | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  addItem: (item: LinksItem) => void;
  updateItem: (item: LinksItem) => void;
  deleteItem: (id: string) => void;
  reset: () => void;
  resetFilters: () => void;
}

const initialState: AdminPageState = {
  items: [],
  searchTerm: "",
  selectedCategory: "",
  showAddDialog: false,
  editingItem: null,
  deletingItem: null,
  loading: false,
  error: null,
};

export const useAdminStore = create<AdminStore>()(
  subscribeWithSelector((set, get) => ({
    ...initialState,

    setItems: (items) => set({ items, error: null }),

    setSearchTerm: (searchTerm) => set({ searchTerm }),

    setSelectedCategory: (selectedCategory) => set({ selectedCategory }),

    setShowAddDialog: (showAddDialog) => set({ showAddDialog }),

    setEditingItem: (editingItem) => set({ editingItem }),

    setDeletingItem: (deletingItem) => set({ deletingItem }),

    setLoading: (loading) => set({ loading }),

    setError: (error) => set({ error }),

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

    reset: () => set(initialState),

    resetFilters: () =>
      set({
        searchTerm: "",
        selectedCategory: "",
      }),
  }))
);
