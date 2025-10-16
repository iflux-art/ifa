/**
 * 管理页面数据表格组件
 * 提供链接数据的展示和操作功能
 */

"use client";

import { Edit, ExternalLink, Trash2 } from "lucide-react";
import Image from "next/image";
import { memo, useMemo } from "react";
import { useCategories } from "@/components/features/link-categories";
import type { LinksItem } from "@/components/features/links/links-types";
import type {
  DataTableAction,
  DataTableColumn,
} from "@/components/features/links-admin/components/generic-data-table";
import { GenericDataTable } from "@/components/features/links-admin/components/generic-data-table";
import { Badge } from "@/components/ui/badge";

interface DataTableProps {
  data: LinksItem[];
  onEdit: (record: LinksItem) => void;
  onDelete: (record: LinksItem) => void;
}

/**
 * 获取表格列配置
 * 使用 useMemo 优化性能
 */
const useTableColumns = (
  getCategoryName: (categoryId: string) => string | undefined
): DataTableColumn<LinksItem>[] => {
  return useMemo(
    () => [
      {
        key: "title",
        title: "标题",
        width: "150px",
        render: (_value: unknown, record: LinksItem, _index: number) => (
          <div className="flex items-center gap-2">
            {record.icon ? (
              <div className="relative h-6 w-6 rounded border">
                <Image
                  src={record.icon}
                  alt={record.title}
                  fill
                  className="rounded object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                  }}
                />
              </div>
            ) : (
              <div className="flex h-6 w-6 items-center justify-center rounded border bg-muted font-medium text-xs">
                {record.title.charAt(0).toUpperCase()}
              </div>
            )}
            <span className="max-w-[100px] truncate font-medium">{record.title}</span>
          </div>
        ),
      },
      {
        key: "url",
        title: "网址",
        width: "200px",
        render: (value: unknown, _record: LinksItem, _index: number) => (
          <a
            href={value as string}
            target="_blank"
            rel="noopener noreferrer"
            className="block max-w-[190px] truncate text-primary hover:underline"
          >
            {value as string}
          </a>
        ),
      },
      {
        key: "category",
        title: "分类",
        width: "120px",
        render: (value: unknown, _record: LinksItem, _index: number) => {
          const categoryName = getCategoryName(value as string);
          return (
            <Badge variant="secondary" className="px-2 text-xs">
              {categoryName}
            </Badge>
          );
        },
      },
      {
        key: "tags",
        title: "标签",
        width: "150px",
        render: (value: unknown, _record: LinksItem, _index: number) => (
          <div className="flex flex-wrap gap-1">
            {(value as string[])
              .slice(0, 2)
              .map((tag: string) => (
                <Badge key={tag} variant="outline" className="px-1.5 py-0.5 text-xs">
                  {tag}
                </Badge>
              ))
              .concat(
                (value as string[]).length > 2
                  ? [
                      <Badge
                        key="more"
                        variant="outline"
                        className="px-1.5 py-0.5 text-muted-foreground text-xs"
                      >
                        +{(value as string[]).length - 2}
                      </Badge>,
                    ]
                  : []
              )}
          </div>
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
