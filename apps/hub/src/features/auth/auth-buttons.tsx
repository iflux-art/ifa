"use client";

import { useUser } from "@clerk/nextjs";
import { User } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserDropdownMenu } from "./user-dropdown-menu";

export function AuthButtons() {
  const { isSignedIn, isLoaded, user } = useUser();

  // 如果 Clerk 还在加载中，显示登录图标
  if (!isLoaded) {
    return (
      <Link href="/sign-in">
        <Button variant="ghost" size="icon" title="登录">
          <User className="h-5 w-5" />
        </Button>
      </Link>
    );
  }

  // 如果用户已登录，显示用户头像和下拉菜单
  if (isSignedIn && user) {
    return (
      <UserDropdownMenu
        trigger={
          <Button variant="ghost" size="icon">
            <Avatar className="h-5 w-5">
              <AvatarImage
                src={user.imageUrl}
                alt={user.fullName || user.username || "用户头像"}
              />
              <AvatarFallback>
                {user.firstName?.charAt(0)}
                {user.lastName?.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </Button>
        }
      />
    );
  }

  // 如果用户未登录，显示登录图标
  return (
    <Link href="/sign-in">
      <Button variant="ghost" size="icon" title="登录">
        <User className="h-5 w-5" />
      </Button>
    </Link>
  );
}
