"use client";

import { useState } from "react";
import { ListFilterIcon, SearchIcon } from "lucide-react";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import CategoriesSidebar from "./CategoriesSidebar";

interface Props {
  disabled?: boolean;
  defaultValue?: string | undefined;
  onChange?: (value: string) => void;
}

export default function SearchInput({
  disabled,
  defaultValue = "",
  onChange,
}: Props) {
  const [searchValue, setSearchValue] = useState(defaultValue);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    onChange?.(value);
  };

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
          value={searchValue}
          onChange={handleChange}
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
