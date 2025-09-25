"use client";

import { ArrowLeft } from "lucide-react";
import { Button } from "./button/button";
import type React from "react";

/**
 * 客户端返回上页按钮组件
 * 包含交互逻辑，需要在客户端渲染
 */
export const BackButton: React.FC = () => (
  <Button variant="outline" size="lg" onClick={() => window.history.back()}>
    <ArrowLeft className="h-4 w-4" aria-hidden="true" />
    返回上页
  </Button>
);
