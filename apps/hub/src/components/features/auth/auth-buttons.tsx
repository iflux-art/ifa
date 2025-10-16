"use client";

import { SignOutButton, useUser } from "@clerk/nextjs";
import { LogOut, User } from "lucide-react";
import Link from "next/link";
import { useState, useMemo } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

/**
 * 统一的认证状态类型
 */
type AuthState = "loading" | "signed-in" | "signed-out";

/**
 * 优化的认证按钮组件
 * 合并了重复的UI逻辑，提供统一的认证状态管理
 */
export function AuthButtons() {
  const { isSignedIn, isLoaded } = useUser();
  const [dialogOpen, setDialogOpen] = useState(false);

  // 计算认证状态，避免重复的条件判断
  const authState: AuthState = useMemo(() => {
    if (!isLoaded) {
      return "loading";
    }
    return isSignedIn ? "signed-in" : "signed-out";
  }, [isLoaded, isSignedIn]);

  // 渲染登录按钮（loading 和 signed-out 状态）
  if (authState === "loading" || authState === "signed-out") {
    return (
      <Link href="/sign-in">
        <Button variant="ghost" size="icon" title="登录">
          <User className="h-5 w-5" />
        </Button>
      </Link>
    );
  }

  // 渲染退出登录按钮（signed-in 状态）
  return (
    <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon" title="退出登录">
          <User className="h-5 w-5" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>确认退出登录</AlertDialogTitle>
          <AlertDialogDescription>
            您确定要退出登录吗？退出后需要重新登录才能访问您的账户。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>取消</AlertDialogCancel>
          <SignOutButton>
            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              <LogOut className="mr-2 h-4 w-4" />
              退出登录
            </AlertDialogAction>
          </SignOutButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
