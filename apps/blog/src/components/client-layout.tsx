"use client";

import { SearchDialog } from "@/components/search/search-dialog";
import { useAppStore } from "@/stores";

export const ClientLayout = () => {
  const { isSearchOpen, setIsSearchOpen } = useAppStore();

  return <SearchDialog open={isSearchOpen} onOpenChange={setIsSearchOpen} />;
};
