"use client";

import { useState } from "react";
import { useTRPC } from "@/src/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { useCart } from "../../hooks/use-cart";
import { useShippingSettings } from "../../hooks/useShippingSettings";
import { useCheckoutCalculations } from "../../hooks/useCheckoutCalculations";

import CheckoutSummary from "../components/CheckoutSummary";
import CheckoutItemsList from "../components/CheckoutItemsList";
import CheckoutEmptyState from "../components/CheckoutEmptyState";
import ErrorMessage from "../components/ErrorMessage";
import Container from "@/src/modules/home/ui/components/Container";

interface CheckoutViewProps {
  slug: string;
}

export default function CheckoutView({ slug }: CheckoutViewProps) {
  const { items, removeProduct, updateQuantity, clearAllCarts } = useCart();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [stockErrorMessage, setStockErrorMessage] = useState<string>("");

  const productIds = items.map((item) => item.productId);
  const trpc = useTRPC();

  const { data: productsData, isLoading: productsLoading } = useQuery(
    trpc.checkout.getProducts.queryOptions({
      ids: productIds,
    })
  );

  const { settings: shippingSettings } = useShippingSettings();

  const findProductById = (id: string) => {
    if (!productsData?.docs) return undefined;
    return productsData.docs.find((product: any) => product.id === id);
  };

  const { subtotal, totalQuantity, shippingCost, total, isFreeShipping } =
    useCheckoutCalculations(items, findProductById, shippingSettings);

  if (productsLoading) {
    return (
      <div className="lg:pt-16 pt-4 px-4 lg:px-12">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          <p className="mt-2 text-gray-500">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-[70vh]">
      <Container>
        <div className="py-14">
          <ErrorMessage message={errorMessage} type="error" />
          <ErrorMessage message={stockErrorMessage} type="warning" />

          <div className="grid grid-cols-1 lg:grid-cols-7 gap-4 lg:gap-16">
            <div className="lg:col-span-4">
              <h1 className="text-xl font-bold text-gray-900 mb-6">
                سبد خرید شما
              </h1>

              {items.length === 0 ? (
                <CheckoutEmptyState />
              ) : (
                <CheckoutItemsList
                  items={items}
                  data={productsData}
                  onRemove={removeProduct}
                  onUpdateQuantity={updateQuantity}
                  setStockErrorMessage={setStockErrorMessage}
                  clearAllCarts={clearAllCarts}
                />
              )}
            </div>

            <div className="lg:col-span-3">
              <CheckoutSummary
                totalQuantity={totalQuantity}
                subtotal={subtotal}
                shippingCost={shippingCost}
                isFreeShipping={isFreeShipping}
                shippingMessage={shippingSettings.message}
                freeThreshold={shippingSettings.freeThreshold}
                onCheckout={() => {
                  if (items.length === 0) {
                    setErrorMessage("سبد خرید شما خالی است");
                  } else {
                    console.log("ادامه فرآیند خرید...");
                  }
                }}
              />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
