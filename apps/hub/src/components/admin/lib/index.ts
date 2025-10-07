/**
 * Admin 功能相关工具函数
 */

import { loadAllLinksData } from "@/components/links/lib";
import type { LinksItem } from "@/components/links/types";

export const fetchLinksData = async (): Promise<LinksItem[]> =>
  loadAllLinksData();
