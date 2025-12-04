"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useTRPC } from "@/src/trpc/client";
import { useRouter } from "next/navigation";
import { useCart } from "../../hooks/use-cart";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useShippingSettings } from "../../hooks/useShippingSettings";
import { useCheckoutCalculations } from "../../hooks/useCheckoutCalculations";

import CheckoutSummary from "../components/CheckoutSummary";
import CheckoutItemsList from "../components/CheckoutItemsList";
import CheckoutEmptyState from "../components/CheckoutEmptyState";
import ErrorMessage from "../components/ErrorMessage";
import Container from "@/src/modules/home/ui/components/Container";
import { useCheckoutState } from "../../hooks/useCheckoutState";

interface CheckoutViewProps {
  slug: string;
}

export default function CheckoutView({ slug }: CheckoutViewProps) {
  const router = useRouter();
  const { items, removeProduct, updateQuantity, clearAllCarts, totalPrice } =
    useCart();
  const { settings: shippingSettings } = useShippingSettings();
  const [queryStates, setQueryStates] = useCheckoutState();
  const { success, cancel } = queryStates;
  const trpc = useTRPC();

  const [errorMessage, setErrorMessage] = useState<string>("");
  const [stockErrorMessage, setStockErrorMessage] = useState<string>("");
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [orderCreated, setOrderCreated] = useState(false);

  const productIds = useMemo(
    () => items.map((item) => item.productId),
    [items]
  );

  const { data: productsData, isLoading: productsLoading } = useQuery(
    trpc.checkout.getProducts.queryOptions({
      ids: productIds,
    })
  );

  const createOrder = useMutation(
    trpc.checkout.createOrder.mutationOptions({
      onSuccess: (data) => {
        setOrderCreated(true);

        clearAllCarts();

        localStorage.setItem(
          "lastOrder",
          JSON.stringify({
            orderId: data.orderId,
            orderNumber: data.orderNumber,
            amount: data.amount,
            createdAt: new Date().toISOString(),
          })
        );

        router.push(
          `/checkout/success?orderId=${data.orderId}&orderNumber=${data.orderNumber}`
        );
      },
      onError: (error) => {
        console.error("Create order error:", error);
        setErrorMessage(
          error.shape?.message ||
            error.message ||
            "خطا در ایجاد سفارش. لطفا دوباره تلاش کنید."
        );
        setCheckoutLoading(false);
      },
      onSettled: () => {
        setCheckoutLoading(false);
      },
    })
  );

  const findProductById = useCallback(
    (id: string) => {
      if (!productsData?.docs) return undefined;
      return productsData.docs.find((product: any) => product.id === id);
    },
    [productsData?.docs]
  );

  const { subtotal, totalQuantity, shippingCost, total, isFreeShipping } =
    useCheckoutCalculations(items, findProductById, shippingSettings);

  const hasUserInfo = useCallback(() => {
    try {
      const savedData = localStorage.getItem("checkoutData");
      if (!savedData) return false;

      const data = JSON.parse(savedData);
      return (
        data.fullName &&
        data.phone &&
        data.address &&
        data.city &&
        data.postalCode
      );
    } catch {
      return false;
    }
  }, []);

  const handleCreateOrder = useCallback(async () => {
    if (items.length === 0) {
      setErrorMessage("سبد خرید شما خالی است");
      return;
    }

    setCheckoutLoading(true);
    setErrorMessage("");

    try {
      const productDetails = items.map((item) => {
        const product = findProductById(item.productId);
        return {
          productId: item.productId,
          productName: product?.name || "محصول",
          quantity: item.quantity,
          price: item.price,
          color: item.color,
          size: item.size,
        };
      });

      const savedCheckoutData = localStorage.getItem("checkoutData");
      let customerInfo = {
        fullName: "",
        phone: "",
        email: "",
        address: "",
        city: "",
        postalCode: "",
        notes: "",
      };

      if (savedCheckoutData) {
        try {
          customerInfo = JSON.parse(savedCheckoutData);
        } catch (e) {
          console.error("Error parsing saved checkout data:", e);
        }
      }

      await createOrder.mutateAsync({
        productIds,
        customerInfo,
        shippingCost,
        items: productDetails,
      });
    } catch (error) {
      console.error("Checkout error:", error);
      setErrorMessage("خطا در پردازش سفارش");
      setCheckoutLoading(false);
    }
  }, [items, findProductById, createOrder, productIds, shippingCost]);

  const handleProceedToInformation = useCallback(() => {
    if (items.length === 0) {
      setErrorMessage("سبد خرید شما خالی است");
      return;
    }

    localStorage.setItem("cartItems", JSON.stringify(items));
    router.push("/checkout/information");
  }, [items, router]);

  useEffect(() => {
    if (success) {
      alert("پرداخت با موفقیت انجام شد!");
      router.push("/checkout/success");
      setQueryStates({ success: null, cancel: null });
    }

    if (cancel) {
      alert("سفارش توسط شما لغو شد.");
      setQueryStates({ success: null, cancel: null });
    }
  }, [success, cancel, router, setQueryStates]);

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
                onCheckout={
                  hasUserInfo() ? handleCreateOrder : handleProceedToInformation
                }
                isLoading={checkoutLoading || createOrder.isPending}
                buttonText={
                  hasUserInfo() ? "ثبت نهایی سفارش" : "تکمیل اطلاعات و ادامه"
                }
                buttonDescription={
                  hasUserInfo()
                    ? "برای ثبت نهایی سفارش کلیک کنید"
                    : "ابتدا اطلاعات ارسال را تکمیل کنید"
                }
              />

              {hasUserInfo() && (
                <div className="mt-6 bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                  <h3 className="font-medium text-gray-900 mb-4">
                    نحوه پرداخت
                  </h3>
                  <div className="space-y-3 text-sm text-gray-600">
                    <p className="flex items-start">
                      <span className="ml-2">•</span>
                      <span>پس از ثبت سفارش، با شما تماس گرفته می‌شود.</span>
                    </p>
                    <p className="flex items-start">
                      <span className="ml-2">•</span>
                      <span>
                        پرداخت به صورت نقدی در هنگام تحویل کالا انجام می‌شود.
                      </span>
                    </p>
                    <p className="flex items-start">
                      <span className="ml-2">•</span>
                      <span>قیمت نهایی در این صفحه نمایش داده شده است.</span>
                    </p>
                  </div>
                </div>
              )}
            </div>

            {success && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                سفارش شما با موفقیت ثبت شد!
              </div>
            )}

            {cancel && (
              <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
                سفارش توسط شما لغو شد.
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}
