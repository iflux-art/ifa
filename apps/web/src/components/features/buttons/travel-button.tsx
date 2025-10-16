"use client";

import { TramFront } from "lucide-react";
import { memo } from "react";
import { ExternalLinkButton } from "@/components/shared/external-link-button";

export const TravelButton = memo(() => {
  return (
    <ExternalLinkButton url="https://www.travellings.cn/go.html" title="开往" icon={TramFront} />
  );
});

TravelButton.displayName = "TravelButton";
