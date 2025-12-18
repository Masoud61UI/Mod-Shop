"use client";

import { Suspense } from "react";
import CheckoutView from "@/src/modules/checkout/ui/views/CheckoutView";

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            <p className="mt-4 text-gray-600">در حال بارگذاری سبد خرید...</p>
          </div>
        </div>
      }
    >
      <CheckoutView slug="checkout" />
    </Suspense>
  );
}
