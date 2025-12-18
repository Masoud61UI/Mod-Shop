"use client";

import { Trash2Icon } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import CheckoutItem from "./CheckoutItem";

interface CheckoutItemsListProps {
  items: any[];
  data: any;
  onRemove: (productId: string, color?: string, size?: string) => void;
  onUpdateQuantity: (
    productId: string,
    quantity: number,
    color?: string,
    size?: string
  ) => void;
  setStockErrorMessage: (message: string) => void;
  clearAllCarts: () => void;
}

export default function CheckoutItemsList({
  items,
  data,
  onRemove,
  onUpdateQuantity,
  setStockErrorMessage,
  clearAllCarts,
}: CheckoutItemsListProps) {
  const findProductById = (id: string) => {
    if (!data?.docs) return undefined;
    return data.docs.find((product: any) => product.id === id);
  };

  const getAvailableStockForItem = (item: any) => {
    const product = findProductById(item.productId);
    if (!product?.inventory) return 0;

    const inventoryItem = product.inventory.find(
      (inv: any) => inv.colorName === item.color && inv.size === item.size
    );

    return inventoryItem?.stock || 0;
  };

  const calculateSubtotal = () => {
    return items.reduce((total, item) => {
      const product = findProductById(item.productId);
      if (!product) return total;

      const price = product.discountPrice || product.price;
      return total + (price || 0) * item.quantity;
    }, 0);
  };

  const subtotal = calculateSubtotal();

  return (
    <div className="border rounded-lg overflow-hidden bg-white">
      {items.length === 0 ? (
        <div className="p-8 text-center">
          <div className="text-gray-400 text-lg mb-2">
            سبد خرید شما خالی است
          </div>
          <p className="text-gray-500 text-sm">
            محصولاتی را به سبد خرید اضافه کنید
          </p>
        </div>
      ) : (
        <>
          {items.map((item, index) => {
            const product = findProductById(item.productId);
            if (!product) return null;

            const availableStock = getAvailableStockForItem(item);

            return (
              <CheckoutItem
                key={`${item.productId}-${item.color || "no-color"}-${item.size || "no-size"}`}
                id={item.productId}
                isLast={index === items.length - 1}
                imageUrl={product.image?.url || undefined}
                name={product.name}
                productUrl={`/products/${product.slug || product.id}`}
                price={product.price}
                discountPrice={product.discountPrice || undefined}
                quantity={item.quantity}
                availableStock={availableStock}
                color={item.color}
                size={item.size}
                onRemove={() => onRemove(item.productId, item.color, item.size)}
                onIncrease={() => {
                  if (item.quantity < availableStock) {
                    onUpdateQuantity(
                      item.productId,
                      item.quantity + 1,
                      item.color,
                      item.size
                    );
                    setStockErrorMessage("");
                  } else {
                    setStockErrorMessage(
                      `حداکثر ${availableStock} عدد از محصول "${product.name}" موجود است`
                    );
                    setTimeout(() => setStockErrorMessage(""), 3000);
                  }
                }}
                onDecrease={() => {
                  const newQuantity = Math.max(1, item.quantity - 1);
                  onUpdateQuantity(
                    item.productId,
                    newQuantity,
                    item.color,
                    item.size
                  );
                }}
              />
            );
          })}

          {items.length > 0 && (
            <div className="border-t p-4">
              <Button
                variant="outline"
                onClick={clearAllCarts}
                className="w-full sm:w-auto text-red-500 hover:text-red-600 hover:border-red-300 cursor-pointer text-sm"
              >
                <Trash2Icon className="size-4 ml-0.5" />
                حذف همه محصولات
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
