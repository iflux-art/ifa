/**
 * MDX Components - Next.js Convention
 * This file is automatically used by @next/mdx for server-side compilation
 * @see https://nextjs.org/docs/app/building-your-application/configuring/mdx
 */
import type { MDXComponents } from "mdx/types";
import { useMDXComponents as useBaseMDXComponents } from "./src/components/mdx/mdx-components";

/**
 * MDX Components mapping
 * These components are used when rendering MDX content
 */
export function useMDXComponents(components: MDXComponents): MDXComponents {
	const baseComponents = useBaseMDXComponents();
	return {
		...baseComponents,
		...components,
	};
}
