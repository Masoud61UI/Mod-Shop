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

  const isActuallyOutOfStock = availableStock === 0 || !isInStock;

  const handleAddToCart = () => {
    if (isActuallyOutOfStock) {
      return;
    }

    if (
      !isMaxReached &&
      selectedColor &&
      selectedSize &&
      availableStock &&
      availableStock > 0
    ) {
      cart.addToCart(productId, price, selectedColor, selectedSize);
    }
  };

  const getButtonText = () => {
    if (!selectedColor || !selectedSize) {
      return "لطفا رنگ و سایز انتخاب کنید";
    }

    if (isActuallyOutOfStock) {
      return "ناموجود";
    }

    if (isInCart) {
      if (isSingleItemMax) {
        return `افزوده شد (آخرین موجودی)`;
      }
      if (isMaxReached) {
        return `حداکثر ${toPersianNumber(availableStock!)} عدد`;
      }
      return quantity > 1
        ? `${toPersianNumber(quantity)} عدد در سبد`
        : "✓ افزوده شده";
    }

    if (availableStock === 1) {
      return "🛒 خرید آخرین موجودی";
    }

    return "🛒 افزودن به سبد خرید";
  };

  const getButtonClassName = () => {
    if (!selectedColor || !selectedSize || isActuallyOutOfStock) {
      return "bg-gray-400 hover:bg-gray-400 cursor-not-allowed";
    }

    if (isSingleItemMax || isMaxReached) {
      return "bg-amber-500 hover:bg-amber-600 cursor-not-allowed";
    }

    if (isInCart) {
      return "bg-green-600 hover:bg-green-700";
    }

    return "bg-purple-600 hover:bg-purple-700";
  };

  const isButtonDisabled =
    !selectedColor ||
    !selectedSize ||
    isActuallyOutOfStock ||
    isSingleItemMax ||
    isMaxReached;

  return (
    <Button
      className={cn(
        "flex-1 h-12 text-white text-sm md:text-[15px] font-medium cursor-pointer transition-all",
        getButtonClassName()
      )}
      onClick={handleAddToCart}
      disabled={isButtonDisabled}
      title={
        isActuallyOutOfStock
          ? "این محصول در حال حاضر موجود نیست"
          : isSingleItemMax || isMaxReached
            ? `حداکثر ${toPersianNumber(availableStock!)} عدد قابل خرید است`
            : selectedColor && selectedSize
              ? `${toPersianNumber(availableStock || 0)} عدد در انبار موجود است`
              : "لطفا رنگ و سایز را انتخاب کنید"
      }
    >
      {getButtonText()}
    </Button>
  );
}
