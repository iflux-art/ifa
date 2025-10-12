import type { CategoryId, LinksCategory } from "@/components/link-categories";
import type { LinksItem } from "@/components/links/links-types";

// 定义分类结构，基于实际文件夹结构
const categoryStructure = {
  ai: {
    name: "人工智能",
    children: {
      // 修复文件路径，确保它们与实际文件夹结构匹配
      api: {
        name: "API",
        file: () => safeImport(() => import("@/content/ai/api.json")),
      },
      chat: {
        name: "聊天",
        file: () => safeImport(() => import("@/content/ai/chat.json")),
      },
      creative: {
        name: "创意",
        file: () => safeImport(() => import("@/content/ai/creative.json")),
      },
      models: {
        name: "模型",
        file: () => safeImport(() => import("@/content/ai/models.json")),
      },
      platforms: {
        name: "平台",
        file: () => safeImport(() => import("@/content/ai/platforms.json")),
      },
      resources: {
        name: "资源",
        file: () => safeImport(() => import("@/content/ai/resources.json")),
      },
      services: {
        name: "服务",
        file: () => safeImport(() => import("@/content/ai/services.json")),
      },
      tools: {
        name: "工具",
        file: () => safeImport(() => import("@/content/ai/tools.json")),
      },
    },
  },
  audio: {
    name: "音频处理",
    children: {
      daw: {
        name: "数字音频工作站",
        file: () => safeImport(() => import("@/content/audio/daw.json")),
      },
      distribution: {
        name: "音乐发行",
        file: () => safeImport(() => import("@/content/audio/distribution.json")),
      },
      processing: {
        name: "音频处理",
        file: () => safeImport(() => import("@/content/audio/processing.json")),
      },
    },
  },
  design: {
    name: "设计工具",
    children: {
      colors: {
        name: "配色工具",
        file: () => safeImport(() => import("@/content/design/colors.json")),
      },
      fonts: {
        name: "字体资源",
        file: () => safeImport(() => import("@/content/design/fonts.json")),
      },
      "image-processing": {
        name: "图像处理",
        file: () => safeImport(() => import("@/content/design/image-processing.json")),
      },
      tools: {
        name: "设计工具",
        file: () => safeImport(() => import("@/content/design/tools.json")),
      },
    },
  },
  development: {
    name: "开发工具",
    children: {
      apis: {
        name: "API",
        file: () => safeImport(() => import("@/content/development/apis.json")),
      },
      cloud: {
        name: "云服务",
        file: () => safeImport(() => import("@/content/development/cloud.json")),
      },
      containers: {
        name: "容器化",
        file: () => safeImport(() => import("@/content/development/containers.json")),
      },
      databases: {
        name: "数据库",
        file: () => safeImport(() => import("@/content/development/databases.json")),
      },
      frameworks: {
        name: "开发框架",
        file: () => safeImport(() => import("@/content/development/frameworks.json")),
      },
      git: {
        name: "版本控制",
        file: () => safeImport(() => import("@/content/development/git.json")),
      },
      hosting: {
        name: "托管服务",
        file: () => safeImport(() => import("@/content/development/hosting.json")),
      },
      monitoring: {
        name: "监控工具",
        file: () => safeImport(() => import("@/content/development/monitoring.json")),
      },
      security: {
        name: "安全工具",
        file: () => safeImport(() => import("@/content/development/security.json")),
      },
      tools: {
        name: "开发工具",
        file: () => safeImport(() => import("@/content/development/tools.json")),
      },
    },
  },
  office: {
    name: "办公软件",
    children: {
      documents: {
        name: "文档处理",
        file: () => safeImport(() => import("@/content/office/documents.json")),
      },
      pdf: {
        name: "PDF 工具",
        file: () => safeImport(() => import("@/content/office/pdf.json")),
      },
    },
  },
  operation: {
    name: "运营工具",
    children: {
      ecommerce: {
        name: "电商工具",
        file: () => safeImport(() => import("@/content/operation/ecommerce.json")),
      },
      marketing: {
        name: "营销工具",
        file: () => safeImport(() => import("@/content/operation/marketing.json")),
      },
    },
  },
  productivity: {
    name: "效率工具",
    children: {
      browsers: {
        name: "浏览器",
        file: () => safeImport(() => import("@/content/productivity/browsers.json")),
      },
      "cloud-storage": {
        name: "云存储",
        file: () => safeImport(() => import("@/content/productivity/cloud-storage.json")),
      },
      documents: {
        name: "文档处理",
        file: () => safeImport(() => import("@/content/productivity/documents.json")),
      },
      email: {
        name: "邮箱服务",
        file: () => safeImport(() => import("@/content/productivity/email.json")),
      },
      pdf: {
        name: "PDF 工具",
        file: () => safeImport(() => import("@/content/productivity/pdf.json")),
      },
      search: {
        name: "搜索引擎",
        file: () => safeImport(() => import("@/content/productivity/search.json")),
      },
      "system-tools": {
        name: "系统工具",
        file: () => safeImport(() => import("@/content/productivity/system-tools.json")),
      },
    },
  },
  video: {
    name: "视频处理",
    children: {
      editing: {
        name: "视频编辑",
        file: () => safeImport(() => import("@/content/video/editing.json")),
      },
    },
  },
};

/**
 * 安全导入模块的辅助函数，带重试机制
 */
async function safeImport<T>(importFn: () => Promise<T>, retries = 3): Promise<T | null> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const result = await importFn();
      return result;
    } catch (error) {
      const isChunkLoadError =
        error instanceof Error &&
        (error.message.includes("ChunkLoadError") ||
          error.message.includes("Loading chunk") ||
          error.message.includes("Failed to fetch"));

      if (isChunkLoadError && attempt < retries) {
        // 对于chunk加载错误，等待一段时间后重试
        console.warn(`Chunk load failed, retrying (${attempt}/${retries})...`);
        await new Promise((resolve) => setTimeout(resolve, 100 * attempt));
        continue;
      }

      // 在开发环境中，Turbopack HMR可能会导致导入失败
      if (process.env.NODE_ENV === "development") {
        console.warn("Failed to import module, this may be due to Turbopack HMR:", error);
      } else {
        console.error("Failed to import module:", error);
      }
      return null;
    }
  }
  return null;
}

/**
 * 处理根目录分类文件
 */
async function loadRootCategoryItems(
  categoryId: string,
  categoryInfo:
    | { file: () => Promise<{ default: unknown[] } | null> }
    | {
        children: Record<string, { file: () => Promise<{ default: unknown[] } | null> }>;
      }
): Promise<LinksItem[]> {
  // 添加类型检查
  if (!("file" in categoryInfo)) {
    return [];
  }

  try {
    const moduleData = await categoryInfo.file();
    if (!moduleData) {
      return [];
    }

    const items = moduleData.default;

    return items.map((item: unknown) => {
      const typedItem = item as Record<string, unknown>;
      return {
        ...(typedItem as unknown as LinksItem),
        category: categoryId as CategoryId,
        iconType: (typedItem.iconType ?? "image") as "image" | "text",
      };
    });
  } catch (error) {
    console.warn(`Failed to load ${categoryId}:`, error);
    return [];
  }
}

/**
 * 处理子分类文件
 */
async function loadSubCategoryItems(
  categoryId: string,
  subCategoryId: string,
  subCategoryInfo: { file: () => Promise<{ default: unknown[] } | null> }
): Promise<LinksItem[]> {
  try {
    const moduleData = await subCategoryInfo.file();
    if (!moduleData) {
      return [];
    }

    const items = moduleData.default;

    return items.map((item: unknown) => {
      const typedItem = item as Record<string, unknown>;
      return {
        ...(typedItem as unknown as LinksItem),
        category: `${categoryId}/${subCategoryId}` as CategoryId,
        iconType: (typedItem.iconType ?? "image") as "image" | "text",
      };
    });
  } catch (error) {
    console.warn(`Failed to load ${categoryId}/${subCategoryId}:`, error);
    return [];
  }
}

/**
 * 处理有子分类的分类目录
 */
async function loadCategoryWithChildren(
  categoryId: string,
  categoryInfo: {
    children: Record<string, { file: () => Promise<{ default: unknown[] } | null> }>;
  }
): Promise<LinksItem[]> {
  const items: LinksItem[] = [];

  for (const [subCategoryId, subCategoryInfo] of Object.entries(categoryInfo.children)) {
    const subItems = await loadSubCategoryItems(categoryId, subCategoryId, subCategoryInfo);
    items.push(...subItems);
  }

  return items;
}

// 添加缓存变量
let cachedLinksData: LinksItem[] | null = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5分钟缓存

// 为每个分类添加单独的缓存
const categoryCache: Record<string, { data: LinksItem[]; timestamp: number }> = {};

/**
 * 生成缓存键
 */
function generateCacheKey(categoryId?: string): string {
  return categoryId ? `links-category-${categoryId}` : "links-all-data";
}

/**
 * 从localStorage获取缓存数据
 */
function getCachedDataFromStorage(categoryId?: string): LinksItem[] | null {
  try {
    if (typeof window === "undefined") return null; // 服务端不使用localStorage

    const key = generateCacheKey(categoryId);
    const cached = localStorage.getItem(key);
    if (!cached) return null;

    const { data, timestamp } = JSON.parse(cached);
    // 检查缓存是否过期
    if (Date.now() - timestamp > CACHE_DURATION) {
      localStorage.removeItem(key);
      return null;
    }

    return data as LinksItem[];
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("Failed to get cached data from localStorage:", error);
    }
    return null;
  }
}

/**
 * 将数据存储到localStorage
 */
function setCachedDataToStorage(data: LinksItem[], categoryId?: string): void {
  try {
    if (typeof window === "undefined") return; // 服务端不使用localStorage

    const key = generateCacheKey(categoryId);
    const cacheData = {
      data,
      timestamp: Date.now(),
    };

    localStorage.setItem(key, JSON.stringify(cacheData));
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("Failed to set cached data to localStorage:", error);
    }
  }
}

/**
 * 清除特定分类的缓存
 */
function clearCategoryCache(categoryId?: string): void {
  try {
    if (typeof window === "undefined") return;

    const key = generateCacheKey(categoryId);
    localStorage.removeItem(key);

    if (categoryId) {
      delete categoryCache[categoryId];
    } else {
      cachedLinksData = null;
    }
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("Failed to clear cache:", error);
    }
  }
}

/**
 * 预热关键分类的缓存
 */
async function preloadCriticalCategories(): Promise<void> {
  const criticalCategories: (keyof typeof categoryStructure)[] = ["development"];

  for (const categoryId of criticalCategories) {
    try {
      const categoryInfo = categoryStructure[categoryId];
      if (!categoryInfo) continue;

      if ("file" in categoryInfo) {
        // 根目录文件
        const items = await loadRootCategoryItems(categoryId, categoryInfo);
        categoryCache[categoryId] = {
          data: items,
          timestamp: Date.now(),
        };
        setCachedDataToStorage(items, categoryId);
      } else if ("children" in categoryInfo) {
        // 有子分类的目录
        const items = await loadCategoryWithChildren(categoryId, categoryInfo);
        categoryCache[categoryId] = {
          data: items,
          timestamp: Date.now(),
        };
        setCachedDataToStorage(items, categoryId);
      }
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.warn(`Failed to preload category ${categoryId}:`, error);
      }
    }
  }
}

// 动态导入所有分类数据
async function loadAllLinksData(_cacheKey = ""): Promise<LinksItem[]> {
  // 首先尝试从内存缓存获取
  const now = Date.now();
  if (cachedLinksData && now - cacheTimestamp < CACHE_DURATION) {
    // 返回去重的数据
    return Array.from(new Map(cachedLinksData.map((item) => [item.id, item])).values());
  }

  // 尝试从localStorage获取缓存
  const storageCachedData = getCachedDataFromStorage();
  if (storageCachedData && storageCachedData.length > 0) {
    cachedLinksData = storageCachedData;
    cacheTimestamp = now;
    // 返回去重的数据
    return Array.from(new Map(storageCachedData.map((item) => [item.id, item])).values());
  }

  const allItems: LinksItem[] = [];

  try {
    // 创建所有加载任务的数组
    const loadTasks: Promise<LinksItem[]>[] = [];

    // 遍历所有分类，创建并行加载任务
    for (const [categoryId, categoryInfo] of Object.entries(categoryStructure)) {
      // 检查是否有分类级别的缓存
      const categoryCached = categoryCache[categoryId];
      if (categoryCached && now - categoryCached.timestamp < CACHE_DURATION) {
        allItems.push(...categoryCached.data);
        continue;
      }

      // 尝试从localStorage获取分类缓存
      const storageCategoryCached = getCachedDataFromStorage(categoryId);
      if (storageCategoryCached && storageCategoryCached.length > 0) {
        categoryCache[categoryId] = {
          data: storageCategoryCached,
          timestamp: now,
        };
        allItems.push(...storageCategoryCached);
        continue;
      }

      // 创建并行加载任务
      if ("file" in categoryInfo) {
        // 根目录文件
        loadTasks.push(
          loadRootCategoryItems(categoryId, categoryInfo).then((items) => {
            // 缓存分类数据
            categoryCache[categoryId] = {
              data: items,
              timestamp: now,
            };
            setCachedDataToStorage(items, categoryId);
            return items;
          })
        );
      } else if ("children" in categoryInfo) {
        // 有子分类的目录
        loadTasks.push(
          loadCategoryWithChildren(categoryId, categoryInfo).then((items) => {
            // 缓存分类数据
            categoryCache[categoryId] = {
              data: items,
              timestamp: now,
            };
            setCachedDataToStorage(items, categoryId);
            return items;
          })
        );
      }
    }

    // 并行执行所有加载任务
    const results = await Promise.all(loadTasks);

    // 合并所有结果
    for (const items of results) {
      allItems.push(...items);
    }

    // 去重处理
    const uniqueItems = Array.from(new Map(allItems.map((item) => [item.id, item])).values());

    cachedLinksData = uniqueItems;
    cacheTimestamp = now;
    setCachedDataToStorage(uniqueItems);

    return uniqueItems;
  } catch (_error) {
    // 即使有错误也返回去重的缓存数据（如果有的话）
    const uniqueCachedData = cachedLinksData
      ? Array.from(new Map(cachedLinksData.map((item) => [item.id, item])).values())
      : [];
    return uniqueCachedData;
  }
}

// 生成分类结构数据
function generateCategoriesData(): LinksCategory[] {
  const categories: LinksCategory[] = [];

  for (const [categoryId, categoryInfo] of Object.entries(categoryStructure)) {
    if ("file" in categoryInfo) {
      // 根目录文件作为独立分类
      categories.push({
        id: categoryId as CategoryId,
        name: categoryInfo.name,
        order: categories.length,
      });
    } else if ("children" in categoryInfo) {
      // 有子分类的目录
      const children = Object.entries(categoryInfo.children).map(([subId, subInfo], index) => ({
        id: `${categoryId}/${subId}` as CategoryId,
        name: subInfo.name,
        order: index,
      }));

      categories.push({
        id: categoryId as CategoryId,
        name: categoryInfo.name,
        order: categories.length,
        collapsible: true,
        children,
      });
    }
  }

  return categories;
}

// 添加一个函数来清除所有缓存
function clearAllCaches(): void {
  try {
    if (typeof window === "undefined") return;

    // 清除localStorage中的所有缓存
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("links-")) {
        localStorage.removeItem(key);
      }
    });

    // 清除内存缓存
    cachedLinksData = null;
    cacheTimestamp = 0;

    // 清除分类缓存
    Object.keys(categoryCache).forEach((key) => {
      delete categoryCache[key];
    });

    console.log("所有缓存已清除");
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("清除缓存时出错:", error);
    }
  }
}

/**
 * 处理chunk加载错误的恢复函数
 */
function handleChunkLoadError(): void {
  if (typeof window !== "undefined") {
    console.warn("检测到chunk加载错误，正在清除缓存并重新加载页面...");
    clearAllCaches();

    // 在开发环境中，尝试重新加载页面
    if (process.env.NODE_ENV === "development") {
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  }
}

export {
  loadAllLinksData,
  generateCategoriesData,
  categoryStructure,
  clearCategoryCache,
  preloadCriticalCategories,
  clearAllCaches,
  handleChunkLoadError, // 导出chunk错误处理函数
};
