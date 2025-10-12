import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * 用于合并类名并解决Tailwind CSS冲突的工具函数
 * @param inputs - 要合并的类值
 * @returns 合并后的类字符串
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
