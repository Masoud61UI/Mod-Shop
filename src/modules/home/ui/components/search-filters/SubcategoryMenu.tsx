import Link from "next/link";

import { Category } from "@/src/payload-types";

import { CategoriesGetManyOutput } from "@/src/modules/categories/types";

interface Props {
  category: CategoriesGetManyOutput[1];
  isOpen: boolean;
  position: { top: number; left: number };
}

export default function SubcategoryMenu({ category, isOpen, position }: Props) {
  if (
    !isOpen ||
    !category.subcategories ||
    category.subcategories.length === 0
  ) {
    return null;
  }

  const backgroundColor = category.color || "#f5f5f5";

  return (
    <div
      className="fixed z-50"
      style={{
        top: position.top,
        left: position.left,
      }}
    >
      <div className="h-3 w-56" />
      <div
        style={{ backgroundColor }}
        className="w-56 text-black rounded-md overflow-hidden border shadow-md"
      >
        <div>
          {category.subcategories?.map((subcategory: Category) => (
            <Link
              key={subcategory.slug}
              href={`/${category.slug}/${subcategory.slug}`}
              className="w-full text-right text-sm text-gray-600 p-4 hover:bg-purple-50 hover:text-purple-500 flex justify-between items-center font-medium"
            >
              {subcategory.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
