"use client";

import { SignOutButton, useUser } from "@clerk/nextjs";
import { LogOut, Settings } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface UserDropdownMenuProps {
  trigger: React.ReactNode;
}

export function UserDropdownMenu({ trigger }: UserDropdownMenuProps) {
  const { user } = useUser();
  const [open, setOpen] = useState(false);

  if (!user) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56 bg-popover border border-border shadow-lg"
        align="end"
        forceMount
      >
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            {user.fullName && <p className="font-medium">{user.fullName}</p>}
            {user.emailAddresses && user.emailAddresses.length > 0 && (
              <p className="w-[200px] truncate text-sm text-muted-foreground">
                {user.emailAddresses[0].emailAddress}
              </p>
            )}
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/admin" className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            <span>后台管理</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>退出登录</span>
            </DropdownMenuItem>
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
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
