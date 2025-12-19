import { useState } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/src/components/ui/button";
import { CheckCheckIcon, Share2Icon } from "lucide-react";
import { toast } from "sonner";

const CartButton = dynamic(() => import("../components/CartButton"), {
  ssr: false,
  loading: () => (
    <Button
      disabled
      className="flex-1 h-12 text-white text-lg font-medium cursor-pointer transition-all bg-purple-600"
    >
      افزودن به سبد خرید
    </Button>
  ),
});

interface PriceStockInfoProps {
  productId: string;
  price: number;
  isInStock: boolean;
  availableStock?: number;
  selectedColor: string;
  selectedSize: string;
}

export default function PriceStockInfo({
  productId,
  price,
  isInStock,
  availableStock,
  selectedColor,
  selectedSize,
}: PriceStockInfoProps) {
  const [isCopied, setIsCopied] = useState(false);

  return (
    <div className="flex items-center gap-3">
      <CartButton
        productId={productId}
        price={price}
        isInStock={isInStock}
        availableStock={availableStock}
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
  );
}
