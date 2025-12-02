import { useMemo } from "react";
import { ShippingSettingsForCalculation } from "@/src/lib/typeShipping";

export function useCheckoutCalculations(
  items: any[],
  findProductById: (id: string) => any,
  shippingSettings: ShippingSettingsForCalculation
) {
  const subtotal = useMemo(() => {
    return items.reduce((total, item) => {
      const product = findProductById(item.productId);
      if (!product) return total;

      const price = product.discountPrice || product.price;
      return total + (price || 0) * item.quantity;
    }, 0);
  }, [items, findProductById]);

  const totalQuantity = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  const shippingCost = useMemo(() => {
    if (items.length === 0) return 0;
    if (!shippingSettings.enabled) return 0;
    if (subtotal >= shippingSettings.freeThreshold) return 0;
    return shippingSettings.baseCost;
  }, [items.length, subtotal, shippingSettings]);

  const total = subtotal + shippingCost;

  return {
    subtotal,
    totalQuantity,
    shippingCost,
    total,
    isFreeShipping: shippingCost === 0,
  };
}
