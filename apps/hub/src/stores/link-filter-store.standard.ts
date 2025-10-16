import { create } from "zustand";
import type { LinksItem } from "@/components/features/links/links-types";

/**
 * 过滤器状态接口
 */
export interface FilterCriteria {
  selectedCategory: string;
  selectedTag: string;
}

/**
 * 链接过滤状态接口
 */
export interface LinkFilterState extends FilterCriteria {
  // 过滤后的数据
  filteredItems: LinksItem[];
  // 可用标签
  availableTags: string[];
}

/**
 * 链接过滤动作接口
 */
export interface LinkFilterActions {
  // 单独设置过滤条件
  setSelectedCategory: (category: string) => void;
  setSelectedTag: (tag: string) => void;

  // 批量设置过滤条件
  setFilterCriteria: (criteria: Partial<FilterCriteria>) => void;

  // 数据管理
  setFilteredItems: (items: LinksItem[]) => void;
  setAvailableTags: (tags: string[]) => void;

  // 重置操作
  resetFilters: () => void;
  resetState: () => void;

  // 便捷方法
  hasActiveFilters: () => boolean;
  clearAllFilters: () => void;
}

/**
 * 完整的Store接口
 */
export interface LinkFilterStore extends LinkFilterState, LinkFilterActions {}

/**
 * 初始状态常量
 */
export const INITIAL_FILTER_STATE: LinkFilterState = {
  selectedCategory: "",
  selectedTag: "",
  filteredItems: [],
  availableTags: [],
};

/**
 * 创建链接过滤Store
 */
export const createLinkFilterStore = () => {
  return create<LinkFilterStore>()((set, get) => ({
    ...INITIAL_FILTER_STATE,

    // 单独设置过滤条件
    setSelectedCategory: (selectedCategory) => set({ selectedCategory }),
    setSelectedTag: (selectedTag) => set({ selectedTag }),

    // 批量设置过滤条件
    setFilterCriteria: (criteria) => set((state) => ({ ...state, ...criteria })),

    // 数据管理
    setFilteredItems: (filteredItems) => set({ filteredItems }),
    setAvailableTags: (availableTags) => set({ availableTags }),

    // 重置操作
    resetFilters: () =>
      set({
        selectedCategory: "",
        selectedTag: "",
        filteredItems: [],
      }),

    resetState: () => set(INITIAL_FILTER_STATE),

    // 便捷方法
    hasActiveFilters: () => {
      const state = get();
      return Boolean(state.selectedCategory || state.selectedTag);
    },

    clearAllFilters: () =>
      set({
        selectedCategory: "",
        selectedTag: "",
      }),
  }));
};

/**
 * 默认导出store实例
 */
export const useLinkFilterStore = createLinkFilterStore();
