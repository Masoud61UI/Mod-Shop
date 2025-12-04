"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTRPC } from "@/src/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { useCart } from "@/src/modules/checkout/hooks/use-cart";
import Container from "@/src/modules/home/ui/components/Container";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";

export default function CheckoutInformationPage() {
  const router = useRouter();
  const { items, totalPrice, clearAllCarts } = useCart();
  const [loading, setLoading] = useState(false);
  const trpc = useTRPC();

  const { data: productsData, isLoading } = useQuery(
    trpc.checkout.getProducts.queryOptions({
      ids: items.map((item) => item.productId),
    })
  );

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    postalCode: "",
    notes: "",
  });

  const findProductById = (id: string) => {
    if (!productsData?.docs) return null;
    return productsData.docs.find((product) => product.id === id);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    localStorage.setItem("checkout-info", JSON.stringify(formData));

    setTimeout(() => {
      router.push("/checkout/payment");
    }, 1000);
  };

  if (items.length === 0) {
    router.push("/checkout/checkout");
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          <p className="mt-2 text-gray-500">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2"></div>

          <div>
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h2 className="text-lg font-bold mb-4">خلاصه سفارش</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">تعداد کالاها</span>
                  <span className="font-medium">
                    {items.reduce((sum, item) => sum + item.quantity, 0)} عدد
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">مبلغ کل</span>
                  <span className="font-bold text-lg text-purple-600">
                    {totalPrice.toLocaleString()} تومان
                  </span>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2">اقلام سفارش:</h3>
                <ul className="space-y-2">
                  {items.slice(0, 3).map((item, index) => {
                    const product = findProductById(item.productId);
                    return (
                      <li
                        key={index}
                        className="text-sm text-gray-600 flex justify-between"
                      >
                        <span className="truncate">
                          {product?.name || `محصول ${index + 1}`}
                          {item.color && ` (${item.color})`}
                        </span>
                        <span>× {item.quantity}</span>
                      </li>
                    );
                  })}
                  {items.length > 3 && (
                    <li className="text-sm text-gray-500">
                      و {items.length - 3} کالای دیگر...
                    </li>
                  )}
                </ul>
              </div>

              <Button
                variant="outline"
                onClick={() => router.push("/checkout/checkout")}
                className="w-full mt-4"
              >
                ویرایش سبد خرید
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
