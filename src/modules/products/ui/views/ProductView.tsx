"use client";

import { useState, useEffect } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";

import { useTRPC } from "@/src/trpc/client";
import ProductImages from "../components/ProductImages";
import ProductInfo from "../components/ProductInfo";
import ColorSizeSelector from "../components/ColorSizeSelector";
import PriceStockInfo from "../components/PriceStockInfo";
import ProductSpecs from "../components/ProductSpecs";
import DynamicText from "../components/DynamicText";
import ReviewSection from "../components/ReviewSection";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface InventoryItem {
  colorName: string;
  colorHex?: string;
  size: string;
  stock: number;
  sku: string;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  discountPrice?: number;
  discountPercent?: number;
  images: any[];
  inventory?: InventoryItem[];
  sku: string;
  refundPolicy: string;
  category: string | Category;
  subcategory?: string | Category;
  image?: any;
  reviewRating?: number;
  reviewCount?: number;
  ratingDistribution?: Record<number, number>;
  featured?: boolean;
}

export default function ProductView({ slug }: { slug: string }) {
  const trpc = useTRPC();

  const { data } = useSuspenseQuery(
    trpc.products.getOne.queryOptions({ slug })
  ) as { data: Product };

  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [displayStock, setDisplayStock] = useState<number>(0);

  const hasDiscount = !!(data.discountPrice && data.discountPrice < data.price);

  useEffect(() => {
    const calculateDisplayStock = () => {
      if (!data.inventory) return 0;

      const totalRealStock = data.inventory.reduce(
        (sum, item) => sum + (item.stock || 0),
        0
      );

      if (totalRealStock > 2) {
        return 2;
      }

      return totalRealStock;
    };

    setDisplayStock(calculateDisplayStock());
  }, [data.inventory]);

  const selectedInventory =
    selectedColor && selectedSize
      ? (data.inventory || []).find(
          (item) =>
            item.colorName === selectedColor && item.size === selectedSize
        )
      : null;

  const isInStock = !!(selectedInventory && selectedInventory.stock > 0);

  const getSelectedDisplayStock = () => {
    if (!selectedInventory) return displayStock;

    const realStock = selectedInventory.stock;

    if (realStock > 2) {
      return 2;
    }

    return realStock;
  };

  const selectedDisplayStock = getSelectedDisplayStock();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-7">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 p-6 lg:p-13">
            <div className="space-y-4">
              <ProductImages
                image={data.image}
                name={data.name}
                hasDiscount={hasDiscount}
                discountPercent={data.discountPercent}
              />
            </div>

            <div className="space-y-5">
              <ProductInfo
                name={data.name}
                reviewRating={data.reviewRating}
                reviewCount={data.reviewCount}
                isInStock={isInStock}
                selectedColor={selectedColor}
                selectedSize={selectedSize}
                selectedDisplayStock={selectedDisplayStock}
                hasDiscount={hasDiscount}
                discountPrice={data.discountPrice}
                price={data.price}
              />

              <ColorSizeSelector
                inventory={data.inventory || []}
                selectedColor={selectedColor}
                selectedSize={selectedSize}
                setSelectedColor={setSelectedColor}
                setSelectedSize={setSelectedSize}
              />

              <PriceStockInfo
                productId={data.id}
                price={hasDiscount ? data.discountPrice! : data.price}
                isInStock={isInStock}
                availableStock={selectedInventory?.stock}
                selectedColor={selectedColor}
                selectedSize={selectedSize}
              />

              <DynamicText />

              <div className="border-t border-gray-100 pt-4">
                <h3 className="text-[17px] font-semibold text-gray-900 mb-3">
                  توضیحات محصول
                </h3>
                <div className="prose prose-gray max-w-none text-[15px]">
                  {data.description ? (
                    <p className="text-gray-600 leading-relaxed">
                      {data.description}
                    </p>
                  ) : (
                    <p className="text-gray-400 italic">
                      توضیحاتی برای این محصول ثبت نشده است.
                    </p>
                  )}
                </div>
              </div>

              <ProductSpecs
                sku={data.sku}
                category={data.category}
                subcategory={data.subcategory}
              />
            </div>
          </div>
        </div>

        <ReviewSection
          productId={data.id}
          reviewRating={data.reviewRating}
          reviewCount={data.reviewCount}
          ratingDistribution={data.ratingDistribution}
        />
      </div>
    </div>
  );
}
