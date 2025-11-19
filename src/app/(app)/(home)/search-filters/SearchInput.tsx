"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ListFilterIcon, SearchIcon } from "lucide-react";

import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";

import { useTRPC } from "@/src/trpc/client";
import CategoriesSidebar from "./CategoriesSidebar";

interface Props {
  disabled?: boolean;
}

export default function SearchInput({ disabled }: Props) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const trpc = useTRPC();
  const session = useQuery(trpc.auth.session.queryOptions());

  return (
    <div className="flex items-center gap-2 w-full">
      <CategoriesSidebar open={isSidebarOpen} onOpenChange={setIsSidebarOpen} />
      <div className="relative w-full">
        <SearchIcon className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-300" />
        <Input
          className="py-5 px-8 
            placeholder:text-sm 
            placeholder:text-gray-300
            focus-visible:ring-1 
            focus-visible:ring-purple-200 
            focus-visible:ring-offset-0"
          placeholder="جستجو محصولات..."
          disabled={disabled}
        />
      </div>

      <Button
        variant="outline"
        className="size-[42px] shrink-0 flex lg:hidden"
        onClick={() => setIsSidebarOpen(true)}
      >
        <ListFilterIcon />
      </Button>
    </div>
  );
}
