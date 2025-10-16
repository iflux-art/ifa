import { create } from "zustand";

/**
 * 通知状态类型
 */
export interface NotificationState {
  hasUnread: boolean;
  count: number;
}

/**
 * 应用状态接口
 */
export interface AppUIState {
  // UI 状态
  isSidebarOpen: boolean;
  isSearchOpen: boolean;
  isMobile: boolean;

  // 应用配置
  language: string;

  // 通知状态
  notifications: NotificationState;

  // 加载状态
  isLoading: boolean;
  loadingMessage: string;

  // 错误状态
  error: string | null;
}

/**
 * 应用动作接口
 */
export interface AppActions {
  // UI Actions
  setIsSidebarOpen: (isOpen: boolean) => void;
  setIsSearchOpen: (isOpen: boolean) => void;
  setIsMobile: (isMobile: boolean) => void;
  toggleSidebar: () => void;
  toggleSearch: () => void;

  // 配置 Actions
  setLanguage: (language: string) => void;

  // 通知 Actions
  setNotifications: (notifications: NotificationState) => void;
  showNotificationBadge: () => void;
  hideNotificationBadge: () => void;
  incrementNotificationCount: () => void;

  // 加载 Actions
  setLoading: (isLoading: boolean, message?: string) => void;
  showError: (error: string) => void;
  clearError: () => void;

  // 重置 Actions
  resetState: () => void;
  resetUIState: () => void;
}

/**
 * 完整的Store接口
 */
export interface AppStore extends AppUIState, AppActions {}

/**
 * 初始状态常量
 */
export const INITIAL_APP_STATE: AppUIState = {
  isSidebarOpen: false,
  isSearchOpen: false,
  isMobile: false,
  language: "zh-CN",
  notifications: {
    hasUnread: false,
    count: 0,
  },
  isLoading: false,
  loadingMessage: "",
  error: null,
};

/**
 * 通知操作辅助函数
 */
const createNotificationActions = (set: (fn: (state: AppStore) => Partial<AppStore>) => void) => ({
  setNotifications: (notifications: NotificationState) => set(() => ({ notifications })),

  showNotificationBadge: () =>
    set((state) => ({
      notifications: {
        ...state.notifications,
        hasUnread: true,
        count: state.notifications.count + 1,
      },
    })),

  hideNotificationBadge: () =>
    set(() => ({
      notifications: {
        hasUnread: false,
        count: 0,
      },
    })),

  incrementNotificationCount: () =>
    set((state) => ({
      notifications: {
        ...state.notifications,
        count: state.notifications.count + 1,
        hasUnread: true,
      },
    })),
});

/**
 * 创建应用Store
 */
export const createAppStore = () => {
  return create<AppStore>()((set) => ({
    ...INITIAL_APP_STATE,

    // UI Actions
    setIsSidebarOpen: (isSidebarOpen) => set({ isSidebarOpen }),
    setIsSearchOpen: (isSearchOpen) => set({ isSearchOpen }),
    setIsMobile: (isMobile) => set({ isMobile }),
    toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
    toggleSearch: () => set((state) => ({ isSearchOpen: !state.isSearchOpen })),

    // 配置 Actions
    setLanguage: (language) => set({ language }),

    // 通知 Actions - 使用辅助函数
    ...createNotificationActions(set),

    // 加载 Actions
    setLoading: (isLoading, loadingMessage = "") => set({ isLoading, loadingMessage }),
    showError: (error) => set({ error, isLoading: false }),
    clearError: () => set({ error: null }),

    // 重置 Actions
    resetState: () => set(INITIAL_APP_STATE),
    resetUIState: () =>
      set({
        isSidebarOpen: false,
        isSearchOpen: false,
        error: null,
      }),
  }));
};

/**
 * 默认导出store实例
 */
export const useAppStore = createAppStore();
