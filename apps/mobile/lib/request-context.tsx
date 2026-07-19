import { ReactNode, createContext, useContext, useMemo, useState } from 'react';

import { Product } from './api';

export type RequestItem = {
  product: Product;
  quantity: number;
};

type RequestContextValue = {
  items: RequestItem[];
  itemCount: number;
  totalPiasters: number;
  addProduct: (product: Product) => void;
  decrementProduct: (productId: string) => void;
  getProductQuantity: (productId: string) => number;
  clearRequest: () => void;
};

const RequestContext = createContext<RequestContextValue | null>(null);

type RequestProviderProps = {
  children: ReactNode;
};

export function RequestProvider({ children }: RequestProviderProps) {
  const [items, setItems] = useState<RequestItem[]>([]);

  const value = useMemo<RequestContextValue>(() => {
    const itemCount = items.reduce((total, item) => total + item.quantity, 0);
    const totalPiasters = items.reduce(
      (total, item) => total + item.product.pricePiasters * item.quantity,
      0,
    );

    return {
      items,
      itemCount,
      totalPiasters,
      addProduct: (product) => {
        setItems((currentItems) => {
          const existingItem = currentItems.find((item) => item.product.id === product.id);

          if (existingItem) {
            return currentItems.map((item) =>
              item.product.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item,
            );
          }

          return [...currentItems, { product, quantity: 1 }];
        });
      },
      decrementProduct: (productId) => {
        setItems((currentItems) =>
          currentItems
            .map((item) =>
              item.product.id === productId
                ? { ...item, quantity: item.quantity - 1 }
                : item,
            )
            .filter((item) => item.quantity > 0),
        );
      },
      getProductQuantity: (productId) => {
        return items.find((item) => item.product.id === productId)?.quantity ?? 0;
      },
      clearRequest: () => {
        setItems([]);
      },
    };
  }, [items]);

  return <RequestContext.Provider value={value}>{children}</RequestContext.Provider>;
}

export function useRequest() {
  const context = useContext(RequestContext);

  if (!context) {
    throw new Error('useRequest must be used within RequestProvider');
  }

  return context;
}

export function formatPiasters(pricePiasters: number) {
  return `${(pricePiasters / 100).toFixed(2)} EGP`;
}
