import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/src/components/ui/sheet";
import { ScrollArea } from "@/src/components/ui/scroll-area";

import { CustomCategory } from "../types";
import { useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: CustomCategory[];
}

export default function CategoriesSidebar({ open, onOpenChange, data }: Props) {
  const router = useRouter();

  const [parentCategories, setParentCategories] = useState<
    CustomCategory[] | null
  >(null);

  const [selectedCategory, setSelectedCategory] =
    useState<CustomCategory | null>(null);

  const currentCategories = parentCategories ?? data ?? [];

  const handleOpenChange = (open: boolean) => {
    setSelectedCategory(null);
    setParentCategories(null);
    onOpenChange(open);
  };

  const handleCategoryClick = (category: CustomCategory) => {
    if (category.subcategories && category.subcategories.length > 0) {
      setParentCategories(category.subcategories as CustomCategory[]);
      setSelectedCategory(category);
    } else {
      if (parentCategories && selectedCategory) {
        router.push(`/${selectedCategory.slug}/${category.slug}`);
      } else {
        if (category.slug === "all") {
          router.push("/");
        } else {
          router.push(`/${category.slug}`);
        }
      }

      handleOpenChange(false);
    }
  };

  const handleBackClick = () => {
    if (parentCategories) {
      setParentCategories(null);
      setSelectedCategory(null);
    }
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent
        side="right"
        className="p-0 transition-none [&_.absolute]:left-4 [&_.absolute]:right-auto bg-white"
      >
        <SheetHeader className="p-4 border-b text-right bg-white">
          <SheetTitle className="mr-2">
            {selectedCategory ? selectedCategory.name : "دسته‌بندی‌ها"}
          </SheetTitle>
          <SheetDescription className="sr-only">
            {selectedCategory
              ? `زیردسته‌های ${selectedCategory.name}`
              : "لیست دسته‌بندی‌های اصلی"}
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex flex-col overflow-y-auto h-full pb-2 bg-white">
          {parentCategories && (
            <button
              onClick={handleBackClick}
              className="w-full py-3 px-6 hover:bg-gray-50 flex items-center text-base font-medium text-right justify-end rounded-lg transition-colors border-b text-gray-400 cursor-pointer"
            >
              <ChevronRightIcon className="ml-2 size-4 text-gray-400" />
              برگشت
            </button>
          )}

          {currentCategories.map((category) => (
            <button
              key={category.slug}
              onClick={() => handleCategoryClick(category)}
              className="w-full py-4 px-6 hover:bg-gray-50 flex justify-between items-center text-base font-medium text-right rounded-lg transition-colors border-b cursor-pointer"
            >
              <span className="text-gray-600 w-full px-1">{category.name}</span>
              {category.subcategories && category.subcategories.length > 0 && (
                <ChevronLeftIcon className="size-4 text-gray-400" />
              )}
            </button>
          ))}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
