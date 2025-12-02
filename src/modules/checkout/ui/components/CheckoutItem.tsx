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
    <div className={`flex items-center gap-4 p-4 ${!isLast ? "border-b" : ""}`}>
      <div className="relative w-20 h-20 rounded-lg bg-gray-100 overflow-hidden">
        <Image
          src={imageUrl || "/no-image2.png"}
          alt={name}
          fill
          className="object-cover"
        />
      </div>

      <div className="flex-1">
        <Link href={productUrl} className="hover:text-purple-600">
          <h3 className="font-semibold text-gray-900">{name}</h3>
        </Link>

        {(color || size) && (
          <div className="mt-1 flex gap-3 text-sm text-gray-500">
            {color && <span>رنگ: {color}</span>}
            {size && <span>سایز: {size}</span>}
          </div>
        )}

        <div className="mt-1">
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

        <div className="mt-2">
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

      <div className="flex items-center gap-4">
        <div className="flex items-center border rounded-lg">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 cursor-pointer"
            onClick={onDecrease}
            disabled={quantity <= 1}
          >
            <MinusIcon className="size-4" />
          </Button>
          <span className="w-6 text-center font-medium">
            {toPersianNumber(quantity)}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 cursor-pointer"
            onClick={onIncrease}
            disabled={isMaxReached}
            title={isMaxReached ? "به حداکثر موجودی رسیده‌اید" : ""}
          >
            <PlusIcon className="size-4" />
          </Button>
        </div>

        <div className="w-25 text-left font-bold text-gray-900">
          {formatToman((finalPrice || price) * quantity)} تومان
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 cursor-pointer"
          onClick={onRemove}
        >
          <Trash2Icon className="size-4" />
        </Button>
      </div>
    </div>
  );
}
