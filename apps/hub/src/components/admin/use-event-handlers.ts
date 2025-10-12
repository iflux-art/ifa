/**
 * 管理页面事件处理器 hook
 * 统一管理所有事件处理逻辑
 */

import { useCallback } from "react";
import type { LinksItem } from "@/components/links/links-types";
import type { EventHandlers } from "./types";

interface UseEventHandlersParams {
  loadData: () => Promise<void>;
  setShowAddDialog: (show: boolean) => void;
  setEditingItem: (item: LinksItem | null) => void;
  setDeletingItem: (item: LinksItem | null) => void;
}

/**
 * 事件处理器 hook
 * 提供统一的事件处理逻辑
 */
export const useEventHandlers = ({
  loadData,
  setShowAddDialog,
  setEditingItem,
  setDeletingItem,
}: UseEventHandlersParams): EventHandlers => {
  const handleAddSuccess = useCallback(
    (_item: LinksItem) => {
      void loadData();
      setShowAddDialog(false);
    },
    [loadData, setShowAddDialog]
  );

  const handleEditSuccess = useCallback(() => {
    void loadData();
    setEditingItem(null);
  }, [loadData, setEditingItem]);

  const handleDeleteSuccess = useCallback(() => {
    void loadData();
    setDeletingItem(null);
  }, [loadData, setDeletingItem]);

  const handleAddError = useCallback(() => {
    // 可以在这里添加错误处理逻辑
    console.error("添加失败");
  }, []);

  const handleEditError = useCallback(() => {
    // 可以在这里添加错误处理逻辑
    console.error("编辑失败");
  }, []);

  const handleDeleteError = useCallback(() => {
    // 可以在这里添加错误处理逻辑
    console.error("删除失败");
  }, []);

  return {
    handleAddSuccess,
    handleEditSuccess,
    handleDeleteSuccess,
    handleAddError,
    handleEditError,
    handleDeleteError,
  };
};
