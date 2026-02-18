import Image from "next/image";
import type { ComponentPropsWithoutRef, ReactElement } from "react";

type MDXImgProps = {
	src: string;
	alt: string;
	width?: number;
	height?: number;
	className?: string;
	priority?: boolean;
} & ComponentPropsWithoutRef<typeof Image>;

/**
 * Custom MDX Image component
 * Follows Next.js best practices for image optimization:
 * - Lazy loading by default (loading="lazy")
 * - Use priority prop for above-the-fold images
 * - Proper sizes attribute for responsive loading
 *
 * @see https://nextjs.org/docs/app/building-your-application/optimizing/images
 */
export function MDXImg({
	src,
	alt,
	width = 800,
	height = 450,
	className = "",
	priority = false,
	...props
}: MDXImgProps): ReactElement {
	return (
		<Image
			src={src}
			alt={alt}
			width={width}
			height={height}
			className={`w-full max-w-full rounded-sm border border-border object-cover shadow-md transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 ${className}`}
			sizes="(max-width: 768px) 100vw, (max-width: 1200px) 640px, 800px"
			priority={priority}
			placeholder="empty"
			{...props}
		/>
	);
}
