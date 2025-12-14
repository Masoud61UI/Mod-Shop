"use client";

import Image from "next/image";
import { useState } from "react";
import dynamic from "next/dynamic";
import { useSuspenseQuery } from "@tanstack/react-query";

import { useTRPC } from "@/src/trpc/client";
import { Button } from "@/src/components/ui/button";
import { CheckCheckIcon, Share2Icon } from "lucide-react";
import { formatToman, toPersianNumber } from "@/src/lib/utils";
import ReviewForms from "../components/ReviewForms";
import { toast } from "sonner";
import ReviewsList from "../components/ReviewsList";

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
  reviewRating?: number;
  reviewCount?: number;
  ratingDistribution?: Record<number, number>;
}

export default function ProductView({ slug }: { slug: string }) {
  const trpc = useTRPC();

  const { data } = useSuspenseQuery(
    trpc.products.getOne.queryOptions({ slug })
  ) as { data: Product };

  const [isCopied, setIsCopied] = useState(false);
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
                        {data.reviewRating
                          ? toPersianNumber(data.reviewRating.toFixed(1))
                          : "۰"}
                      </span>
                    </div>
                    <span className="text-sm text-gray-400">
                      ({toPersianNumber(data.reviewCount || 0)} نظر)
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
                        setSelectedSize("");
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
                  availableStock={selectedInventory?.stock}
                  selectedColor={selectedColor}
                  selectedSize={selectedSize}
                />
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-12 w-12 border-gray-200 hover:bg-gray-50 cursor-pointer"
                    onClick={() => {
                      setIsCopied(true);
                      navigator.clipboard.writeText(window.location.href);
                      toast.success("لینک صفحه با موفقیت کپی شد.");

                      setTimeout(() => {
                        setIsCopied(false);
                      }, 1000);
                    }}
                    disabled={isCopied}
                  >
                    {isCopied ? (
                      <CheckCheckIcon className="size-5" />
                    ) : (
                      <Share2Icon className="size-5 text-gray-600" />
                    )}
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
                  {/*<div className="flex justify-between py-2 border-b border-gray-100 text-[15px]">
                    <span className="text-gray-500">سیاست مرجوعی</span>
                    <span className="text-gray-900 font-medium">
                      {data.refundPolicy === "30-day" && "۳۰ روز مهلت مرجوعی"}
                      {data.refundPolicy === "14-day" && "۱۴ روز مهلت مرجوعی"}
                      {data.refundPolicy === "7-day" && "۷ روز مهلت مرجوعی"}
                      {data.refundPolicy === "3-day" && "۳ روز مهلت مرجوعی"}
                      {data.refundPolicy === "1-day" && "۱ روز مهلت مرجوعی"}
                      {data.refundPolicy === "no-refunds" && "غیرقابل مرجوع"}
                    </span>
                  </div>*/}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">
            نظرات کاربران
          </h3>

          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-gray-900">
                    {data.reviewRating
                      ? toPersianNumber(data.reviewRating.toFixed(1))
                      : "۰"}
                  </div>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        className={`w-5 h-5 ${
                          star <= Math.floor(data.reviewRating || 0)
                            ? "text-amber-500 fill-current"
                            : "text-amber-200 fill-amber-200"
                        }`}
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    از {toPersianNumber(data.reviewCount || 0)} نظر
                  </p>
                </div>
                <div className="h-16 w-px bg-gray-200 hidden lg:block"></div>
                <div className="space-y-1">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const percentage = data.ratingDistribution?.[star] || 0;
                    return (
                      <div key={star} className="flex items-center gap-2">
                        <div className="text-sm font-medium text-gray-600">
                          {star} ستاره
                        </div>
                        <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-amber-500 rounded-full"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <div className="text-sm text-gray-500 w-10">
                          {toPersianNumber(
                            Math.round(
                              (percentage * (data.reviewCount || 0)) / 100
                            )
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <button
                onClick={() =>
                  document
                    .getElementById("review-form")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="px-6 py-3 text-[15px] bg-purple-500 hover:bg-purple-600 text-white font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer"
              >
                نوشتن نظر
              </button>
            </div>
          </div>

          <div
            id="review-form"
            className="bg-white border border-gray-200 rounded-xl p-6 mb-11"
          >
            <ReviewForms productId={data.id} />
          </div>

          <div className="space-y-6">
            <div className="flex items-center">
              <h4 className="text-lg font-semibold text-gray-900">
                دیدگاه کاربران
              </h4>
              {(data.reviewCount || 0) > 0 && (
                <span className="mr-2 text-sm text-gray-500">
                  ({toPersianNumber(data.reviewCount || 0)} نظر)
                </span>
              )}
            </div>

            <ReviewsList productId={data.id} />

            {(data.reviewCount || 0) > 5 && (
              <div className="text-center pt-4">
                <Button
                  variant="outline"
                  className="border-purple-600 text-purple-600 hover:bg-purple-50"
                >
                  مشاهده همه نظرات
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
