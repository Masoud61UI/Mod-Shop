"use client";

import { ListFilterIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/src/lib/utils";
import { Button } from "@/src/components/ui/button";

import { CategoriesGetManyOutput } from "@/src/modules/categories/types";

import CategoryDropdown from "./category-dropdown";
import CategoriesSidebar from "./CategoriesSidebar";

interface Props {
  data: CategoriesGetManyOutput;
}

export default function Categories({ data }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const viewAllRef = useRef<HTMLDivElement>(null);

  const [visibleCount, setVisibleCount] = useState(data.length);
  const [isAnyHovered, setIsAnyHovered] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const activeCategory = "همه";

  const activeCategoryIndex = data.findIndex(
    (cat) => cat.slug === activeCategory
  );

  const isActiveCategoryHidden =
    activeCategoryIndex >= visibleCount && activeCategoryIndex !== -1;

  useEffect(() => {
    const calculateVisible = () => {
      if (!containerRef.current || !measureRef.current || !viewAllRef.current)
        return;

      const containerWidth = containerRef.current.offsetWidth;
      const viewAllWidth = viewAllRef.current.offsetWidth;
      const availableWidth = containerWidth - viewAllWidth;

      const items = Array.from(measureRef.current.children);
      let totalWidth = 0;
      let visible = 0;

      for (const item of items) {
        const width = item.getBoundingClientRect().width;

        if (totalWidth + width > availableWidth) break;
        totalWidth += width;
        visible++;
      }

      setVisibleCount(visible);
    };

    const resizeObserver = new ResizeObserver(calculateVisible);
    resizeObserver.observe(containerRef.current!);

    return () => resizeObserver.disconnect();
  }, [data.length]);

  return (
    <div className="relative w-full">
      <CategoriesSidebar open={isSidebarOpen} onOpenChange={setIsSidebarOpen} />

      <div
        ref={measureRef}
        className="absolute opacity-0 pointer-events-none flex"
        style={{ position: "fixed", top: "-9999", right: "-9999" }}
      >
        {data.map((category) => (
          <div key={category.id}>
            <CategoryDropdown
              category={category}
              isActive={activeCategory === category.slug}
              isNavigationHovered={false}
            />
          </div>
        ))}
      </div>

      <div
        ref={containerRef}
        className="flex flex-wrap items-center gap-3.5"
        onMouseEnter={() => setIsAnyHovered(true)}
        onMouseLeave={() => setIsAnyHovered(false)}
      >
        {data.slice(0, visibleCount).map((category) => (
          <div key={category.id}>
            <CategoryDropdown
              category={category}
              isActive={activeCategory === category.slug}
              isNavigationHovered={isAnyHovered}
            />
          </div>
        ))}

        <div ref={viewAllRef} className="shrink-0">
          <Button
            className={cn(
              "h-[34px] px-3 text-[13px] bg-transparent border border-gray-300 text-gray-500 hover:text-purple-500 hover:border-purple-500 hover:bg-transparent cursor-pointer",
              isActiveCategoryHidden &&
                !isAnyHovered &&
                "bg-purple-50 text-purple-500 border-purple-500"
            )}
            onClick={() => setIsSidebarOpen(true)}
          >
            <ListFilterIcon className="ml-1" />
            مشاهده همه
          </Button>
        </div>
      </div>
    </div>
  );
}
