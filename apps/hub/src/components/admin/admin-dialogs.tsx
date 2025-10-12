/**
 * 管理页面对话框组件集合
 * 整合添加、编辑、删除对话框，优化加载和交互性能
 */

"use client";

import { memo } from "react";
import { AddDialog, DeleteDialog, EditDialog } from "@/components/links-admin";
import type { AdminDialogsProps } from "./types";

export const AdminDialogs = memo(
  ({
    showAddDialog,
    editingItem,
    deletingItem,
    onAddDialogChange,
    onEditDialogChange,
    onDeleteDialogChange,
    eventHandlers,
  }: AdminDialogsProps) => {
    return (
      <>
        {/* 添加对话框 */}
        <AddDialog
          open={showAddDialog}
          onOpenChange={onAddDialogChange}
          onSuccess={eventHandlers.handleAddSuccess}
          onError={eventHandlers.handleAddError}
        />

        {/* 编辑对话框 */}
        <EditDialog
          open={!!editingItem}
          item={editingItem}
          onOpenChange={onEditDialogChange}
          onSuccess={eventHandlers.handleEditSuccess}
          onError={eventHandlers.handleEditError}
        />

        {/* 删除对话框 */}
        <DeleteDialog
          item={deletingItem}
          onOpenChange={onDeleteDialogChange}
          onSuccess={eventHandlers.handleDeleteSuccess}
          onError={eventHandlers.handleDeleteError}
        />
      </>
    );
  }
);

AdminDialogs.displayName = "AdminDialogs";
