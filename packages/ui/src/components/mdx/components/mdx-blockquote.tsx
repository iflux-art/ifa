"use client";

import { Quote } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

export interface MDXBlockquoteProps
  extends React.BlockquoteHTMLAttributes<HTMLQuoteElement> {
  citation?: string;
  author?: string;
}

const MDXBlockquote = React.forwardRef<HTMLQuoteElement, MDXBlockquoteProps>(
  ({ children, citation, author, className, ...props }, ref) => (
    <blockquote
      ref={ref}
      className={cn(
        "my-6 rounded-r-lg border-l-4 border-border bg-muted/50 px-6 py-4",
        "text-muted-foreground italic",
        "flex items-start gap-4",
        className,
      )}
      {...props}
    >
      <Quote className="mt-1 h-5 w-5 flex-shrink-0 text-muted-foreground" />
      <div className="flex-1">
        {children}
        {(citation ?? author) && (
          <footer className="mt-4 text-sm text-muted-foreground">
            {citation && (
              <cite className="font-medium not-italic">{citation}</cite>
            )}
            {author && (
              <span className="block text-xs">
                — <span className="font-medium">{author}</span>
              </span>
            )}
          </footer>
        )}
      </div>
    </blockquote>
  ),
);

MDXBlockquote.displayName = "MDXBlockquote";

export { MDXBlockquote };
