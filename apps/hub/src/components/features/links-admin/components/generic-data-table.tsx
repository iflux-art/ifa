import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// ==================== 表格相关类型定义 ====================
/**
 * 数据表格列配置
 */
export interface DataTableColumn<T> {
  /** 列对应的键 */
  key: keyof T;
  /** 列标题 */
  title: string;
  /** 列宽度 */
  width?: string | number;
  /** 文本对齐方式 */
  align?: "left" | "center" | "right";
  /** 自定义渲染函数 */
  render?: (value: unknown, record: T, index: number) => ReactNode;
}

/**
 * 数据表格操作项
 */
export interface DataTableAction<T> {
  /** 操作标签 */
  label: string;
  /** 操作图标 */
  icon?: React.ComponentType<{ className?: string }>;
  /** 点击事件处理函数 */
  onClick: (record: T, index: number) => void;
  /** 是否禁用 */
  disabled?: (record: T) => boolean;
  /** 按钮变体 */
  variant?: "default" | "outline" | "ghost" | "destructive";
}

/**
 * 数据表格 Props
 */
export interface GenericDataTableProps<T> {
  /** 表格标题 */
  title?: string;
  /** 表格数据 */
  data: T[];
  /** 列配置 */
  columns: DataTableColumn<T>[];
  /** 操作项 */
  actions?: DataTableAction<T>[];
}

// 获取对齐类名函数
function getAlignClass(align?: "left" | "center" | "right"): string {
  if (align === "center") {
    return "text-center";
  }
  if (align === "right") {
    return "text-right";
  }
  return "text-left";
}

// 表格头部组件
interface TableHeaderProps<T> {
  columns: DataTableColumn<T>[];
  hasActions: boolean;
}

const TableHeader = <T extends object>({ columns, hasActions }: TableHeaderProps<T>) => (
  <thead>
    <tr className="border-b bg-muted/50">
      {columns.map((column) => (
        <th
          key={String(column.key)}
          className={`px-4 py-3 text-left font-medium text-sm ${getAlignClass(column.align)}`}
          style={{ width: column.width }}
        >
          {column.title}
        </th>
      ))}
      {hasActions && <th className="px-4 py-3 text-center font-medium text-sm">操作</th>}
    </tr>
  </thead>
);

// 表格单元格组件
interface TableCellProps<T> {
  column: DataTableColumn<T>;
  record: T;
  recordIndex: number;
}

const TableCell = <T extends object>({ column, record, recordIndex }: TableCellProps<T>) => (
  <td className={`px-4 py-3 text-sm ${getAlignClass(column.align)}`}>
    {column.render
      ? column.render(record[column.key], record, recordIndex)
      : String(record[column.key] ?? "")}
  </td>
);

// 操作列组件
interface ActionsColumnProps<T> {
  actions: DataTableAction<T>[];
  record: T;
  recordIndex: number;
}

const ActionsColumn = <T extends object>({
  actions,
  record,
  recordIndex,
}: ActionsColumnProps<T>) => (
  <td className="px-4 py-3 text-center">
    <div className="flex items-center justify-center gap-2">
      {actions.map((action) => {
        const IconComponent = action.icon;
        const isDisabled = action.disabled?.(record) ?? false;
        return (
          <Button
            key={action.label}
            variant={action.variant ?? "outline"}
            size="sm"
            onClick={() => action.onClick(record, recordIndex)}
            disabled={isDisabled}
            className="flex items-center gap-1"
          >
            {IconComponent && <IconComponent className="h-3 w-3" />}
            {action.label}
          </Button>
        );
      })}
    </div>
  </td>
);

// 表格行组件
interface TableRowProps<T> {
  record: T;
  recordIndex: number;
  columns: DataTableColumn<T>[];
  actions?: DataTableAction<T>[];
}

const TableRow = <T extends object>({
  record,
  recordIndex,
  columns,
  actions,
}: TableRowProps<T>) => {
  return (
    <tr className="border-b hover:bg-muted/50">
      {columns.map((column) => (
        <TableCell
          key={String(column.key)}
          column={column}
          record={record}
          recordIndex={recordIndex}
        />
      ))}
      {actions && actions.length > 0 && (
        <ActionsColumn actions={actions} record={record} recordIndex={recordIndex} />
      )}
    </tr>
  );
};

export const GenericDataTable = <T extends object>({
  title,
  data,
  columns,
  actions,
}: GenericDataTableProps<T>) => {
  const hasActions = Boolean(actions && actions.length > 0);

  return (
    <Card>
      {title && (
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <TableHeader columns={columns} hasActions={hasActions} />
            <tbody>
              {data && data.length > 0 ? (
                data.map((record, recordIndex) => {
                  // 生成 key，优先使用记录的 id，否则使用索引
                  const key =
                    "id" in record && typeof record.id === "string"
                      ? record.id
                      : `record-${recordIndex}`;

                  return (
                    <TableRow
                      key={key}
                      record={record}
                      recordIndex={recordIndex}
                      columns={columns}
                      actions={actions}
                    />
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={columns.length + (hasActions ? 1 : 0)}
                    className="px-4 py-8 text-center text-muted-foreground"
                  >
                    暂无数据
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};
