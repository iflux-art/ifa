import { type ClassValue, clsx } from "clsx";

/**
 * Utility function to merge class names with clsx
 * Combines multiple class values and removes duplicates
 *
 * @param inputs - Class values to merge
 * @returns Merged class string
 *
 * @example
 * ```ts
 * cn('px-4 py-2', 'bg-blue-500', { 'text-white': true })
 * // Returns: 'px-4 py-2 bg-blue-500 text-white'
 * ```
 */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}
