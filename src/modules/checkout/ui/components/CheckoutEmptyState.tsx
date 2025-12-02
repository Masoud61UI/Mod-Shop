"use client";

import Link from "next/link";
import { Button } from "@/src/components/ui/button";

export default function CheckoutEmptyState() {
  return (
    <div className="border rounded-lg bg-white p-8 text-center">
      <div className="text-gray-400 mb-4">
        <svg
          className="w-16 h-16 mx-auto"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      </div>
      <p className="text-gray-500 mb-4">سبد خرید شما خالی است</p>
      <Button asChild className="bg-purple-600 hover:bg-purple-700">
        <Link href="/products">مشاهده محصولات</Link>
      </Button>
    </div>
  );
}
