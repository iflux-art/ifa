/**
 * Home 功能模块的内联类型定义
 * 避免外部依赖，保持子应用的独立性
 */

export interface LinksItem {
  id: string;
  title: string;
  url: string;
  description: string;
  icon: string;
  iconType?: "image" | "text";
  category: string;
  tags: string[];
  featured: boolean;
}

export interface Category {
  id: string;
  name: string;
  children?: SubCategory[];
}

export interface SubCategory {
  id: string;
  name: string;
}

export interface HomePageProps {
  initialData?: LinksItem[];
}

export interface LinksContentProps {
  items: LinksItem[];
  selectedCategory: string;
  className?: string;
}

export interface SidebarProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}
