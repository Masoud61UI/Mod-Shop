"use client";

import FeaturedProducts from "./FeaturedProducts";

interface BlogSidebarProps {
  products: any[];
}

export default function BlogSidebar({
  products,
}: BlogSidebarProps) {
  return (
    <div className="lg:col-span-1 space-y-8">
      <FeaturedProducts products={products} />
    </div>
  );
}