/**
 * 管理页面主组件
 * 重构后的管理页面，使用功能模块化组织
 */

"use client";

import { Plus } from "lucide-react";
import { memo } from "react";
import { AdminActions } from "@/components/links-admin/components";
import { AdminDialogs } from "./admin-dialogs";
import { DataTable } from "./data-table";
import { PageHeader } from "./page-header";
import { SearchFilter } from "./search-filter";
import type { AdminPageProps, PageAction } from "./types";
import { useAdminData } from "./use-admin-data";
import { useEventHandlers } from "./use-event-handlers";
import { useFilteredItems } from "./use-filtered-items";

/**
 * 获取页面级操作配置
 */
const getPageActions = (onAdd: () => void): PageAction[] => [
  {
    label: "添加网址",
    onClick: () => onAdd(),
    icon: Plus,
    key: "add-link",
  },
];

export const AdminPage = memo(({ initialData }: AdminPageProps) => {
  const {
    items,
    searchTerm,
    selectedCategory,
    showAddDialog,
    editingItem,
    deletingItem,
    categories,
    setSearchTerm,
    setSelectedCategory,
    setShowAddDialog,
    setEditingItem,
    setDeletingItem,
    loadData,
  } = useAdminData(initialData);

  const filteredItems = useFilteredItems(items, searchTerm, selectedCategory);

  const eventHandlers = useEventHandlers({
    loadData,
    setShowAddDialog,
    setEditingItem,
    setDeletingItem,
  });

  return (
    <>
      {/* 页面标题 */}
      <PageHeader itemCount={items.length} />

      {/* 操作按钮 */}
      <div className="mb-6">
        <AdminActions actions={getPageActions(() => setShowAddDialog(true))} />
      </div>

      {/* 搜索和过滤 */}
      <SearchFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        categories={categories}
      />

      {/* 网址表格 */}
      <DataTable data={filteredItems} onEdit={setEditingItem} onDelete={setDeletingItem} />

      {/* 对话框组件 */}
      <AdminDialogs
        showAddDialog={showAddDialog}
        editingItem={editingItem}
        deletingItem={deletingItem}
        onAddDialogChange={setShowAddDialog}
        onEditDialogChange={(open) => !open && setEditingItem(null)}
        onDeleteDialogChange={(open) => !open && setDeletingItem(null)}
        eventHandlers={eventHandlers}
      />
    </>
  );
});

AdminPage.displayName = "AdminPage";
