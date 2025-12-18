"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";

import { cn, toPersianNumber } from "@/src/lib/utils";
import { Button } from "@/src/components/ui/button";
import { useCart } from "@/src/modules/checkout/hooks/use-cart";

interface CheckoutButtonProps {
  className?: string;
  hideIfEmpty?: boolean;
}

export default function CheckoutButton({
  className,
  hideIfEmpty = false,
}: CheckoutButtonProps) {
  const { totalItems } = useCart();

  if (hideIfEmpty && totalItems === 0) return null;

  return (
    <Button
      asChild
      variant="ghost"
      className={cn("relative group h-10 w-10 p-0", className)}
    >
      <Link
        href="/checkout"
        className="flex items-center justify-center size-full"
      >
        <div className="relative">
          <ShoppingBag className="size-5 text-gray-600 group-hover:text-purple-600 transition-colors hover:bg-purple-50" />
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-gradient-to-br from-red-500 to-red-600 text-white text-[10px] font-bold rounded-full size-4 flex items-center justify-center border border-white shadow-sm">
              {totalItems > 9 ? "۹+" : toPersianNumber(totalItems)}
            </span>
          )}
        </div>
      </Link>
    </Button>
  );
}
