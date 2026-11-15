import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Product } from "../../products/types/product.types";

export type CartItem = {
  product: Product;
  quantity: number;
};

type CartState = {
  items: CartItem[];
  addItem: (product: Product) => void;
  setQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clear: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (product) =>
        set((state) => {
          const existing = state.items.find(
            (item) => item.product.id === product.id,
          );
          if (existing) {
            return {
              items: state.items.map((item) =>
                item.product.id === product.id
                  ? { ...item, product, quantity: Math.min(item.quantity + 1, 99) }
                  : item,
              ),
            };
          }
          return { items: [...state.items, { product, quantity: 1 }] };
        }),
      setQuantity: (productId, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((item) => item.product.id !== productId)
              : state.items.map((item) =>
                  item.product.id === productId
                    ? { ...item, quantity: Math.min(Math.floor(quantity), 99) }
                    : item,
                ),
        })),
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        })),
      clear: () => set({ items: [] }),
    }),
    {
      name: "vitrine-cart",
      storage: createJSONStorage(() => localStorage),
      version: 1,
    },
  ),
);
