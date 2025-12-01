"use client";

import Image from "next/image";
import { useState } from "react";
import dynamic from "next/dynamic";
import { useSuspenseQuery } from "@tanstack/react-query";

import { useTRPC } from "@/src/trpc/client";
// import CartButton from "../components/CartButton";
import { Button } from "@/src/components/ui/button";
import { HeartIcon, Share2Icon } from "lucide-react";
import { Progress } from "@/src/components/ui/progress";
import { formatToman, toPersianNumber } from "@/src/lib/utils";

const CartButton = dynamic(() => import("../components/CartButton"), {
  ssr: false,
  loading: () => (
    <Button
      disabled
      className="flex-1 h-12 text-white text-lg font-medium cursor-pointer transition-all bg-purple-600"
    >
      🛒 افزودن به سبد خرید
    </Button>
  ),
});

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
}

export default function ProductView({ slug }: { slug: string }) {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.products.getOne.queryOptions({ slug })
  ) as { data: Product };

  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");

  const hasDiscount = data.discountPrice && data.discountPrice < data.price;

  const getCategoryName = (): string => {
    if (!data.category) return "";
    return typeof data.category === "string"
      ? data.category
      : data.category.name;
  };

  const getSubcategoryName = (): string => {
    if (!data.subcategory) return "";
    return typeof data.subcategory === "string"
      ? data.subcategory
      : data.subcategory.name;
  };

  const uniqueColors = Array.from(
    new Map(
      (data.inventory || []).map((item) => [
        item.colorName,
        {
          name: item.colorName,
          hex: item.colorHex || "#cccccc",
        },
      ])
    ).values()
  );

  const getAvailableSizes = (): string[] => {
    if (!selectedColor) {
      return Array.from(
        new Set(
          (data.inventory || [])
            .filter((item) => item.stock > 0)
            .map((item) => item.size)
        )
      );
    }

    return Array.from(
      new Set(
        (data.inventory || [])
          .filter((item) => item.colorName === selectedColor && item.stock > 0)
          .map((item) => item.size)
      )
    );
  };

  const availableSizes = getAvailableSizes();

  const selectedInventory =
    selectedColor && selectedSize
      ? (data.inventory || []).find(
          (item) =>
            item.colorName === selectedColor && item.size === selectedSize
        )
      : null;

  const isInStock = selectedInventory && selectedInventory.stock > 0;

  return (
    <div className="min-h-screen bg-gray-50/30 py-7">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 p-6 lg:p-13">
            <div className="space-y-4">
              <div className="relative aspect-square rounded-xl bg-gray-50 overflow-hidden">
                <Image
                  src={data.image?.url || "/no-image2.png"}
                  alt={data.name}
                  fill
                  className="object-cover"
                  priority
                />
                {hasDiscount && (
                  <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    ٪{toPersianNumber(data.discountPercent || 0)} تخفیف
                  </div>
                )}
              </div>

              <div className="flex gap-2 overflow-x-auto pb-2">
                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="relative w-20 h-20 rounded-lg bg-gray-100 border-2 border-transparent hover:border-purple-400 cursor-pointer flex-shrink-0"
                  >
                    <Image
                      src={data.image?.url || "/no-image2.png"}
                      alt={`${data.name} - ${item}`}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-5">
              <div className="space-y-4">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
                  {data.name}
                </h1>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-amber-500">
                      <svg className="size-4 fill-current" viewBox="0 0 24 24">
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                      <span className="text-sm font-semibold text-gray-700">
                        ۴.۵
                      </span>
                    </div>
                    <span className="text-sm text-gray-400">
                      (امتیاز ۴ خریدار)
                    </span>
                  </div>
                  <div className="w-px h-6 bg-gray-200"></div>
                  <span
                    className={`text-sm font-medium ${
                      isInStock ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {isInStock
                      ? `✓ موجود در انبار (${toPersianNumber(selectedInventory.stock)} عدد)`
                      : selectedColor && selectedSize
                        ? "✗ ناموجود"
                        : "لطفا رنگ و سایز را انتخاب کنید"}
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-baseline gap-3">
                    <p className="text-[26px] font-bold text-purple-600">
                      {formatToman(
                        hasDiscount ? data.discountPrice! : data.price
                      )}
                      <span className="text-sm font-normal mr-1">تومان</span>
                    </p>
                    {hasDiscount && (
                      <p className="text-lg text-gray-400 line-through">
                        {formatToman(data.price)}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4">
                <h3 className="text-[17px] font-semibold text-gray-900 mb-3">
                  انتخاب رنگ
                </h3>
                <div className="flex flex-wrap gap-3">
                  {uniqueColors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => {
                        setSelectedColor(color.name);
                        setSelectedSize(""); // Reset size when color changes
                      }}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all cursor-pointer ${
                        selectedColor === color.name
                          ? "border-purple-600 bg-purple-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div
                        className="w-4 h-4 rounded-full border border-gray-300"
                        style={{ backgroundColor: color.hex }}
                      />
                      <span className="text-sm font-medium">{color.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4">
                <h3 className="text-[17px] font-semibold text-gray-900 mb-3">
                  انتخاب سایز
                </h3>
                <div className="flex flex-wrap gap-3">
                  {availableSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded-lg border-2 transition-all cursor-pointer ${
                        selectedSize === size
                          ? "border-purple-600 bg-purple-50 text-purple-600 font-semibold"
                          : "border-gray-200 hover:border-gray-300 text-gray-700"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <CartButton
                  productId={data.id}
                  price={hasDiscount ? data.discountPrice! : data.price}
                  isInStock={!!isInStock}
                  selectedColor={selectedColor}
                  selectedSize={selectedSize}
                />
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-12 w-12 border-gray-200 hover:bg-gray-50 cursor-pointer"
                  >
                    <HeartIcon className="size-5 text-gray-600" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-12 w-12 border-gray-200 hover:bg-gray-50 cursor-pointer"
                  >
                    <Share2Icon className="size-5 text-gray-600" />
                  </Button>
                </div>
              </div>

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

              <div className="border-t border-gray-100 pt-4">
                <h3 className="text-[17px] font-semibold text-gray-900 mb-4">
                  مشخصات فنی
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex justify-between py-2 border-b border-gray-100 text-[15px]">
                    <span className="text-gray-500">کد محصول</span>
                    <span className="text-gray-900 font-medium">
                      {data.sku}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100 text-[15px]">
                    <span className="text-gray-500">دسته‌بندی</span>
                    <span className="text-gray-900 font-medium">
                      {getCategoryName()}
                    </span>
                  </div>
                  {data.subcategory && (
                    <div className="flex justify-between py-2 border-b border-gray-100 text-[15px]">
                      <span className="text-gray-500">زیردسته‌بندی</span>
                      <span className="text-gray-900 font-medium">
                        {getSubcategoryName()}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between py-2 border-b border-gray-100 text-[15px]">
                    <span className="text-gray-500">سیاست مرجوعی</span>
                    <span className="text-gray-900 font-medium">
                      {data.refundPolicy === "30-day" && "۳۰ روز مهلت مرجوعی"}
                      {data.refundPolicy === "14-day" && "۱۴ روز مهلت مرجوعی"}
                      {data.refundPolicy === "7-day" && "۷ روز مهلت مرجوعی"}
                      {data.refundPolicy === "3-day" && "۳ روز مهلت مرجوعی"}
                      {data.refundPolicy === "1-day" && "۱ روز مهلت مرجوعی"}
                      {data.refundPolicy === "no-refunds" && "غیرقابل مرجوع"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="text-center lg:text-right">
              <div className="inline-flex flex-col items-center lg:items-end">
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-bold text-gray-900">۴.۲</span>
                  <span className="text-gray-400">/۵</span>
                </div>
                <div className="flex items-center gap-1 text-amber-500">
                  <span className="text-lg font-semibold">۴.۲</span>
                  <svg className="size-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                </div>
                <p className="text-gray-500 text-sm mt-2">
                  (امتیاز ۱۴۱ خریدار)
                </p>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="space-y-3">
                {[5, 4, 3, 2, 1].map((stars) => (
                  <div key={stars} className="flex items-center gap-4">
                    <div className="flex items-center gap-2 w-20">
                      <span className="text-sm text-gray-600">{stars}</span>
                      <div className="flex items-center gap-1 text-amber-500">
                        <svg
                          className="size-4 fill-current"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      </div>
                    </div>
                    <Progress
                      value={
                        stars === 5
                          ? 75
                          : stars === 4
                            ? 15
                            : stars === 3
                              ? 7
                              : stars === 2
                                ? 2
                                : 1
                      }
                      className="h-2 flex-1 bg-gray-100 -ml-4"
                    />
                    <span className="text-sm text-gray-500 w-12 text-left">
                      {stars === 5
                        ? "۷۵٪"
                        : stars === 4
                          ? "۱۵٪"
                          : stars === 3
                            ? "۷٪"
                            : stars === 2
                              ? "۲٪"
                              : "۱٪"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
