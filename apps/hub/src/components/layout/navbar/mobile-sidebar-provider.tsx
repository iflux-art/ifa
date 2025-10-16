"use client";

import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { useCategories } from "@/components/features/link-categories";
import { Sidebar } from "@/components/features/home/sidebar";
import type { Category } from "@/components/features/home/types";

interface MobileSidebarContextType {
  sidebarContent: React.ReactNode;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const MobileSidebarContext = createContext<MobileSidebarContextType | null>(null);

interface MobileSidebarProviderProps {
  children: React.ReactNode;
  selectedCategory?: string;
  onCategoryChange?: (category: string) => void;
}

export const MobileSidebarProvider = ({
  children,
  selectedCategory = "",
  onCategoryChange = (_category: string) => {
    // Default empty function
  },
}: MobileSidebarProviderProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const { getFilteredCategories } = useCategories();

  // 获取分类数据
  useEffect(() => {
    const filteredCategories = getFilteredCategories();
    const formattedCategories: Category[] = filteredCategories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      children: cat.children?.map((child) => ({
        id: child.id,
        name: child.name,
      })),
    }));
    setCategories(formattedCategories);
  }, [getFilteredCategories]);

  // 创建侧边栏内容，接收关闭菜单的回调
  const createSidebarContent = (onLinkClick: () => void) => {
    const handleCategoryChange = (category: string) => {
      onCategoryChange(category);
      onLinkClick(); // 选择分类后关闭菜单
    };

    return (
      <Sidebar
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
      />
    );
  };

  const contextValue: MobileSidebarContextType = {
    sidebarContent: createSidebarContent(() => {
      // Default empty callback
    }),
    selectedCategory,
    onCategoryChange,
  };

  return (
    <MobileSidebarContext.Provider value={contextValue}>{children}</MobileSidebarContext.Provider>
  );
};

export const useMobileSidebar = () => {
  const context = useContext(MobileSidebarContext);
  if (!context) {
    throw new Error("useMobileSidebar must be used within a MobileSidebarProvider");
  }
  return context;
};

// Hook to get sidebar content with callback
export const useMobileSidebarWithCallback = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const { getFilteredCategories } = useCategories();

  // 获取分类数据
  useEffect(() => {
    const filteredCategories = getFilteredCategories();
    const formattedCategories: Category[] = filteredCategories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      children: cat.children?.map((child) => ({
        id: child.id,
        name: child.name,
      })),
    }));
    setCategories(formattedCategories);
  }, [getFilteredCategories]);

  // 返回一个函数，该函数接收关闭菜单的回调并返回侧边栏内容
  const getSidebarContentWithCallback = (
    onLinkClick: () => void,
    selectedCategory = "",
    onCategoryChange = (_category: string) => {
      // Default empty function
    }
  ) => {
    const handleCategoryChange = (category: string) => {
      onCategoryChange(category);
      onLinkClick(); // 选择分类后关闭菜单
    };

    return (
      <Sidebar
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
      />
    );
  };

  return { getSidebarContentWithCallback };
};
