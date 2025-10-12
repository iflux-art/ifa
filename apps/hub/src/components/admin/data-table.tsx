/**
 * 优化的数据表格组件
 * 专门为管理页面优化的表格组件，提升大数据量性能
 */

"use client";

import { Edit, ExternalLink, Trash2 } from "lucide-react";
import Image from "next/image";
import { memo, useMemo } from "react";
import { useCategories } from "@/components/link-categories";
import type { LinksItem } from "@/components/links/links-types";
import { GenericDataTable } from "@/components/links-admin/components/generic-data-table";
import { Badge } from "@/components/ui/badge";
import type { DataTableAction, DataTableColumn, DataTableProps } from "./types";

/**
 * 获取表格列配置
 * 使用 useMemo 优化性能
 */
const useTableColumns = (
  getCategoryName: (categoryId: string) => string
): DataTableColumn<LinksItem>[] => {
  return useMemo(
    () => [
      {
        key: "icon",
        title: "图标",
        width: "44px",
        render: (_value: unknown, record: LinksItem, _index: number) => {
          const { icon, iconType } = record;
          const isImage = typeof icon === "string" && /^https?:\/\//.test(icon);
          return (
            <div className="mx-auto flex h-10 w-10 items-center justify-center">
              {iconType === "image" || isImage ? (
                <Image
                  src={icon}
                  alt=""
                  width={24}
                  height={24}
                  className="h-6 w-6 object-contain"
                  unoptimized
                />
              ) : (
                <span className="font-bold text-sm">{icon}</span>
              )}
            </div>
          );
        },
      },
      {
        key: "title",
        title: "标题",
        width: "450px",
        render: (value: unknown, record: LinksItem, _index: number) => (
          <div>
            <div className="font-medium">{String(value)}</div>
            <div className="max-w-[300px] truncate text-muted-foreground text-sm">{record.url}</div>
          </div>
        ),
      },
      {
        key: "category",
        title: "分类",
        width: "120px",
        render: (value: unknown, _record: LinksItem, _index: number) =>
          value ? getCategoryName(value as string) : "-",
      },
      {
        key: "tags",
        title: "标签",
        width: "350px",
        render: (value: unknown, _record: LinksItem, _index: number) => {
          const tags = value as string[];

          if (!tags?.length) {
            return null;
          }

          return (
            <div className="flex flex-wrap gap-1">
              {tags.slice(0, 3).map((tag: string) => (
                <Badge key={tag} variant="outline" className="px-2 text-xs">
                  {tag}
                </Badge>
              ))}
              {tags.length > 3 && (
                <Badge variant="outline" className="px-2 text-xs">
                  +{tags.length - 3}
                </Badge>
              )}
            </div>
          );
        },
      },
      {
        key: "featured",
        title: "状态",
        width: "100px",
        render: (value: unknown, _record: LinksItem, _index: number) =>
          (value as boolean) ? (
            <Badge variant="default" className="px-2 text-xs">
              精选
            </Badge>
          ) : (
            <Badge variant="outline" className="px-2 text-xs">
              普通
            </Badge>
          ),
      },
    ],
    [getCategoryName]
  );
};

/**
 * 获取表格行操作配置
 * 使用 useMemo 优化性能
 */
const useTableActions = (
  onEdit: (record: LinksItem) => void,
  onDelete: (record: LinksItem) => void
): DataTableAction<LinksItem>[] => {
  return useMemo(
    () => [
      {
        label: "访问",
        onClick: (record: LinksItem) => window.open(record.url, "_blank"),
        icon: ExternalLink,
        variant: "outline" as const,
      },
      {
        label: "编辑",
        onClick: (record: LinksItem) => onEdit(record),
        icon: Edit,
        variant: "outline" as const,
      },
      {
        label: "删除",
        onClick: (record: LinksItem) => onDelete(record),
        icon: Trash2,
        variant: "destructive" as const,
      },
    ],
    [onEdit, onDelete]
  );
};

export const DataTable = memo(({ data, onEdit, onDelete }: DataTableProps) => {
  const { getCategoryName } = useCategories();

  const columns = useTableColumns((categoryId: string) => getCategoryName(categoryId) ?? "");
  const actions = useTableActions(onEdit, onDelete);

  return <GenericDataTable data={data} columns={columns} actions={actions} />;
});

DataTable.displayName = "DataTable";
