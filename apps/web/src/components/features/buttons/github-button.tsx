"use client";

import { Github } from "lucide-react";
import { memo } from "react";
import { ExternalLinkButton } from "@/components/shared/external-link-button";

export const GitHubButton = memo(() => {
  return <ExternalLinkButton url="https://github.com/iflux-art" title="GitHub" icon={Github} />;
});

GitHubButton.displayName = "GitHubButton";
