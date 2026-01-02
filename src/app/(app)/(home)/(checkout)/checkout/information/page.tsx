"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTRPC } from "@/src/trpc/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useCart } from "@/src/modules/checkout/hooks/use-cart";
import Container from "@/src/modules/home/ui/components/Container";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
import { useShippingSettings } from "@/src/modules/checkout/hooks/useShippingSettings";
import { useCheckoutCalculations } from "@/src/modules/checkout/hooks/useCheckoutCalculations";
import CheckoutSummary from "@/src/modules/checkout/ui/components/CheckoutSummary";

export default function CheckoutInformationPage() {
  const router = useRouter();
  const { items, clearAllCarts } = useCart();
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const trpc = useTRPC();

  useEffect(() => {
    if (shouldRedirect) {
      router.push("/checkout");
    }
  }, [shouldRedirect, router]);

  useEffect(() => {
    if (items.length === 0) {
      setShouldRedirect(true);
    }
  }, [items]);

  const { data: productsData, isLoading: productsLoading } = useQuery(
    trpc.checkout.getProducts.queryOptions({
      ids: items.map((item) => item.productId),
    })
  );

  const { settings: shippingSettings } = useShippingSettings();

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    postalCode: "",
    notes: "",
  });

  const createOrderMutation = useMutation(
    trpc.checkout.createOrder.mutationOptions({
onSuccess: (result) => {  
  const checkoutData = {
    orderId: result.orderId,
    orderNumber: result.orderNumber,
    amount: result.amount,
    customerInfo: formData,
    cartItems: items,
    shippingCost,
  };
  
  localStorage.setItem("checkoutData", JSON.stringify(checkoutData));
  localStorage.setItem("currentOrderId", result.orderId);
  localStorage.setItem("checkout-info", JSON.stringify(formData));

  clearAllCarts();
  
  setTimeout(() => {
    window.location.href = `/checkout-success?orderId=${result.orderId}&orderNumber=${result.orderNumber}`;
  }, 300);
},
      onError: (error) => {
        console.error("Error creating order:", error);
        alert(error?.message || "خطا در ایجاد سفارش. لطفا دوباره تلاش کنید.");
        setLoading(false);
      },
    })
  );

  useEffect(() => {
    const savedData = localStorage.getItem("checkout-info");
    if (savedData) {
      try {
        setFormData(JSON.parse(savedData));
      } catch (error) {
        console.error("Error parsing saved checkout data:", error);
      }
    }
  }, []);

  const findProductById = (id: string) => {
    if (!productsData?.docs) return null;
    return productsData.docs.find((product: any) => product.id === id);
  };

  const { subtotal, totalQuantity, shippingCost, total, isFreeShipping } =
    useCheckoutCalculations(items, findProductById, shippingSettings);

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.fullName.trim() || formData.fullName.length < 2) {
      errors.fullName = "نام و نام خانوادگی باید حداقل ۲ حرف باشد";
    }

    if (!formData.phone.match(/^09[0-9]{9}$/)) {
      errors.phone = "شماره موبایل معتبر وارد کنید (مثال: 09123456789)";
    }

    if (!formData.address.trim() || formData.address.length < 10) {
      errors.address = "آدرس باید حداقل ۱۰ حرف باشد";
    }

    if (!formData.city.trim()) {
      errors.city = "شهر را وارد کنید";
    }

    if (!formData.postalCode.match(/^\d{10}$/)) {
      errors.postalCode = "کد پستی باید ۱۰ رقم باشد";
    }

    if (formData.email && !formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      errors.email = "ایمیل معتبر وارد کنید";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const createOrder = async () => {
    if (!validateForm()) {
      return false;
    }

    setLoading(true);

    try {
      const orderItems = items.map((item) => {
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

      await createOrderMutation.mutateAsync({
        productIds: items.map((item) => item.productId),
        customerInfo: formData,
        shippingCost: shippingCost,
        items: orderItems,
      });

      return true;
    } catch (error) {
      setLoading(false);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createOrder();
  };

  const handleCheckoutSummaryClick = async () => {
    await createOrder();
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  if (shouldRedirect) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          <p className="mt-2 text-gray-500">در حال هدایت به سبد خرید...</p>
        </div>
      </div>
    );
  }

  if (productsLoading) {
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
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-[80vh] py-8 sm:py-12">
      <Container>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            تکمیل اطلاعات ارسال
          </h1>
          <p className="text-gray-600 mt-2">
            لطفا اطلاعات زیر را برای ارسال سفارش تکمیل کنید
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-7 gap-6 lg:gap-8">
          <div className="lg:col-span-4 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-4">اطلاعات گیرنده</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-sm font-medium">
                      نام و نام خانوادگی *
                    </Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="مانند: علی محمدی"
                      className={`${formErrors.fullName ? "border-red-500" : ""} 
                      placeholder:text-sm 
                      placeholder:text-gray-300
                      focus-visible:ring-1 
                      focus-visible:ring-purple-200 
                      focus-visible:ring-offset-0`}
                    />
                    {formErrors.fullName && (
                      <p className="text-red-500 text-xs">
                        {formErrors.fullName}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium">
                      شماره موبایل *
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="مانند: 09123456789"
                      className={`${formErrors.phone ? "border-red-500" : ""} 
                        placeholder:text-sm 
                        placeholder:text-gray-300
                        focus-visible:ring-1 
                        focus-visible:ring-purple-200 
                        focus-visible:ring-offset-0`}
                    />
                    {formErrors.phone && (
                      <p className="text-red-500 text-xs">{formErrors.phone}</p>
                    )}
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    آدرس ایمیل (اختیاری)
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="مانند: ali@gmail.com"
                    className={`${formErrors.email ? "border-red-500" : ""} 
                      placeholder:text-sm 
                      placeholder:text-gray-300
                      focus-visible:ring-1 
                      focus-visible:ring-purple-200 
                      focus-visible:ring-offset-0`}
                  />
                  {formErrors.email && (
                    <p className="text-red-500 text-xs">{formErrors.email}</p>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-4">آدرس ارسال</h2>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-sm font-medium">
                      آدرس کامل *
                    </Label>
                    <Textarea
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="خیابان، کوچه، پلاک، طبقه، واحد"
                      rows={3}
                      className={`${formErrors.address ? "border-red-500" : ""}
                        placeholder:text-sm 
                        placeholder:text-gray-300
                        focus-visible:ring-1 
                        focus-visible:ring-purple-200 
                        focus-visible:ring-offset-0 resize-none`}
                    />
                    {formErrors.address && (
                      <p className="text-red-500 text-xs">
                        {formErrors.address}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city" className="text-sm font-medium">
                        شهر *
                      </Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="مانند: تهران"
                        className={`${formErrors.city ? "border-red-500" : ""} 
                          placeholder:text-sm 
                          placeholder:text-gray-300
                          focus-visible:ring-1 
                          focus-visible:ring-purple-200 
                          focus-visible:ring-offset-0`}
                      />
                      {formErrors.city && (
                        <p className="text-red-500 text-xs">
                          {formErrors.city}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="postalCode"
                        className="text-sm font-medium"
                      >
                        کد پستی *
                      </Label>
                      <Input
                        id="postalCode"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        placeholder="۱۰ رقم کد پستی"
                        maxLength={10}
                        className={`${formErrors.postalCode ? "border-red-500" : ""} 
                          placeholder:text-sm 
                          placeholder:text-gray-300
                          focus-visible:ring-1 
                          focus-visible:ring-purple-200 
                          focus-visible:ring-offset-0`}
                      />
                      {formErrors.postalCode && (
                        <p className="text-red-500 text-xs">
                          {formErrors.postalCode}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="space-y-2">
                  <Label htmlFor="notes" className="text-sm font-medium">
                    یادداشت سفارش (اختیاری)
                  </Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="مثال: در صورت نبودن من، با پدرم تماس بگیرید"
                    rows={2}
                    className={`placeholder:text-sm 
                      placeholder:text-gray-300
                      focus-visible:ring-1 
                      focus-visible:ring-purple-200 
                      focus-visible:ring-offset-0 resize-none`}
                  />
                  <p className="text-xs text-gray-500">
                    هرگونه نکته‌ای که لازم است پیک یا مسئول ارسال بداند
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/checkout")}
                  className="sm:order-2"
                >
                  بازگشت به سبد خرید
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 sm:order-1 sm:flex-1"
                >
                  {loading ? (
                    <>
                      <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      در حال پردازش...
                    </>
                  ) : (
                    "ادامه و پرداخت"
                  )}
                </Button>
              </div>
            </form>
          </div>

          <div className="lg:col-span-3">

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h3 className="font-medium text-gray-900 mb-4">
                اقلام سفارش شما
              </h3>
              <div className="space-y-3">
                {items.map((item, index) => {
                  const product = findProductById(item.productId);
                  return (
                    <div
                      key={index}
                      className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0"
                    >
                      <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center">
                        {product?.image?.url ? (
                          <img
                            src={product.image.url}
                            alt={product.name}
                            className="w-10 h-10 object-cover rounded"
                          />
                        ) : (
                          <div className="text-gray-300 text-xs text-center">
                            بدون تصویر
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium truncate">
                          {product?.name || `محصول ${index + 1}`}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                          {item.color && (
                            <span className="bg-gray-100 px-2 py-1 rounded">
                              رنگ: {item.color}
                            </span>
                          )}
                          {item.size && (
                            <span className="bg-gray-100 px-2 py-1 rounded">
                              سایز: {item.size}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-medium">
                          {(item.price * item.quantity).toLocaleString()} تومان
                        </p>
                        <p className="text-xs text-gray-500">
                          {item.quantity} × {item.price.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-6">
              <h4 className="font-medium text-blue-800 mb-2">نکات مهم</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li className="flex items-start">
                  <span className="ml-2">•</span>
                  <span>اطلاعات تماس باید متعلق به گیرنده سفارش باشد</span>
                </li>
                <li className="flex items-start">
                  <span className="ml-2">•</span>
                  <span>پس از ثبت، سفارش قابل ویرایش نیست</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}