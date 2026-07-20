import { ReactNode, createContext, useContext, useMemo, useState } from 'react';

import { Address, PrescriptionUpload, Product } from './api';

export type RequestItem = {
  product: Product;
  quantity: number;
};

export type RequestPrescription = PrescriptionUpload & {
  localUri: string;
};

export type CheckoutAddress = Address;

type RequestContextValue = {
  items: RequestItem[];
  itemCount: number;
  prescriptions: RequestPrescription[];
  checkoutAddress: CheckoutAddress | null;
  totalPiasters: number;
  addProduct: (product: Product) => void;
  addPrescription: (prescription: RequestPrescription) => void;
  decrementProduct: (productId: string) => void;
  getProductQuantity: (productId: string) => number;
  removePrescription: (prescriptionId: string) => void;
  setCheckoutAddress: (address: CheckoutAddress) => void;
  clearProducts: () => void;
  clearPrescriptions: () => void;
  clearRequest: () => void;
};

const RequestContext = createContext<RequestContextValue | null>(null);

type RequestProviderProps = {
  children: ReactNode;
};

export function RequestProvider({ children }: RequestProviderProps) {
  const [items, setItems] = useState<RequestItem[]>([]);
  const [prescriptions, setPrescriptions] = useState<RequestPrescription[]>([]);
  const [checkoutAddress, setCheckoutAddress] = useState<CheckoutAddress | null>(null);

  const value = useMemo<RequestContextValue>(() => {
    const itemCount = items.reduce((total, item) => total + item.quantity, 0);
    const totalPiasters = items.reduce(
      (total, item) => total + item.product.pricePiasters * item.quantity,
      0,
    );

    return {
      items,
      itemCount,
      prescriptions,
      checkoutAddress,
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
      addPrescription: (prescription) => {
        setPrescriptions((currentPrescriptions) => [
          ...currentPrescriptions,
          prescription,
        ]);
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
      removePrescription: (prescriptionId) => {
        setPrescriptions((currentPrescriptions) =>
          currentPrescriptions.filter((prescription) => prescription.id !== prescriptionId),
        );
      },
      setCheckoutAddress,
      clearProducts: () => {
        setItems([]);
      },
      clearPrescriptions: () => {
        setPrescriptions([]);
      },
      clearRequest: () => {
        setItems([]);
        setPrescriptions([]);
      },
    };
  }, [checkoutAddress, items, prescriptions]);

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
  const amount = pricePiasters / 100;
  const formattedAmount = Number.isInteger(amount)
    ? amount.toString()
    : amount.toFixed(2).replace(/0$/, '');

  return `${formattedAmount} EGP`;
}
