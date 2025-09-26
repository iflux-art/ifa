"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/components";
import { AddDialog } from "@/components/admin/add-dialog";
import { AdminLayout } from "@/components/admin/admin-layout";
import { EditDialog } from "@/components/admin/edit-dialog";
import { useAdminData } from "@/components/admin/use-admin-data";
import {
  getTableActions,
  getTableColumns,
} from "@/components/links/tables/table-config";
import type { LinksItem } from "@/components/links/types";
import { Button } from "@/components/ui/button";

export const AdminPage = () => {
  const { items, loading, error, refreshData, deleteItem } = useAdminData();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<LinksItem | null>(null);

  // 页面加载时刷新数据
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const _handleAdd = async (
    _data: Omit<LinksItem, "id" | "createdAt" | "updatedAt">,
  ) => {
    // 这个函数暂时未使用，保留以备将来使用
    // 由于函数体为空，所以不会有错误处理代码
  };

  const _handleEdit = async (_id: string, _data: Partial<LinksItem>) => {
    // 这个函数暂时未使用，保留以备将来使用
    // 由于函数体为空，所以不会有错误处理代码
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteItem(id);
      refreshData();
    } catch (err) {
      console.error("删除失败:", err);
    }
  };

  // 获取分类名称的函数
  const getCategoryName = (categoryId: string) => {
    // 这里应该从分类数据中获取名称
    // 临时返回分类ID作为名称
    return categoryId;
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">加载中...</p>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-destructive mb-4">加载失败: {error}</p>
          <Button onClick={refreshData}>重试</Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-6 flex justify-end">
        <Button onClick={() => setIsAddDialogOpen(true)}>添加链接</Button>
      </div>
      <DataTable
        data={items}
        columns={getTableColumns(getCategoryName)}
        actions={getTableActions(
          (item) => setEditingItem(item),
          (item) => handleDelete(item.id),
        )}
      />
      <AddDialog
        open={isAddDialogOpen}
        onOpenChange={(open: boolean) => setIsAddDialogOpen(open)}
        onSuccess={(newItem: LinksItem) => {
          console.log("添加成功:", newItem);
          refreshData();
        }}
        onError={(error: string) => console.error("添加失败:", error)}
      />
      <EditDialog
        item={editingItem}
        onOpenChange={(open: boolean) => !open && setEditingItem(null)}
        onSuccess={() => {
          console.log("编辑成功");
          refreshData();
        }}
        onError={(error: string) => console.error("编辑失败:", error)}
      />
    </AdminLayout>
  );
};
