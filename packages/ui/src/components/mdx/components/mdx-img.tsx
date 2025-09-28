import Image from "next/image";
import * as React from "react";

import { cn } from "@/lib/utils";

export interface MDXImgProps
  extends React.ComponentPropsWithoutRef<typeof Image> {
  src: string;
  alt: string;
}

const MDXImg = React.forwardRef<HTMLImageElement, MDXImgProps>(
  ({ src, alt, className, ...props }, ref) => {
    // Set default dimensions if not provided
    const width = props.width || 800;
    const height = props.height || 450;

    const isRemote = src.startsWith("http");

    return (
      <Image
        ref={ref}
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={cn(
          "my-6 w-full max-w-full rounded-lg border border-border bg-muted object-cover shadow-md",
          className,
        )}
        style={
          isRemote ? undefined : { position: "relative", aspectRatio: "16/9" }
        }
        sizes={
          isRemote
            ? undefined
            : "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        }
        {...props}
      />
    );
  },
);

MDXImg.displayName = "MDXImg";

export { MDXImg };
