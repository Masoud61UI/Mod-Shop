"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, ShoppingBag, Home, Package } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import Container from "@/src/modules/home/ui/components/Container";

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const orderNumber = searchParams.get("orderNumber");
  
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedData = localStorage.getItem("checkoutData");
    if (savedData) {
      try {
        setOrderDetails(JSON.parse(savedData));
      } catch (err) {
        console.error("Error parsing checkout data:", err);
      }
    }
    
    localStorage.removeItem("shop-cart");
    
    setLoading(false);
    
  }, [orderId, orderNumber]);

  if (loading) {
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
    <div className="bg-gradient-to-b from-green-50 to-white min-h-screen py-8 sm:py-12">
      <Container>
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center mb-8">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-16 h-16 text-green-600" />
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              سفارش شما ثبت شد!
            </h1>
            <p className="text-gray-600 text-lg">
              سپاس از خرید شما. سفارش شما با موفقیت ثبت شد.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Package className="ml-2" />
              جزئیات سفارش
            </h2>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-gray-600">شماره سفارش:</span>
                <span className="font-bold text-lg">
                  {orderNumber || orderDetails?.orderNumber || "N/A"}
                </span>
              </div>
              
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-gray-600">کد پیگیری:</span>
                <span className="font-mono text-purple-600">
                  {orderId || orderDetails?.orderId || "N/A"}
                </span>
              </div>
              
              {orderDetails?.customerInfo?.fullName && (
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600">تحویل گیرنده:</span>
                  <span>{orderDetails.customerInfo.fullName}</span>
                </div>
              )}
              
              {(orderDetails?.amount || orderDetails?.totalAmount) && (
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600">مبلغ کل:</span>
                  <span className="font-bold text-xl text-green-600">
                    {(orderDetails.amount || orderDetails.totalAmount || 0).toLocaleString()} تومان
                  </span>
                </div>
              )}
              
              {orderDetails?.customerInfo?.phone && (
                <div className="flex justify-between items-center py-3">
                  <span className="text-gray-600">شماره تماس:</span>
                  <span dir="ltr">{orderDetails.customerInfo.phone}</span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-8">
            <h3 className="font-bold text-blue-800 text-lg mb-4 flex items-center">
              <ShoppingBag className="ml-2" />
              مراحل بعدی
            </h3>
            <ul className="text-blue-700 space-y-3">
              <li className="flex items-start">
                <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm ml-3 flex-shrink-0">۱</span>
                <span>در اسرع وقت با شما تماس گرفته می‌شود.</span>
              </li>
              <li className="flex items-start">
                <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm ml-3 flex-shrink-0">۲</span>
                <span>شماره سفارش خود را برای پیگیری حفظ کنید.</span>
              </li>
            </ul>
          </div>

          <div className="w-full">
            <Link href="/" className="block">
              <Button className="w-full h-14 text-lg bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800">
                <Home className="ml-2" />
                بازگشت به فروشگاه
              </Button>
            </Link>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              برای هرگونه سوال با پشتیبانی تماس بگیرید: 
              <span className="font-bold mr-2">۰۹۱۲۳۴۵۶۷۸۹</span>
            </p>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                localStorage.removeItem("checkoutData");
                localStorage.removeItem("currentOrderId");
                localStorage.removeItem("checkout-info");
                alert("اطلاعات تست پاک شد! می‌توانید دوباره تست کنید.");
              }}
              className="text-xs text-gray-400 hover:text-gray-600"
            >
              پاک کردن اطلاعات تست
            </button>
          </div>
        </div>
      </Container>
    </div>
  );
}