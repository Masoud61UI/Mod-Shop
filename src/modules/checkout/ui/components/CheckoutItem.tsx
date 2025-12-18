"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { Trash2Icon, MinusIcon, PlusIcon } from "lucide-react";
import { formatToman, toPersianNumber } from "@/src/lib/utils";

interface CheckoutItemProps {
  id: string;
  isLast: boolean;
  imageUrl?: string;
  name: string;
  productUrl: string;
  price: number;
  discountPrice?: number;
  quantity: number;
  availableStock: number;
  color?: string;
  size?: string;
  onRemove: () => void;
  onIncrease: () => void;
  onDecrease: () => void;
}

export default function CheckoutItem({
  id,
  isLast,
  imageUrl,
  name,
  productUrl,
  price,
  discountPrice,
  quantity,
  availableStock,
  color,
  size,
  onRemove,
  onIncrease,
  onDecrease,
}: CheckoutItemProps) {
  const hasDiscount = discountPrice && discountPrice < price;
  const finalPrice = hasDiscount ? discountPrice : price;
  const isMaxReached = quantity >= availableStock;
  const isLowStock = availableStock <= 5;

  return (
    <div
      className={`flex flex-col sm:flex-row items-start gap-4 p-4 ${!isLast ? "border-b" : ""}`}
    >
      <div className="relative w-full sm:w-20 h-40 sm:h-20 rounded-lg bg-gray-100 overflow-hidden">
        <Link href={productUrl} className="block w-full h-full">
          <Image
            src={imageUrl || "/no-image2.png"}
            alt={name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 80px"
          />
        </Link>
      </div>

      <div className="flex-1 w-full">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div className="flex-1">
            <Link href={productUrl} className="hover:text-purple-600">
              <h3 className="font-semibold text-gray-900 text-sm sm:text-base line-clamp-2">
                {name}
              </h3>
            </Link>

            {(color || size) && (
              <div className="mt-1.5 flex flex-wrap gap-2 text-xs sm:text-sm text-gray-500">
                {color && (
                  <span className="inline-flex items-center gap-1">
                    <div
                      className="size-3 rounded-full border border-gray-300"
                      style={{
                        backgroundColor: color.includes("#") ? color : "#ccc",
                      }}
                    />
                    {color}
                  </span>
                )}
                {size && <span>سایز: {size}</span>}
              </div>
            )}

            <div className="mt-2">
              <span
                className={`text-xs ${isMaxReached ? "text-red-500 font-semibold" : isLowStock ? "text-amber-500" : "text-green-600"}`}
              >
                {isMaxReached
                  ? `📦 حداکثر موجودی (${toPersianNumber(availableStock)})`
                  : availableStock <= 5
                    ? `📦 موجودی محدود: ${toPersianNumber(availableStock)} عدد`
                    : `📦 موجودی: ${toPersianNumber(availableStock)} عدد`}
              </span>
            </div>

            <div className="mt-2 sm:hidden">
              {hasDiscount && (
                <span className="text-sm text-gray-400 line-through mr-2">
                  {formatToman(price)}
                </span>
              )}
              <span className="font-semibold text-gray-900">
                {formatToman(finalPrice)} تومان
              </span>
            </div>
          </div>

          <div className="hidden sm:block w-32 text-left">
            {hasDiscount && (
              <div className="text-sm text-gray-400 line-through mb-1">
                {formatToman(price)}
              </div>
            )}
            <div className="font-semibold text-gray-900 text-lg">
              {formatToman(finalPrice)}
            </div>
            <div className="text-xs text-gray-500">تومان</div>
          </div>
        </div>

        <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center justify-between sm:justify-start">
            <div className="flex items-center border rounded-lg">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 sm:h-8 sm:w-8 cursor-pointer"
                onClick={onDecrease}
                disabled={quantity <= 1}
              >
                <MinusIcon className="size-4" />
              </Button>
              <span className="w-8 text-center font-medium text-sm sm:text-base">
                {toPersianNumber(quantity)}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 sm:h-8 sm:w-8 cursor-pointer"
                onClick={onIncrease}
                disabled={isMaxReached}
                title={isMaxReached ? "به حداکثر موجودی رسیده‌اید" : ""}
              >
                <PlusIcon className="size-4" />
              </Button>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 sm:hidden text-red-500 hover:text-red-600 hover:bg-red-50 cursor-pointer"
              onClick={onRemove}
            >
              <Trash2Icon className="size-4" />
            </Button>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-5 mb-2.5 mt-1 sm:mb-0 sm:mt-0">
            <div className="text-right">
              <div className="text-xs text-gray-500 mb-0.5">قیمت کل :</div>
              <div className="font-bold text-gray-900 text-base sm:text-lg">
                {formatToman((finalPrice || price) * quantity)}
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="hidden sm:flex h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 cursor-pointer"
              onClick={onRemove}
            >
              <Trash2Icon className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
