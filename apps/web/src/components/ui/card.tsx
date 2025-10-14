import type * as React from "react";

import { cn } from "@/lib/utils";

/** Card 组件 Props 接口 */
export interface CardProps extends React.ComponentProps<"div"> {
  /** 卡片变体 */
  variant?: "default" | "outlined" | "elevated";
  /** 是否可点击 */
  clickable?: boolean;
}

/** Card Header Props 接口 */
export interface CardHeaderProps extends React.ComponentProps<"div"> {
  /** 是否显示边框 */
  bordered?: boolean;
}

/** Card Content Props 接口 */
export interface CardContentProps extends React.ComponentProps<"div"> {
  /** 内边距大小 */
  padding?: "none" | "sm" | "md" | "lg";
}

/** Card Footer Props 接口 */
export interface CardFooterProps extends React.ComponentProps<"div"> {
  /** 是否显示边框 */
  bordered?: boolean;
  /** 对齐方式 */
  align?: "left" | "center" | "right" | "between";
}

const Card = ({ className, variant = "default", clickable = false, ...props }: CardProps) => (
  <div
    data-slot="card"
    className={cn(
      "flex flex-col rounded-xl border bg-card text-card-foreground shadow-xs",
      {
        "cursor-pointer transition-shadow hover:shadow-md": clickable,
        "border-2": variant === "outlined",
        "shadow-lg": variant === "elevated",
      },
      className
    )}
    {...props}
  />
);

const CardHeader = ({ className, bordered = false, ...props }: CardHeaderProps) => (
  <div
    data-slot="card-header"
    className={cn(
      "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto]",
      {
        "border-b pb-6": bordered,
      },
      className
    )}
    {...props}
  />
);

const CardTitle = ({ className, ...props }: React.ComponentProps<"div">) => (
  <div data-slot="card-title" className={cn("font-semibold leading-none", className)} {...props} />
);

const CardDescription = ({ className, ...props }: React.ComponentProps<"div">) => (
  <div
    data-slot="card-description"
    className={cn("text-muted-foreground text-sm", className)}
    {...props}
  />
);

const CardAction = ({ className, ...props }: React.ComponentProps<"div">) => (
  <div
    data-slot="card-action"
    className={cn("col-start-2 row-span-2 row-start-1 self-start justify-self-end", className)}
    {...props}
  />
);

const CardContent = ({ className, padding = "md", ...props }: CardContentProps) => (
  <div
    data-slot="card-content"
    className={cn(
      {
        "p-0": padding === "none",
        "p-3": padding === "sm",
        "px-6": padding === "md",
        "p-8": padding === "lg",
      },
      className
    )}
    {...props}
  />
);

const CardFooter = ({ className, bordered = false, align = "left", ...props }: CardFooterProps) => (
  <div
    data-slot="card-footer"
    className={cn(
      "flex items-center px-6",
      {
        "border-t pt-6": bordered,
        "justify-start": align === "left",
        "justify-center": align === "center",
        "justify-end": align === "right",
        "justify-between": align === "between",
      },
      className
    )}
    {...props}
  />
);

export { Card, CardHeader, CardFooter, CardTitle, CardAction, CardDescription, CardContent };
