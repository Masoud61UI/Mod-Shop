import { cn } from "@/src/lib/utils";
import { Button } from "@/src/components/ui/button";
import { useCart } from "@/src/modules/checkout/hooks/use-cart";

interface Props {
  productId: string;
  price: number;
  isInStock: boolean;
  selectedColor?: string;
  selectedSize?: string;
}

export default function CartButton({
  productId,
  price,
  isInStock,
  selectedColor,
  selectedSize,
}: Props) {
  const cart = useCart();

  const isInCart = cart.isProductInCart(productId, selectedColor, selectedSize);

  const handleToggleCart = () => {
    if (isInStock && selectedColor && selectedSize) {
      cart.toggleProduct(productId, price, selectedColor, selectedSize);
    }
  };

  return (
    <Button
      className={cn(
        "flex-1 h-12 text-white text-[17px] font-medium cursor-pointer transition-all",
        isInCart
          ? "bg-green-600 hover:bg-green-700"
          : "bg-purple-600 hover:bg-purple-700",
        (!isInStock || !selectedColor || !selectedSize) &&
          "bg-gray-400 hover:bg-gray-400 cursor-not-allowed"
      )}
      onClick={handleToggleCart}
      disabled={!isInStock || !selectedColor || !selectedSize}
    >
      {!selectedColor || !selectedSize
        ? "لطفا رنگ و سایز انتخاب کنید"
        : !isInStock
          ? "ناموجود"
          : isInCart
            ? "✓ اضافه شده به سبد"
            : "🛒 افزودن به سبد خرید"}
    </Button>
  );
}
