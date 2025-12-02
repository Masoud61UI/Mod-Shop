import { useEffect } from "react";

interface CartItem {
  productId: string;
  quantity: number;
  color?: string;
  size?: string;
}

interface UseCheckoutErrorHandlerProps {
  data: any;
  items: CartItem[];
  removeProduct: (productId: string, color?: string, size?: string) => void;
  setErrorMessage: (message: string) => void;
}

export function useCheckoutErrorHandler({
  data,
  items,
  removeProduct,
  setErrorMessage,
}: UseCheckoutErrorHandlerProps) {
  useEffect(() => {
    if (data && items.length > 0) {
      const foundIds = data.docs?.map((p: any) => p.id) || [];
      const notFoundIds = items.filter(
        (item) => !foundIds.includes(item.productId)
      );

      if (notFoundIds.length > 0) {
        notFoundIds.forEach((item) => {
          removeProduct(item.productId, item.color, item.size);
        });
        setErrorMessage(`تعداد ${notFoundIds.length} محصول نامعتبر حذف شد`);

        const timer = setTimeout(() => setErrorMessage(""), 5000);
        return () => clearTimeout(timer);
      }
    }
  }, [data, items, removeProduct, setErrorMessage]);
}
