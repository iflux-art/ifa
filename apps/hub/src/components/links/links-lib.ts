import type { CategoryId, LinksCategory } from "@/components/link-categories";
import type { LinksItem } from "@/components/links/links-types";

// 定义分类结构，基于 links-data.json 中的数据
const categoryStructure = {
  ai: {
    name: "人工智能",
    children: {
      api: { name: "API" },
      chat: { name: "聊天" },
      creative: { name: "创意" },
      models: { name: "模型" },
      platforms: { name: "平台" },
      resources: { name: "资源" },
      services: { name: "服务" },
      tools: { name: "工具" },
    },
  },
  audio: {
    name: "音频处理",
    children: {
      daw: { name: "数字音频工作站" },
      distribution: { name: "音乐发行" },
      processing: { name: "音频处理" },
    },
  },
  design: {
    name: "设计工具",
    children: {
      colors: { name: "配色工具" },
      fonts: { name: "字体资源" },
      "image-processing": { name: "图像处理" },
      tools: { name: "设计工具" },
    },
  },
  development: {
    name: "开发工具",
    children: {
      apis: { name: "API" },
      cloud: { name: "云服务" },
      containers: { name: "容器化" },
      databases: { name: "数据库" },
      frameworks: { name: "开发框架" },
      git: { name: "版本控制" },
      hosting: { name: "托管服务" },
      monitoring: { name: "监控工具" },
      security: { name: "安全工具" },
      tools: { name: "开发工具" },
    },
  },
  office: {
    name: "办公软件",
    children: {
      documents: { name: "文档处理" },
      pdf: { name: "PDF 工具" },
    },
  },
  operation: {
    name: "运营工具",
    children: {
      ecommerce: { name: "电商工具" },
      marketing: { name: "营销工具" },
    },
  },
  productivity: {
    name: "效率工具",
    children: {
      browsers: { name: "浏览器" },
      "cloud-storage": { name: "云存储" },
      documents: { name: "文档处理" },
      email: { name: "邮箱服务" },
      pdf: { name: "PDF 工具" },
      search: { name: "搜索引擎" },
      "system-tools": { name: "系统工具" },
    },
  },
  video: {
    name: "视频处理",
    children: {
      editing: { name: "视频编辑" },
    },
  },
};

// 从 links-data.json 加载所有链接数据
async function loadAllLinksData(): Promise<LinksItem[]> {
  try {
    // 直接从 links-data.json 导入数据
    const data = await import("@/components/links/links-data.json");

    // 转换数据类型以匹配 LinksItem 接口
    const items: LinksItem[] = data.default.map((item) => ({
      ...item,
      iconType: item.iconType as "image" | "text" | undefined,
    }));

    return items;
  } catch (error) {
    console.error("加载链接数据失败:", error);
    return [];
  }
}

// 生成分类结构数据
function generateCategoriesData(): LinksCategory[] {
  const categories: LinksCategory[] = [];

  for (const [categoryId, categoryInfo] of Object.entries(categoryStructure)) {
    if (categoryInfo.children) {
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
    } else {
      // 根目录文件作为独立分类
      categories.push({
        id: categoryId as CategoryId,
        name: categoryInfo.name,
        order: categories.length,
      });
    }
  }

  return categories;
}

// 添加一个函数来清除所有缓存
function clearAllCaches(): void {
  try {
    if (typeof window === "undefined") {
      return;
    }

    // 清除localStorage中的所有缓存
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("links-")) {
        localStorage.removeItem(key);
      }
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
  clearAllCaches,
  handleChunkLoadError, // 导出chunk错误处理函数
};
