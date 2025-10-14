"use client";

import { Github } from "lucide-react";
import { memo } from "react";
import { Button } from "@/components/ui/button";
import { useSafeExternalLink } from "@/hooks";

const GITHUB_URL = "https://github.com/iflux-art";

export const GitHubButton = memo(() => {
  // 使用自定义 Hook 优化外部链接处理
  const handleClick = useSafeExternalLink(GITHUB_URL);

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-9 w-9"
      title="GitHub"
      onClick={handleClick}
      aria-label="GitHub"
    >
      <Github className="h-4 w-4" />
      <span className="sr-only">GitHub</span>
    </Button>
  );
});

GitHubButton.displayName = "GitHubButton";
