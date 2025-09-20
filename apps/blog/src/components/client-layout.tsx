"use client";

import { useAppStore } from "@/stores";
import { SearchDialog } from "@/features/search/components/search-dialog";

export const ClientLayout = () => {
  const { isSearchOpen, setIsSearchOpen } = useAppStore();

  return <SearchDialog open={isSearchOpen} onOpenChange={setIsSearchOpen} />;
};
