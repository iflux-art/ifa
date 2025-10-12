/**
 * 优化的管理页面组件
 * 实现了静态生成、代码分割等优化
 */

"use client";

import { memo, useEffect, useMemo } from "react";
import type { LinksItem } from "@/components/links/links-types";
import type { LinksCategory } from "@/components/link-categories";
import { AdminActions } from "@/components/links-admin/components";
import { AdminDialogs } from "./admin-dialogs";
import { DataTable } from "./data-table";
import { PageHeader } from "./page-header";
import { SearchFilter } from "./search-filter";
import { useAdminStore } from "./admin-store";
import { useEventHandlers } from "./use-event-handlers";
import { useFilteredItems } from "./use-filtered-items";
import { loadAllLinksData } from "@/components/links/links-lib";
import { Plus } from "lucide-react";

// 定义组件属性类型
interface OptimizedAdminPageProps {
  initialData?: {
    items: LinksItem[];
    categories: LinksCategory[];
    totalItems: number;
    totalCategories: number;
    generatedAt: string;
  };
}

/**
 * 获取页面级操作配置
 */
const getPageActions = (onAdd: () => void) => [
  {
    label: "添加网址",
    onClick: onAdd,
    icon: Plus,
    key: "add-link",
  },
];

export const OptimizedAdminPage = memo(({ initialData }: OptimizedAdminPageProps) => {
  const {
    items,
    searchTerm,
    selectedCategory,
    showAddDialog,
    editingItem,
    deletingItem,
    setItems,
    setSearchTerm,
    setSelectedCategory,
    setShowAddDialog,
    setEditingItem,
    setDeletingItem,
  } = useAdminStore();

  // 使用初始数据或加载数据
  useEffect(() => {
    if (initialData && initialData.items.length > 0) {
      setItems(initialData.items);
    } else {
      // 如果没有初始数据，加载所有数据
      const loadData = async () => {
        try {
          const linksData = await loadAllLinksData();
          setItems(linksData.flat());
        } catch (err) {
          console.error("数据加载失败:", err);
        }
      };

      loadData();
    }
  }, [initialData, setItems]);

  // 生成分类数据 - 使用与首页相同的逻辑
  const categories = useMemo(() => {
    if (initialData?.categories && initialData.categories.length > 0) {
      return initialData.categories;
    }

    // 如果没有初始分类数据，返回空数组
    return [] as LinksCategory[];
  }, [initialData?.categories]);

  const filteredItems = useFilteredItems(items, searchTerm, selectedCategory);

  const eventHandlers = useEventHandlers({
    loadData: async () => {
      try {
        const linksData = await loadAllLinksData();
        setItems(linksData.flat());
      } catch (err) {
        console.error("数据加载失败:", err);
      }
    },
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

OptimizedAdminPage.displayName = "OptimizedAdminPage";
