"use client";

import { SearchDialog } from "@/components/search/search-dialog";
import { useAppStore } from "@/stores";

export const ClientLayout = ({ children }: { children: React.ReactNode }) => {
  const { isSearchOpen, setIsSearchOpen } = useAppStore();

  return (
    <>
      {children}
      <SearchDialog open={isSearchOpen} onOpenChange={setIsSearchOpen} />
    </>
  );
};
