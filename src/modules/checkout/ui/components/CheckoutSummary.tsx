import { formatToman, toPersianNumber } from "@/src/lib/utils";

interface CheckoutSummaryProps {
  totalQuantity: number;
  subtotal: number;
  shippingCost: number;
  isFreeShipping: boolean;
  shippingMessage: string;
  freeThreshold: number;
  onCheckout: () => void;
  isLoading?: boolean;
  buttonText?: string;
  buttonDescription?: string;
}

const getRemainingForFreeShipping = (
  subtotal: number,
  freeThreshold: number
): string => {
  const remaining = freeThreshold - subtotal;
  if (remaining > 0) {
    return `${formatToman(remaining)} تومان`;
  }
  return "";
};

export default function CheckoutSummary({
  totalQuantity,
  subtotal,
  shippingCost,
  isFreeShipping,
  shippingMessage,
  freeThreshold,
  onCheckout,
  isLoading = false,
  buttonText = "ادامه فرآیند خرید",
  buttonDescription = "ضمانت اصالت کالا | خرید بالای ۱,۵۰۰,۰۰۰ تومان رایگان",
}: CheckoutSummaryProps) {
  const total = subtotal + shippingCost;
  const remainingForFreeShipping = getRemainingForFreeShipping(
    subtotal,
    freeThreshold
  );

  const progressPercentage = Math.min((subtotal / freeThreshold) * 100, 100);

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6 sticky top-6">
      <h2 className="text-xl font-bold text-right mb-6">خلاصه سفارش</h2>

      <div className="mb-6">
        <div className="flex justify-between items-center py-3">
          <span className="text-gray-700">تعداد کالا</span>
          <span className="font-medium text-gray-900">
            {toPersianNumber(totalQuantity)} عدد
          </span>
        </div>

        <div className="flex justify-between items-center py-3 border-t border-gray-100">
          <span className="text-gray-700">جمع کل محصولات</span>
          <span className="font-medium text-gray-900">
            {formatToman(subtotal)} تومان
          </span>
        </div>

        <div className="flex justify-between items-center py-3 border-t border-gray-100">
          <span className="text-gray-700">هزینه ارسال</span>
          <span
            className={`font-medium ${isFreeShipping ? "text-green-600" : "text-gray-900"}`}
          >
            {isFreeShipping ? "رایگان" : `${formatToman(shippingCost)} تومان`}
          </span>
        </div>

        {!isFreeShipping && subtotal < freeThreshold && (
          <div className="bg-gray-50 border border-blue-100 rounded-lg p-4 mt-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-sm">🚚</span>
              </div>
              <p className="text-sm font-medium text-blue-800">
                فقط {remainingForFreeShipping} دیگر تا ارسال رایگان!
              </p>
            </div>

            <div className="w-full bg-blue-100 rounded-full h-[6px] mb-2">
              <div
                className="bg-blue-600 h-[6px] rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>

            <div className="flex justify-between text-xs text-blue-600">
              <span>{formatToman(subtotal)} تومان</span>
              <span>{formatToman(freeThreshold)} تومان</span>
            </div>

            <p className="text-xs text-blue-600 mt-4 text-center">
              برای خریدهای بالای {formatToman(freeThreshold)} تومان، هزینه ارسال
              رایگان خواهد بود.{" "}
            </p>
          </div>
        )}

        {isFreeShipping && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-lg">🎉</span>
              </div>
              <div>
                <p className="text-sm font-bold text-green-800">
                  تبریک! ارسال شما رایگان شد!
                </p>
                <p className="text-xs text-green-600 mt-1">
                  خرید شما از {formatToman(freeThreshold)} تومان بیشتر شد.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-gray-200 pt-6 pb-6">
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold text-gray-900">
            مبلغ قابل پرداخت
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-purple-600">
              {formatToman(total)}
            </span>
            <span className="text-sm text-gray-500 mr-1">تومان</span>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <button
          onClick={onCheckout}
          disabled={isLoading || totalQuantity === 0}
          className={`w-full h-14 rounded-xl font-medium transition-all duration-200 ${
            isLoading || totalQuantity === 0
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-purple-600 hover:bg-purple-700 text-white cursor-pointer shadow-sm hover:shadow"
          }`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>در حال پردازش...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <span className="text-[16px] font-semibold">{buttonText}</span>
            </div>
          )}
        </button>
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <span className="text-green-600">✓</span>
            <span>ضمانت اصالت کالا</span>
          </div>
          <div className="w-px h-4 bg-gray-300"></div>
          <div className="flex items-center gap-1">
            <span className="text-green-600">✓</span>
            <span>ارسال سریع</span>
          </div>
        </div>
      </div>
    </div>
  );
}
