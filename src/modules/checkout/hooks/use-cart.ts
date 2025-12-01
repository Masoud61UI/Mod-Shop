import { useCartStore } from "../store/use-cart-store";

export const useCart = () => {
  const {
    items,
    addProduct,
    removeProduct,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems,
  } = useCartStore();

  const toggleProduct = (
    productId: string,
    price: number,
    color?: string,
    size?: string
  ) => {
    const existingItem = items.find(
      (item) =>
        item.productId === productId &&
        item.color === color &&
        item.size === size
    );

    if (existingItem) {
      removeProduct(productId);
    } else {
      addProduct(productId, price, color, size);
    }
  };

  const isProductInCart = (
    productId: string,
    color?: string,
    size?: string
  ) => {
    return items.some(
      (item) =>
        item.productId === productId &&
        item.color === color &&
        item.size === size
    );
  };

  const getProductQuantity = (
    productId: string,
    color?: string,
    size?: string
  ) => {
    const item = items.find(
      (item) =>
        item.productId === productId &&
        item.color === color &&
        item.size === size
    );
    return item ? item.quantity : 0;
  };

  return {
    items,
    addProduct,
    removeProduct,
    updateQuantity,
    clearCart,
    toggleProduct,
    isProductInCart,
    getProductQuantity,
    totalPrice: getTotalPrice(),
    totalItems: getTotalItems(),
  };
};
