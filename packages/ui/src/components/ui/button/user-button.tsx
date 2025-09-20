"use client";

import { LogOut, User } from "lucide-react";
import { Button } from "./button";

interface UserButtonProps {
  isSignedIn?: boolean;
  onSignOut?: () => void;
  onSignIn?: () => void;
}

export const UserButton = ({
  isSignedIn = false,
  onSignOut,
  onSignIn,
}: UserButtonProps) => {
  const handleClick = () => {
    if (isSignedIn && onSignOut) {
      onSignOut();
    } else if (!isSignedIn && onSignIn) {
      onSignIn();
    }
  };

  const title = isSignedIn ? "用户账户" : "登录";
  const ariaLabel = isSignedIn ? "用户账户" : "登录";

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-9 w-9"
      title={title}
      onClick={handleClick}
      aria-label={ariaLabel}
    >
      {isSignedIn ? (
        <LogOut className="h-5 w-5" />
      ) : (
        <User className="h-5 w-5" />
      )}
      <span className="sr-only">{ariaLabel}</span>
    </Button>
  );
};
