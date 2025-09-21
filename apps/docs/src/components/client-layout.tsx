"use client";

import { SearchDialog } from "@/features/search/components/search-dialog";
import { useAppStore } from "@/stores";

export const ClientLayout = () => {
  const { isSearchOpen, setIsSearchOpen } = useAppStore();

  return <SearchDialog open={isSearchOpen} onOpenChange={setIsSearchOpen} />;
};
