"use client";

import { Button } from "@iflux-art/ui";
import { Github } from "lucide-react";

interface GitHubButtonProps {
  url?: string;
}

const DEFAULT_GITHUB_URL = "https://github.com/iflux-art";

export const GitHubButton = ({
  url = DEFAULT_GITHUB_URL,
}: GitHubButtonProps) => {
  const handleClick = () => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

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
};
