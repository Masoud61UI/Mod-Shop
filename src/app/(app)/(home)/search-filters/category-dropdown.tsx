"use client";

import { useRef, useState } from "react";

import { Button } from "@/src/components/ui/button";
import { cn } from "@/src/lib/utils";

import SubcategoryMenu from "./SubcategoryMenu";
import { useDropdownPosition } from "./use-dropdown-position";
import { CustomCategory } from "../types";
import Link from "next/link";

interface Props {
  category: CustomCategory;
  isActive?: boolean;
  isNavigationHovered?: boolean;
}

export default function CategoryDropdown({
  category,
  isActive,
  isNavigationHovered,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { getDropdownPosition } = useDropdownPosition(dropdownRef);

  const onMouseEnter = () => {
    if (category.subcategories) {
      setIsOpen(true);
    }
  };

  const onMouseLeave = () => setIsOpen(false);

  const dropdownPosition = getDropdownPosition();

  const toggleDropdown = () => {
    if (category.subcategories?.docs?.length) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div
      className="relative"
      ref={dropdownRef}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={toggleDropdown}
    >
      <div className="relative">
        <Button
          variant="outline"
          className={cn(
            "h-[34px] px-3 text-[13px] text-gray-500 hover:text-purple-500 hover:border-purple-500 hover:bg-transparent cursor-pointer",
            isActive &&
              !isNavigationHovered &&
              "bg-purple-50 text-purple-500 border-purple-500",
            isOpen && "text-purple-500 border-purple-500"
          )}
        >
          <Link
            href={`/${category.slug === "all" ? "" : category.slug}`}
          >
            {category.name}
          </Link>
        </Button>
        {category.subcategories && category.subcategories.length > 0 && (
          <div
            className={cn(
              "opacity-0 absolute -bottom-3 w-0 h-0 border-r-[6px] border-l-[6px] border-b-[6px] border-l-transparent border-r-transparent border-b-gray-300 left-1/2 -translate-x-1/2",
              isOpen && "opacity-100"
            )}
          />
        )}
      </div>

      <SubcategoryMenu
        category={category}
        isOpen={isOpen}
        position={dropdownPosition}
      />
    </div>
  );
}
