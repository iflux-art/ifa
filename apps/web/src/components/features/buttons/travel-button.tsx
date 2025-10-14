"use client";

import { TramFront } from "lucide-react";
import { memo } from "react";
import { Button } from "@/components/ui/button";
import { useSafeExternalLink } from "@/hooks";

const TRAVEL_URL = "https://www.travellings.cn/go.html";

export const TravelButton = memo(() => {
  // 使用自定义 Hook 优化外部链接处理
  const handleClick = useSafeExternalLink(TRAVEL_URL);

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-9 w-9"
      title="开往"
      onClick={handleClick}
      aria-label="开往"
    >
      <TramFront className="h-4 w-4" />
      <span className="sr-only">开往</span>
    </Button>
  );
});

TravelButton.displayName = "TravelButton";
