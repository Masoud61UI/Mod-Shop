import Link from "next/link";
import { ShoppingCartIcon } from "lucide-react";

import { cn } from "@/src/lib/utils";
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
    <Button asChild className={cn("relative", className)}>
      <Link href="/checkout" className="relative">
        <ShoppingCartIcon className="size-[18px]" />
        {totalItems > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center border-2 border-white">
            {totalItems}
          </span>
        )}
      </Link>
    </Button>
  );
}
