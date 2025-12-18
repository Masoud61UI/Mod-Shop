"use client";

import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import FeaturedProductItem from "./FeaturedProductItem";

interface FeaturedProductsProps {
  products: any[];
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  const featuredProducts = products.slice(0, 3);

  return (
    <div className="bg-gray-100 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-800">محصولات ویژه</h3>
        <Link href="/products">
          <Button
            variant="outline"
            size="sm"
            className="text-xs text-gray-700 hover:text-purple- hover:border-purple-700 py-1.5 px-2 h-auto cursor-pointer"
          >
            همه
          </Button>
        </Link>
      </div>

      <div className="space-y-4 border-t pt-4">
        {featuredProducts.map((product) => (
          <FeaturedProductItem key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
