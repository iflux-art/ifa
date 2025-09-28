"use client";

import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const codeVariants = cva("font-mono text-sm", {
  variants: {
    variant: {
      inline:
        "rounded-md border px-2 py-0.5 text-xs font-medium whitespace-nowrap " +
        "[&>svg]:size-3 [&>svg]:pointer-events-none " +
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] " +
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 " +
        "aria-invalid:border-destructive transition-[color,box-shadow] " +
        "align-baseline leading-none border-transparent bg-primary text-primary-foreground " +
        "[&_.code-content]:relative [&_.code-content]:z-10",
      block: "block",
    },
  },
  defaultVariants: {
    variant: "inline",
  },
});

export interface MDXCodeProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof codeVariants> {
  inline?: boolean;
  language?: string;
  fileName?: string;
}

const MDXCode = React.forwardRef<HTMLElement, MDXCodeProps>(
  (
    {
      children,
      className,
      inline = true,
      language,
      fileName,
      variant,
      ...props
    },
    ref,
  ) => {
    // For inline code, we apply custom styling and remove backticks
    if (inline) {
      // Remove backticks from the content if present
      let content = children;
      if (typeof children === "string") {
        // 更强大的反引号移除方法
        content = children.replace(/^`(.*)`$/, "$1");
      }

      return (
        <code
          ref={ref}
          className={cn(codeVariants({ variant: "inline" }), className)}
          {...props}
        >
          {/* 使用data属性和CSS来完全控制显示，避免反引号问题 */}
          <span data-content={content} className="code-content">
            {content}
          </span>
        </code>
      );
    }

    // For block code, we let the MDXPre component handle styling
    return (
      <code
        ref={ref}
        className={cn(codeVariants({ variant: "block" }), className)}
        {...props}
      >
        {children}
      </code>
    );
  },
);

MDXCode.displayName = "MDXCode";

export { MDXCode };
