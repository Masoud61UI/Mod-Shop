"use client";

import { Button } from "@/src/components/ui/button";
import { formatToman, toPersianNumber } from "@/src/lib/utils";

interface CheckoutSummaryProps {
  totalQuantity: number;
  subtotal: number;
  shippingCost: number;
  isFreeShipping: boolean;
  shippingMessage: string;
  freeThreshold: number;
  onCheckout: () => void;
}

export default function CheckoutSummary({
  totalQuantity,
  subtotal,
  shippingCost,
  isFreeShipping,
  freeThreshold,
  onCheckout,
}: CheckoutSummaryProps) {
  const total = subtotal + shippingCost;
  const hasItems = totalQuantity > 0;
  const remainingForFree = Math.max(0, freeThreshold - subtotal);

  return (
    <div className="bg-white border rounded-lg p-6 sticky top-24">
      <h2 className="text-[17px] font-bold text-gray-900 mb-4">خلاصه سفارش</h2>

      <div className="space-y-3 mb-6">
        {hasItems && (
          <>
            <div className="flex justify-between text-[15px]">
              <span className="text-gray-600">تعداد کالاها</span>
              <span className="font-medium">
                {toPersianNumber(totalQuantity)} عدد
              </span>
            </div>
            <div className="flex justify-between text-[15px]">
              <span className="text-gray-600">مجموع قیمت کالاها</span>
              <span className="font-medium">{formatToman(subtotal)}</span>
            </div>
            <div className="flex justify-between text-[15px]">
              <span className="text-gray-600">هزینه ارسال</span>
              <span
                className={`font-medium text-sm ${
                  isFreeShipping ? "text-green-600" : ""
                }`}
              >
                {isFreeShipping ? "رایگان" : formatToman(shippingCost)}
              </span>
            </div>

            {!isFreeShipping && remainingForFree > 0 && (
              <div className="text-sm text-blue-600 bg-blue-50 p-2 rounded w-fit my-2">
                🚚 فقط {formatToman(remainingForFree)} تومان دیگر تا ارسال
                رایگان!
              </div>
            )}
          </>
        )}
      </div>

      {hasItems && (
        <div className="border-t pt-4 mb-6">
          <div className="flex justify-between text-[17px] font-bold">
            <span>مبلغ قابل پرداخت</span>
            <span className="text-purple-600">{formatToman(total)} تومان</span>
          </div>
        </div>
      )}

      <Button
        className="w-full h-12 bg-purple-500 hover:bg-purple-600 text-[17px] font-medium cursor-pointer"
        onClick={onCheckout}
        disabled={!hasItems}
      >
        {hasItems ? "ادامه فرآیند خرید" : "سبد خرید خالی است"}
      </Button>

      <div className="mt-6 text-sm text-gray-500">
        <p className="mb-2">✅ ضمانت کیفیت و اصالت کالا</p>
        <p>
          {shippingCost === 0 && subtotal === 0
            ? "🎉 تمام سفارش‌ها با ارسال رایگان"
            : shippingCost === 0 && subtotal > 0
              ? `✅ خرید بالای ${formatToman(freeThreshold)} ، ارسال رایگان`
              : `🚚 خرید بالای ${formatToman(freeThreshold)} ، ارسال رایگان`}
        </p>
      </div>
    </div>
  );
}
