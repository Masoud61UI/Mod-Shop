"use client";

import { useCartStore } from "../store/use-cart-store";

export const useCart = () => {
  const {
    items,
    addProduct,
    removeProduct,
    updateQuantity,
    clearCart,
    clearAllCarts,
    getTotalPrice,
    getTotalItems,
  } = useCartStore();

  const addToCart = (
    productId: string,
    price: number,
    color?: string,
    size?: string
  ) => {
    addProduct(productId, price, color, size);
  };

  const removeFromCart = (productId: string, color?: string, size?: string) => {
    removeProduct(productId, color, size);
  };

  const updateItemQuantity = (
    productId: string,
    quantity: number,
    color?: string,
    size?: string
  ) => {
    updateQuantity(productId, quantity, color, size);
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

  const getTotalQuantity = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  return {
    items,
    addProduct,
    removeProduct: removeFromCart,
    updateQuantity: updateItemQuantity,
    clearCart,
    clearAllCarts,
    addToCart,
    isProductInCart,
    getProductQuantity,
    getTotalQuantity,
    totalPrice: getTotalPrice(),
    totalItems: getTotalItems(),
    totalQuantity: getTotalQuantity(),
  };
};
