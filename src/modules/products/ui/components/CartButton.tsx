import { cn } from "@/src/lib/utils";
import { toPersianNumber } from "@/src/lib/utils";
import { Button } from "@/src/components/ui/button";
import { useCart } from "@/src/modules/checkout/hooks/use-cart";

interface Props {
  productId: string;
  price: number;
  isInStock: boolean;
  availableStock?: number;
  selectedColor?: string;
  selectedSize?: string;
}

export default function CartButton({
  productId,
  price,
  isInStock,
  availableStock,
  selectedColor,
  selectedSize,
}: Props) {
  const cart = useCart();

  const quantity = cart.getProductQuantity(
    productId,
    selectedColor,
    selectedSize
  );
  const isInCart = quantity > 0;

  const isMaxReached = availableStock ? quantity >= availableStock : false;
  const isSingleItemMax = availableStock === 1 && quantity === 1;

  const handleAddToCart = () => {
    if (
      !isMaxReached &&
      isInStock &&
      selectedColor &&
      selectedSize &&
      availableStock
    ) {
      cart.addToCart(productId, price, selectedColor, selectedSize);
    }
  };

  const getButtonText = () => {
    if (!selectedColor || !selectedSize) {
      return "لطفا رنگ و سایز انتخاب کنید";
    }

    if (!isInStock) {
      return "ناموجود";
    }

    if (isInCart) {
      if (isSingleItemMax) {
        return `اضافه شد! حداکثر موجودی (${toPersianNumber(availableStock!)})`;
      }
      if (isMaxReached) {
        return `اضافه شد! حداکثر موجودی (${toPersianNumber(availableStock!)})`;
      }
      return quantity > 1
        ? `✓ ${toPersianNumber(quantity)} عدد در سبد`
        : "✓ اضافه شده به سبد";
    }

    return "🛒 افزودن به سبد خرید";
  };

  const getButtonClassName = () => {
    if (!isInStock || !selectedColor || !selectedSize) {
      return "bg-gray-400 hover:bg-gray-400 cursor-not-allowed";
    }

    if (isSingleItemMax || isMaxReached) {
      return "bg-red-500 hover:bg-red-600 cursor-not-allowed";
    }

    if (isInCart) {
      return "bg-green-600 hover:bg-green-700";
    }

    return "bg-purple-600 hover:bg-purple-700";
  };

  const isButtonDisabled =
    !isInStock ||
    !selectedColor ||
    !selectedSize ||
    isSingleItemMax ||
    isMaxReached;

  return (
    <Button
      className={cn(
        "flex-1 h-12 text-white text-sm md:text-[17px] font-medium cursor-pointer transition-all",
        getButtonClassName()
      )}
      onClick={handleAddToCart}
      disabled={isButtonDisabled}
      title={
        isSingleItemMax || isMaxReached
          ? `حداکثر ${toPersianNumber(availableStock!)} عدد قابل خرید است`
          : ""
      }
    >
      {getButtonText()}
    </Button>
  );
}
