// 直接从依赖库导入 cn 函数，避免客户端/服务端环境问题
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ==================== 布局工具函数 ====================
export {
  gridColsMap,
  gridGapMap,
} from "./layout-utils";
