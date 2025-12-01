import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface CartItem {
  productId: string;
  quantity: number;
  price: number;
  color?: string;
  size?: string;
}

interface CartState {
  items: CartItem[];
  addProduct: (
    productId: string,
    price: number,
    color?: string,
    size?: string
  ) => void;
  removeProduct: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  clearAllCarts: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addProduct: (productId, price, color, size) =>
        set((state) => {
          const existingItem = state.items.find(
            (item) =>
              item.productId === productId &&
              item.color === color &&
              item.size === size
          );

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.productId === productId &&
                item.color === color &&
                item.size === size
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          } else {
            return {
              items: [
                ...state.items,
                {
                  productId,
                  quantity: 1,
                  price,
                  color,
                  size,
                },
              ],
            };
          }
        }),

      removeProduct: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item.productId !== productId),
        })),

      updateQuantity: (productId, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((item) => item.productId !== productId)
              : state.items.map((item) =>
                  item.productId === productId ? { ...item, quantity } : item
                ),
        })),

      clearCart: () =>
        set({
          items: [],
        }),

      clearAllCarts: () =>
        set({
          items: [],
        }),

      getTotalPrice: () => {
        const state = get();
        return state.items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },

      getTotalItems: () => {
        const state = get();
        return state.items.reduce((total, item) => total + item.quantity, 0);
      },
    }),
    {
      name: "shop-cart",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
