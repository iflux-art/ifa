/**
 * 搜索和过滤组件
 * 优化的搜索过滤功能，提升用户体验
 */

"use client";

import { Search } from "lucide-react";
import { memo } from "react";
import type { LinksCategory, LinksSubCategory } from "@/components/link-categories";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { SearchFilterProps } from "./types";

export const SearchFilter = memo(
  ({
    searchTerm,
    onSearchChange,
    selectedCategory,
    onCategoryChange,
    categories,
  }: SearchFilterProps) => (
    <Card className="mb-6">
      <CardContent className="py-6">
        <div className="flex gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 transform text-muted-foreground" />
              <Input
                placeholder="搜索网址、标题、描述或标签..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="w-48">
            <Select
              value={selectedCategory || "all"}
              onValueChange={(value) => onCategoryChange(value === "all" ? "" : value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="所有分类" />
              </SelectTrigger>
              <SelectContent className="z-50 max-h-[300px] bg-popover/100">
                <SelectItem value="all">所有分类</SelectItem>
                {categories.map((category: LinksCategory) => (
                  <div key={category.id}>
                    {/* 主分类 */}
                    <SelectItem value={category.id} className="font-medium">
                      {category.name}
                    </SelectItem>
                    {/* 子分类 */}
                    {category?.children &&
                      Array.isArray(category.children) &&
                      category.children.map((subCategory: LinksSubCategory) => (
                        <SelectItem
                          key={subCategory.id}
                          value={subCategory.id}
                          className="pl-6 text-muted-foreground text-sm"
                        >
                          └ {subCategory.name}
                        </SelectItem>
                      ))}
                  </div>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  )
);

SearchFilter.displayName = "SearchFilter";
