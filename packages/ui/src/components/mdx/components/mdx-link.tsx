"use client";

import { ExternalLink } from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { cn } from "@/lib/utils";

const isExternalLink = (href: string): boolean => {
  try {
    return (
      href.startsWith("http") ||
      href.startsWith("mailto:") ||
      href.startsWith("tel:")
    );
  } catch {
    return false;
  }
};

export interface MDXLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  external?: boolean;
  openInNewTab?: boolean;
  showExternalIcon?: boolean;
}

const MDXLink = React.forwardRef<HTMLAnchorElement, MDXLinkProps>(
  (
    {
      href,
      children,
      className,
      external,
      openInNewTab = true,
      showExternalIcon = true,
      ...props
    },
    ref,
  ) => {
    if (!href) return null;

    const isExternal = external ?? isExternalLink(href);

    // 下划线动画的类名
    const underlineClasses = cn(
      "after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5",
      "after:bg-current after:scale-x-0 after:origin-left after:transition-all after:duration-300 after:ease-out",
      "hover:after:scale-x-100",
    );

    if (isExternal) {
      return (
        <a
          ref={ref}
          href={href}
          className={cn(
            "font-medium text-primary hover:text-primary/80",
            "relative inline-flex items-center",
            underlineClasses,
            className,
          )}
          target={openInNewTab ? "_blank" : undefined}
          rel="noopener noreferrer"
          {...props}
        >
          {children}
          {showExternalIcon && (
            <ExternalLink className="ml-1 h-4 w-4 flex-shrink-0 whitespace-nowrap" />
          )}
        </a>
      );
    }

    return (
      <Link
        ref={ref}
        href={href}
        className={cn(
          "font-medium text-primary hover:text-primary/80",
          "relative inline-flex items-center",
          underlineClasses,
          className,
        )}
        {...props}
      >
        {children}
      </Link>
    );
  },
);

MDXLink.displayName = "MDXLink";

export { MDXLink };
